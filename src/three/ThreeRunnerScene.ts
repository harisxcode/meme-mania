import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  CharacterRig,
  createCharacterRig,
  createChaserRig,
} from './characterModels';
import {
  createCollectibleMesh,
  createObstacleMesh,
  createTrackSegment,
  LANE_COORDS,
} from './trackAndObstacles';
import { soundManager } from '../audio/soundManager';
import {
  ActivePowerUp,
  CollectibleInstance,
  GameState,
  Lane,
  ObstacleInstance,
  ObstacleType,
  PowerUpType,
} from '../types/game';

// Pre-allocated math objects to avoid garbage collection
const _vec3 = new THREE.Vector3();
const _playerBox = new THREE.Box3();
const _obstacleBox = new THREE.Box3();
const _coinBox = new THREE.Box3();

export interface GameCallbacks {
  onScoreUpdate: (score: number, distance: number, coins: number) => void;
  onPowerUpCollected: (type: PowerUpType, duration: number) => void;
  onPowerUpExpired: (type: PowerUpType) => void;
  onStumble: (threatLevel: number) => void;
  onGameOver: (reason: string, finalScore: number) => void;
  onFloatingText: (text: string, color: string) => void;
}

export class ThreeRunnerScene {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animFrameId: number | null = null;
  private isDisposed = false;

  // Scene elements
  private playerGroup = new THREE.Group();
  private playerRig!: CharacterRig;
  private chaserGroup = new THREE.Group();
  private chaserRig!: CharacterRig;
  private trackSegments: THREE.Group[] = [];

  // Active track items
  private obstacles: { data: ObstacleInstance; mesh: THREE.Group }[] = [];
  private collectibles: { data: CollectibleInstance; mesh: THREE.Group }[] = [];
  private particleSystems: THREE.Points[] = [];

  // Player gameplay state
  private currentLane: Lane = 0;
  private targetLaneX: number = 0;
  private currentLaneX: number = 0;
  private isJumping: boolean = false;
  private jumpVelocity: number = 0;
  private jumpY: number = 0;
  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private characterId: string = 'doge';

  // Game runner state
  private gameState: GameState = 'menu';
  private runSpeed: number = 18; // Base units per second
  private targetRunSpeed: number = 18;
  private distanceTraveled: number = 0;
  private coinsCollected: number = 0;
  private score: number = 0;
  private chaserDistance: number = 7.5; // Starts safe distance behind
  private chaserThreat: number = 0; // 0 (safe) to 1 (about to grab)
  private runTime: number = 0;

  // Active powerups
  private activePowerUps: Map<PowerUpType, { remaining: number; total: number }> = new Map();
  private hasRickrollRevive: boolean = false;
  private hasCoffeeShield: boolean = false;

  // Visual effects
  private speedLinesMesh: THREE.LineSegments | null = null;
  private nyanTrailMesh: THREE.Mesh | null = null;
  private shieldBubbleMesh: THREE.Mesh | null = null;

  // Callbacks
  private callbacks: GameCallbacks;

  constructor(container: HTMLDivElement, callbacks: GameCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.initRenderer();
    this.initScene();
    this.initLighting();
    this.initPlayerAndChaser('doge');
    this.initTrack();
    this.initVfx();

    window.addEventListener('resize', this.onWindowResize);
    this.startLoop();
  }

  private initRenderer() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c061a); // Vaporwave dark midnight
    this.scene.fog = new THREE.FogExp2(0x0c061a, 0.016);

    // Camera setup for Temple Run 3rd person perspective
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 200);
    this.camera.position.set(0, 3.8, 6.2);
    this.camera.lookAt(0, 1.4, -6.0);

    // Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();
  }

  private initLighting() {
    // Balanced Studio Rig
    const hemiLight = new THREE.HemisphereLight(0xec4899, 0x1e1b4b, 0.9);
    this.scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    keyLight.position.set(10, 20, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 45;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-8, 12, -15);
    this.scene.add(rimLight);
  }

  public setCharacter(charId: string) {
    this.characterId = charId;
    this.initPlayerAndChaser(charId);
  }

  private initPlayerAndChaser(charId: string) {
    if (this.playerRig) {
      this.playerGroup.remove(this.playerRig.group);
    }
    this.playerRig = createCharacterRig(charId);
    this.playerGroup.add(this.playerRig.group);
    this.playerGroup.position.set(0, 0, 0);

    if (!this.scene.children.includes(this.playerGroup)) {
      this.scene.add(this.playerGroup);
    }

    // Chaser Monster
    if (!this.chaserRig) {
      this.chaserRig = createChaserRig();
      this.chaserGroup.add(this.chaserRig.group);
      this.scene.add(this.chaserGroup);
    }
    this.chaserGroup.position.set(0, 0, this.chaserDistance);
  }

  private initTrack() {
    // Create 6 contiguous segments ahead
    const segmentLength = 40;
    for (let i = 0; i < 6; i++) {
      const seg = createTrackSegment(i);
      seg.position.z = -i * segmentLength;
      this.trackSegments.push(seg);
      this.scene.add(seg);
    }
  }

  private initVfx() {
    // 1. "This is Fine" Coffee Shield bubble mesh
    const shieldGeo = new THREE.SphereGeometry(1.4, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    this.shieldBubbleMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldBubbleMesh.position.y = 1.0;
    this.shieldBubbleMesh.visible = false;
    this.playerGroup.add(this.shieldBubbleMesh);

    // 2. Supersonic Speed Lines
    const lineCount = 60;
    const lineGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = Math.random() * 5;
      const z = -Math.random() * 40;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - 3.5;
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0,
    });
    this.speedLinesMesh = new THREE.LineSegments(lineGeo, lineMat);
    this.scene.add(this.speedLinesMesh);
  }

  // --- GAMEPLAY CONTROLS ---

  public moveLeft() {
    if (this.gameState !== 'playing') return;
    if (this.currentLane > -1) {
      this.currentLane = (this.currentLane - 1) as Lane;
      this.targetLaneX = LANE_COORDS[this.currentLane];
      soundManager.playLaneChange();
    }
  }

  public moveRight() {
    if (this.gameState !== 'playing') return;
    if (this.currentLane < 1) {
      this.currentLane = (this.currentLane + 1) as Lane;
      this.targetLaneX = LANE_COORDS[this.currentLane];
      soundManager.playLaneChange();
    }
  }

  public jump() {
    if (this.gameState !== 'playing') return;
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = 14.5;
      this.isSliding = false;
      soundManager.playJump();
    }
  }

  public slide() {
    if (this.gameState !== 'playing') return;
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = 0.65;
      // If jumping, dive downward fast
      if (this.isJumping) {
        this.jumpVelocity = -12;
      }
      soundManager.playSlide();
    }
  }

  // --- GAME LIFECYCLE ---

  public startGame() {
    this.gameState = 'playing';
    this.runSpeed = 18;
    this.targetRunSpeed = 18;
    this.distanceTraveled = 0;
    this.coinsCollected = 0;
    this.score = 0;
    this.chaserDistance = 7.5;
    this.chaserThreat = 0;
    this.currentLane = 0;
    this.targetLaneX = 0;
    this.currentLaneX = 0;
    this.isJumping = false;
    this.jumpY = 0;
    this.isSliding = false;
    this.activePowerUps.clear();
    this.hasRickrollRevive = false;
    this.hasCoffeeShield = false;

    // Reset track and obstacles
    this.clearAllObstaclesAndItems();
    this.resetTrackPositions();
    this.populateInitialTrack();

    soundManager.startMusic(false);
  }

  public pauseGame() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
    }
  }

  public resumeGame() {
    if (this.gameState === 'paused') {
      this.gameState = 'playing';
    }
  }

  private clearAllObstaclesAndItems() {
    for (const obs of this.obstacles) {
      this.scene.remove(obs.mesh);
    }
    this.obstacles = [];

    for (const col of this.collectibles) {
      this.scene.remove(col.mesh);
    }
    this.collectibles = [];
  }

  private resetTrackPositions() {
    const segmentLength = 40;
    for (let i = 0; i < this.trackSegments.length; i++) {
      this.trackSegments[i].position.z = -i * segmentLength;
    }
  }

  private populateInitialTrack() {
    // Generate initial obstacles starting from Z = -25m to give player a head start
    for (let z = -35; z > -220; z -= 18 + Math.random() * 12) {
      this.spawnTrackSlice(z);
    }
  }

  private spawnTrackSlice(z: number) {
    const roll = Math.random();

    // 1. Spawn Obstacles
    if (roll > 0.3) {
      const obstacleLanes: Lane[] = ([-1, 0, 1] as Lane[]).sort(() => Math.random() - 0.5);
      // Ensure at least one lane is safe! Pick 1 or 2 lanes to block
      const lanesToBlockCount = Math.random() > 0.4 ? 1 : 2;
      const types: ObstacleType[] = [
        'barrier_full',
        'barrier_low',
        'barrier_high',
        'dumpster_fire',
        'banana_stumble',
      ];

      for (let i = 0; i < lanesToBlockCount; i++) {
        const lane = obstacleLanes[i];
        const type = types[Math.floor(Math.random() * types.length)];
        const mesh = createObstacleMesh(type);
        mesh.position.set(LANE_COORDS[lane], 0, z);
        this.scene.add(mesh);

        this.obstacles.push({
          data: {
            id: `obs_${Date.now()}_${Math.random()}`,
            type,
            lane,
            z,
            width: 1.8,
            height: type === 'barrier_high' ? 2.5 : type === 'barrier_full' ? 2.2 : 0.8,
            depth: 0.8,
          },
          mesh,
        });
      }
    }

    // 2. Spawn Collectibles (Dogecoins, Diamonds, or Power-Up Boxes)
    const coinRoll = Math.random();
    if (coinRoll > 0.25) {
      const freeLane: Lane = ([-1, 0, 1] as Lane[])[Math.floor(Math.random() * 3)];
      
      // Rare powerup
      if (Math.random() < 0.12) {
        const powerTypes: PowerUpType[] = [
          'much_speed',
          'stonks',
          'nyan_magnet',
          'gigachad',
          'this_is_fine',
          'rickroll',
        ];
        const pType = powerTypes[Math.floor(Math.random() * powerTypes.length)];
        const pMesh = createCollectibleMesh('powerup', pType);
        pMesh.position.set(LANE_COORDS[freeLane], 1.0, z - 4);
        this.scene.add(pMesh);

        this.collectibles.push({
          data: {
            id: `col_p_${Date.now()}_${Math.random()}`,
            type: 'powerup',
            powerUpType: pType,
            lane: freeLane,
            y: 1.0,
            z: z - 4,
          },
          mesh: pMesh,
        });
      } else {
        // String of 3 Dogecoins or a Diamond
        const isDiamond = Math.random() < 0.15;
        const colType = isDiamond ? 'diamond' : 'dogecoin';
        const count = isDiamond ? 1 : 3;

        for (let c = 0; c < count; c++) {
          const coinMesh = createCollectibleMesh(colType);
          const coinZ = z - c * 2.2;
          coinMesh.position.set(LANE_COORDS[freeLane], 0.8, coinZ);
          this.scene.add(coinMesh);

          this.collectibles.push({
            data: {
              id: `col_c_${Date.now()}_${Math.random()}`,
              type: colType,
              lane: freeLane,
              y: 0.8,
              z: coinZ,
            },
            mesh: coinMesh,
          });
        }
      }
    }
  }

  // --- MAIN RENDER & PHYSICS LOOP ---

  private startLoop() {
    const animate = () => {
      if (this.isDisposed) return;
      this.animFrameId = requestAnimationFrame(animate);

      const delta = Math.min(this.clock.getDelta(), 0.1);
      this.update(delta);
      this.render();
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  private update(delta: number) {
    this.runTime += delta;

    if (this.gameState === 'playing') {
      this.updatePlayerMovement(delta);
      this.updateSpeedAndScore(delta);
      this.updateTrackAndItems(delta);
      this.updatePowerUps(delta);
      this.updateChaser(delta);
      this.checkCollisions();
    }

    this.updateAnimations(delta);
  }

  private updatePlayerMovement(delta: number) {
    // Smooth lane damping
    this.currentLaneX = THREE.MathUtils.damp(this.currentLaneX, this.targetLaneX, 16, delta);
    this.playerGroup.position.x = this.currentLaneX;

    // Banking tilt when switching lanes
    const laneDiff = this.targetLaneX - this.currentLaneX;
    this.playerGroup.rotation.z = -laneDiff * 0.18;
    this.playerGroup.rotation.y = laneDiff * 0.1;

    // Jump Physics
    if (this.isJumping) {
      this.jumpY += this.jumpVelocity * delta;
      this.jumpVelocity -= 34 * delta; // Gravity

      if (this.jumpY <= 0) {
        this.jumpY = 0;
        this.isJumping = false;
        this.jumpVelocity = 0;
      }
    }
    this.playerGroup.position.y = this.jumpY;

    // Slide Timer
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // Scale / Squish for Slide or Gigachad
    const isGigachad = this.activePowerUps.has('gigachad');
    const baseScale = isGigachad ? 1.65 : 1.0;

    if (this.isSliding) {
      this.playerGroup.scale.set(baseScale * 1.3, baseScale * 0.42, baseScale * 1.4);
    } else {
      this.playerGroup.scale.set(baseScale, baseScale, baseScale);
    }
  }

  private updateSpeedAndScore(delta: number) {
    // Slowly accelerate run speed up to cap of 38 units/s
    const speedBoostMultiplier = this.activePowerUps.has('much_speed') ? 1.85 : 1.0;
    this.targetRunSpeed = (18 + Math.min(this.distanceTraveled * 0.015, 18)) * speedBoostMultiplier;
    this.runSpeed = THREE.MathUtils.damp(this.runSpeed, this.targetRunSpeed, 5, delta);

    // Distance & Score increment
    const distDelta = this.runSpeed * delta;
    this.distanceTraveled += distDelta;

    const stonksMult = this.activePowerUps.has('stonks') ? 3 : 1;
    this.score += Math.floor(distDelta * 2 * stonksMult);

    this.callbacks.onScoreUpdate(this.score, Math.floor(this.distanceTraveled), this.coinsCollected);
  }

  private updateTrackAndItems(delta: number) {
    const shift = this.runSpeed * delta;
    const segmentLength = 40;

    // Shift track backwards
    for (const seg of this.trackSegments) {
      seg.position.z += shift;

      // If segment passes behind player, recycle to furthest front
      if (seg.position.z > segmentLength) {
        // Find furthest negative Z
        let minZ = 0;
        for (const other of this.trackSegments) {
          if (other.position.z < minZ) minZ = other.position.z;
        }
        seg.position.z = minZ - segmentLength;
      }
    }

    // Shift Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += shift;
      obs.data.z = obs.mesh.position.z;

      // Despawn passed obstacles
      if (obs.mesh.position.z > 15) {
        this.scene.remove(obs.mesh);
        this.obstacles.splice(i, 1);
      }
    }

    // Shift Collectibles
    const hasMagnet = this.activePowerUps.has('nyan_magnet');
    const magnetRadius = this.characterId === 'popcat' ? 14 : 9;

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const col = this.collectibles[i];
      col.mesh.position.z += shift;
      col.data.z = col.mesh.position.z;

      // Magnet vacuum effect: Pull coin towards player!
      if (hasMagnet && !col.data.collected) {
        const dx = this.playerGroup.position.x - col.mesh.position.x;
        const dz = this.playerGroup.position.z - col.mesh.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist < magnetRadius) {
          col.mesh.position.x += dx * 9 * delta;
          col.mesh.position.z += dz * 9 * delta;
          col.mesh.position.y = THREE.MathUtils.damp(col.mesh.position.y, this.playerGroup.position.y + 0.8, 8, delta);
        }
      }

      // Spin coin/diamond
      col.mesh.rotation.y += 3.5 * delta;

      // Despawn passed
      if (col.mesh.position.z > 15) {
        this.scene.remove(col.mesh);
        this.collectibles.splice(i, 1);
      }
    }

    // Spawn new obstacles & items ahead if needed
    let furthestZ = 0;
    for (const obs of this.obstacles) {
      if (obs.data.z < furthestZ) furthestZ = obs.data.z;
    }
    if (furthestZ > -180) {
      this.spawnTrackSlice(furthestZ - 18 - Math.random() * 10);
    }
  }

  private updatePowerUps(delta: number) {
    for (const [type, data] of this.activePowerUps.entries()) {
      data.remaining -= delta;
      if (data.remaining <= 0) {
        this.activePowerUps.delete(type);
        this.callbacks.onPowerUpExpired(type);

        if (type === 'much_speed') {
          soundManager.setSpeedBoostMusic(false);
          if (this.speedLinesMesh) {
            (this.speedLinesMesh.material as THREE.LineBasicMaterial).opacity = 0;
          }
        }
        if (type === 'this_is_fine' && this.shieldBubbleMesh) {
          this.shieldBubbleMesh.visible = false;
        }
      }
    }

    // Dynamic FOV for Much Speed
    if (this.activePowerUps.has('much_speed')) {
      this.camera.fov = THREE.MathUtils.damp(this.camera.fov, 78, 6, delta);
      if (this.speedLinesMesh) {
        (this.speedLinesMesh.material as THREE.LineBasicMaterial).opacity = 0.8;
      }
    } else {
      this.camera.fov = THREE.MathUtils.damp(this.camera.fov, 65, 4, delta);
      if (this.speedLinesMesh) {
        (this.speedLinesMesh.material as THREE.LineBasicMaterial).opacity = 0;
      }
    }
    this.camera.updateProjectionMatrix();

    // Shield Bubble Pulse
    if (this.shieldBubbleMesh && this.shieldBubbleMesh.visible) {
      this.shieldBubbleMesh.rotation.y += 2 * delta;
      this.shieldBubbleMesh.rotation.x += 1 * delta;
    }
  }

  private updateChaser(delta: number) {
    // Chaser naturally recedes back to safe 7.5m if player runs cleanly
    if (this.chaserDistance < 7.5) {
      this.chaserDistance += 0.8 * delta;
    }

    // Smoothly position chaser behind player
    const chaserX = THREE.MathUtils.damp(this.chaserGroup.position.x, this.playerGroup.position.x, 6, delta);
    this.chaserGroup.position.set(chaserX, 0, this.chaserDistance);

    // Chaser threat 0 to 1
    this.chaserThreat = Math.max(0, Math.min(1, (7.5 - this.chaserDistance) / 5.5));
    this.callbacks.onStumble(this.chaserThreat);

    // If chaser grabs player: WIPE OUT!
    if (this.chaserDistance <= 1.4) {
      this.triggerGameOver('CAUGHT BY THE MEME BEAST!');
    }
  }

  private checkCollisions() {
    const isMuchSpeed = this.activePowerUps.has('much_speed');
    const isGigachad = this.activePowerUps.has('gigachad');
    const isInvincible = isMuchSpeed || isGigachad;

    const pX = this.playerGroup.position.x;
    const pY = this.playerGroup.position.y;
    const pZ = this.playerGroup.position.z;

    // Check Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      if (obs.data.cleared || obs.data.hit) continue;

      const oX = obs.mesh.position.x;
      const oZ = obs.mesh.position.z;

      // Distance check on Z
      if (Math.abs(oZ - pZ) < 1.2 && Math.abs(oX - pX) < 1.1) {
        // We have X/Z overlap! Now check vertical clearance
        let dodged = false;

        if (obs.data.type === 'barrier_low' || obs.data.type === 'dumpster_fire') {
          // Can jump over if jumpY > 0.85
          if (pY > 0.85) {
            dodged = true;
          }
        } else if (obs.data.type === 'barrier_high') {
          // Can slide under if isSliding
          if (this.isSliding) {
            dodged = true;
          }
        }

        if (dodged) {
          obs.data.cleared = true;
          this.score += 50;
          this.callbacks.onFloatingText('+50 DODGE!', '#38bdf8');
          continue;
        }

        // Collision occurred!
        obs.data.hit = true;

        if (isInvincible) {
          // Smash obstacle into bits!
          soundManager.playVineBoom();
          this.callbacks.onFloatingText(isGigachad ? 'CHAD SMASH! 🗿' : 'SUPERSONIC SMASH! 🚀', '#f59e0b');
          // Animate mesh flying off
          this.scene.remove(obs.mesh);
          this.obstacles.splice(i, 1);
          continue;
        }

        // Banana Peel: Causes stumble!
        if (obs.data.type === 'banana_stumble') {
          soundManager.playStumble();
          this.callbacks.onFloatingText('EMOTIONAL DAMAGE! 🍌', '#fde047');
          // Chaser lunges closer!
          this.chaserDistance = Math.max(1.6, this.chaserDistance - 3.2);
          continue;
        }

        // Shield check: "This is Fine"
        if (this.activePowerUps.has('this_is_fine')) {
          this.activePowerUps.delete('this_is_fine');
          if (this.shieldBubbleMesh) this.shieldBubbleMesh.visible = false;
          soundManager.playWow();
          this.callbacks.onFloatingText('THIS IS FINE! ☕🔥', '#ea580c');
          this.scene.remove(obs.mesh);
          this.obstacles.splice(i, 1);
          continue;
        }

        // Rickroll Revive check!
        if (this.activePowerUps.has('rickroll') || this.hasRickrollRevive) {
          this.hasRickrollRevive = false;
          this.activePowerUps.delete('rickroll');
          soundManager.playPowerUp('rickroll');
          this.callbacks.onFloatingText('NEVER GONNA GIVE YOU UP! 🕺', '#3b82f6');
          // Push chaser back
          this.chaserDistance = 7.5;
          this.scene.remove(obs.mesh);
          this.obstacles.splice(i, 1);
          continue;
        }

        // Fatal crash!
        soundManager.playGameOver();
        this.triggerGameOver(`CRASHED INTO ${obs.data.type.replace('_', ' ').toUpperCase()}!`);
        return;
      }
    }

    // Check Collectibles
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const col = this.collectibles[i];
      if (col.data.collected) continue;

      const cX = col.mesh.position.x;
      const cY = col.mesh.position.y;
      const cZ = col.mesh.position.z;

      if (Math.abs(cZ - pZ) < 1.4 && Math.abs(cX - pX) < 1.2 && Math.abs(cY - pY) < 1.6) {
        col.data.collected = true;

        if (col.data.type === 'dogecoin') {
          soundManager.playCoin();
          const mult = this.activePowerUps.has('stonks') ? 3 : 1;
          const coinGain = 1 * mult;
          this.coinsCollected += coinGain;
          this.score += 20 * mult;
          this.callbacks.onFloatingText(`+${coinGain} Ð`, '#facc15');
        } else if (col.data.type === 'diamond') {
          soundManager.playWow();
          const mult = this.activePowerUps.has('stonks') ? 3 : 1;
          const gemGain = 5 * mult;
          this.coinsCollected += gemGain;
          this.score += 150 * mult;
          this.callbacks.onFloatingText(`+${gemGain} 💎 HODL!`, '#38bdf8');
        } else if (col.data.type === 'powerup' && col.data.powerUpType) {
          const pType = col.data.powerUpType;
          this.activatePowerUp(pType);
        }

        this.scene.remove(col.mesh);
        this.collectibles.splice(i, 1);
      }
    }
  }

  public activatePowerUp(type: PowerUpType) {
    const durations: Record<PowerUpType, number> = {
      much_speed: 8,
      stonks: 10,
      nyan_magnet: 9,
      gigachad: 7,
      this_is_fine: 15,
      rickroll: 999,
    };

    const duration = durations[type];
    this.activePowerUps.set(type, { remaining: duration, total: duration });
    soundManager.playPowerUp(type);

    if (type === 'much_speed') {
      soundManager.setSpeedBoostMusic(true);
      this.callbacks.onFloatingText('MUCH SPEED! VERY WARP! 🚀', '#f59e0b');
    } else if (type === 'stonks') {
      this.callbacks.onFloatingText('STONKS 3X MULTIPLIER! 📈', '#10b981');
    } else if (type === 'nyan_magnet') {
      this.callbacks.onFloatingText('NYAN RAINBOW MAGNET! 🌈', '#ec4899');
    } else if (type === 'gigachad') {
      this.callbacks.onFloatingText('GIGACHAD STOMP! 🗿', '#8b5cf6');
    } else if (type === 'this_is_fine') {
      if (this.shieldBubbleMesh) this.shieldBubbleMesh.visible = true;
      this.callbacks.onFloatingText('"THIS IS FINE" SHIELD! ☕', '#ea580c');
    } else if (type === 'rickroll') {
      this.hasRickrollRevive = true;
      this.callbacks.onFloatingText('RICKROLL 1-UP SAVED! 🕺', '#3b82f6');
    }

    this.callbacks.onPowerUpCollected(type, duration);
  }

  private triggerGameOver(reason: string) {
    this.gameState = 'gameover';
    soundManager.stopMusic();
    this.callbacks.onGameOver(reason, this.score);
  }

  // --- CHARACTER ANIMATION TICK ---

  private updateAnimations(delta: number) {
    const animSpeed = this.runSpeed * 1.1;

    // 1. Running Player Articulation
    if (this.playerRig) {
      const legAngle = Math.sin(this.runTime * animSpeed) * 0.75;
      this.playerRig.leftLeg.rotation.x = legAngle;
      this.playerRig.rightLeg.rotation.x = -legAngle;

      if (this.playerRig.leftArm && this.playerRig.rightArm) {
        this.playerRig.leftArm.rotation.x = -legAngle * 0.8;
        this.playerRig.rightArm.rotation.x = legAngle * 0.8;
      }

      if (this.playerRig.head) {
        this.playerRig.head.rotation.y = Math.sin(this.runTime * 4) * 0.08;
      }

      if (this.playerRig.tail) {
        this.playerRig.tail.rotation.z = Math.sin(this.runTime * 14) * 0.4;
      }

      // Popcat mouth pop animation!
      if (this.playerRig.mouth) {
        const popVal = (Math.sin(this.runTime * 12) + 1) * 0.5;
        this.playerRig.mouth.scale.set(1 + popVal * 0.5, 1 + popVal * 0.8, 1);
      }
    }

    // 2. Chaser Monster Articulation
    if (this.chaserRig) {
      const chaserLeg = Math.sin(this.runTime * (animSpeed * 0.95)) * 0.8;
      this.chaserRig.leftLeg.rotation.x = chaserLeg;
      this.chaserRig.rightLeg.rotation.x = -chaserLeg;

      if (this.chaserRig.leftArm && this.chaserRig.rightArm) {
        this.chaserRig.leftArm.rotation.x = -chaserLeg * 0.9;
        this.chaserRig.rightArm.rotation.x = chaserLeg * 0.9;
      }
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public dispose() {
    this.isDisposed = true;
    soundManager.stopMusic();

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);

    this.clearAllObstaclesAndItems();
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
