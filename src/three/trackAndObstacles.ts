import * as THREE from 'three';
import { Lane, ObstacleType, PowerUpType } from '../types/game';

// Lane coordinates (X axis)
export const LANE_WIDTH = 2.4;
export const LANE_COORDS: Record<Lane, number> = {
  [-1]: -LANE_WIDTH,
  0: 0,
  1: LANE_WIDTH,
};

// Procedural Canvas Textures Cache
let dogecoinTexture: THREE.CanvasTexture | null = null;
let firewallTexture: THREE.CanvasTexture | null = null;
let billboardTextures: THREE.CanvasTexture[] = [];

export function getDogecoinTexture(): THREE.CanvasTexture {
  if (dogecoinTexture) return dogecoinTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Shiny gold background
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.6, '#eab308');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  // Outer border
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#fef9c3';
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.stroke();

  // Doge "Ð" symbol
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 130px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Ð', 128, 134);

  // Rim stars
  ctx.font = '24px sans-serif';
  ctx.fillText('★ MUCH VALUE ★', 128, 38);
  ctx.fillText('★ WOW ★', 128, 224);

  dogecoinTexture = new THREE.CanvasTexture(canvas);
  dogecoinTexture.colorSpace = THREE.SRGBColorSpace;
  return dogecoinTexture;
}

export function getFirewallTexture(): THREE.CanvasTexture {
  if (firewallTexture) return firewallTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark glitch red background
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, 512, 256);

  // Red neon stripes
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 14;
  for (let x = -256; x < 768; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 120, 256);
    ctx.stroke();
  }

  // Warning text
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(40, 70, 432, 116);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 70, 432, 116);

  ctx.fillStyle = '#7f1d1d';
  ctx.font = '900 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('404 NOT FOUND', 256, 128);

  firewallTexture = new THREE.CanvasTexture(canvas);
  firewallTexture.colorSpace = THREE.SRGBColorSpace;
  return firewallTexture;
}

export function getBillboardTextures(): THREE.CanvasTexture[] {
  if (billboardTextures.length > 0) return billboardTextures;

  const memes = [
    { text: 'STONKS ONLY GO UP 📈', bg: '#064e3b', fg: '#34d399' },
    { text: 'THIS IS FINE ☕🔥', bg: '#7c2d12', fg: '#fbbf24' },
    { text: 'TOUCH SOME GRASS 🌱', bg: '#14532d', fg: '#86efac' },
    { text: 'HODL TO THE MOON 🚀', bg: '#1e1b4b', fg: '#67e8f9' },
    { text: 'AVERAGE MEME ENJOYER 🗿', bg: '#312e81', fg: '#c7d2fe' },
    { text: 'NEVER GONNA GIVE YOU UP 🕺', bg: '#1e3a8a', fg: '#93c5fd' },
  ];

  billboardTextures = memes.map((m) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = m.bg;
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = m.fg;
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.fillStyle = m.fg;
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.text, 256, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });

  return billboardTextures;
}

/**
 * Creates an individual Track Segment (length = 40m)
 */
export function createTrackSegment(chunkIndex: number): THREE.Group {
  const segment = new THREE.Group();
  segment.name = `TrackSegment_${chunkIndex}`;

  const trackLength = 40;
  const trackWidth = LANE_WIDTH * 3 + 1.2;

  // Road surface
  const roadGeo = new THREE.PlaneGeometry(trackWidth, trackLength, 4, 8);
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x130e26, // Deep synthwave dark purple
    roughness: 0.8,
    metalness: 0.2,
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0;
  road.receiveShadow = true;
  segment.add(road);

  // Glowing Lane Dividers
  const dividerMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8, // Neon Indigo
  });
  const dividerGeo = new THREE.PlaneGeometry(0.12, trackLength);

  const leftDivider = new THREE.Mesh(dividerGeo, dividerMat);
  leftDivider.rotation.x = -Math.PI / 2;
  leftDivider.position.set(-LANE_WIDTH / 2 - 0.6, 0.01, 0);
  segment.add(leftDivider);

  const rightDivider = new THREE.Mesh(dividerGeo, dividerMat);
  rightDivider.rotation.x = -Math.PI / 2;
  rightDivider.position.set(LANE_WIDTH / 2 + 0.6, 0.01, 0);
  segment.add(rightDivider);

  // Neon Edge Curbs
  const curbGeo = new THREE.BoxGeometry(0.3, 0.25, trackLength);
  const curbMat = new THREE.MeshStandardMaterial({
    color: 0xec4899, // Neon Pink
    emissive: 0xdb2777,
    emissiveIntensity: 0.4,
    roughness: 0.3,
  });

  const leftCurb = new THREE.Mesh(curbGeo, curbMat);
  leftCurb.position.set(-trackWidth / 2, 0.12, 0);
  segment.add(leftCurb);

  const rightCurb = new THREE.Mesh(curbGeo, curbMat);
  rightCurb.position.set(trackWidth / 2, 0.12, 0);
  segment.add(rightCurb);

  // Roadside meme scenery (Billboards / Cyber Pillars)
  if (chunkIndex % 2 === 0) {
    const bbs = getBillboardTextures();
    const bbTex = bbs[chunkIndex % bbs.length];

    const bbGroup = new THREE.Group();
    const isLeftSide = chunkIndex % 4 === 0;
    bbGroup.position.set(isLeftSide ? -trackWidth / 2 - 4.5 : trackWidth / 2 + 4.5, 0, (Math.random() - 0.5) * 15);
    bbGroup.rotation.y = isLeftSide ? 0.3 : -0.3;

    // Posts
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.8, roughness: 0.2 });
    const post1 = new THREE.Mesh(postGeo, postMat);
    post1.position.set(-1.8, 2.25, 0);
    const post2 = new THREE.Mesh(postGeo, postMat);
    post2.position.set(1.8, 2.25, 0);
    bbGroup.add(post1, post2);

    // Board
    const boardGeo = new THREE.BoxGeometry(4.4, 2.2, 0.2);
    const boardMat = new THREE.MeshStandardMaterial({
      map: bbTex,
      roughness: 0.4,
      metalness: 0.1,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 3.8, 0);
    bbGroup.add(board);

    segment.add(bbGroup);
  }

  // Cyber Palm Trees / Neon Monoliths
  for (let zOffset of [-12, 12]) {
    const monoGroup = new THREE.Group();
    monoGroup.position.set(
      (Math.random() > 0.5 ? 1 : -1) * (trackWidth / 2 + 3 + Math.random() * 2),
      0,
      zOffset + (Math.random() - 0.5) * 4
    );

    const monoGeo = new THREE.ConeGeometry(0.5, 5 + Math.random() * 3, 4);
    const monoMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.9,
    });
    const mono = new THREE.Mesh(monoGeo, monoMat);
    mono.position.y = 2.5;
    monoGroup.add(mono);
    segment.add(monoGroup);
  }

  return segment;
}

/**
 * Procedural 3D Obstacle Factory
 */
export function createObstacleMesh(type: ObstacleType): THREE.Group {
  const group = new THREE.Group();
  group.name = `Obstacle_${type}`;

  if (type === 'barrier_full') {
    // "404 Firewall" - Solid barrier blocking the lane entirely
    const firewallTex = getFirewallTexture();
    const boxGeo = new THREE.BoxGeometry(2.0, 2.2, 0.4);
    const boxMat = new THREE.MeshStandardMaterial({
      map: firewallTex,
      roughness: 0.4,
      metalness: 0.2,
    });
    const mesh = new THREE.Mesh(boxGeo, boxMat);
    mesh.position.y = 1.1;
    mesh.castShadow = true;
    group.add(mesh);

    // Hazard posts on sides
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.3, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6 });
    const p1 = new THREE.Mesh(postGeo, postMat);
    p1.position.set(-1.0, 1.15, 0);
    const p2 = new THREE.Mesh(postGeo, postMat);
    p2.position.set(1.0, 1.15, 0);
    group.add(p1, p2);

    // Top flashing beacon
    const beaconGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const b1 = new THREE.Mesh(beaconGeo, beaconMat);
    b1.position.set(-1.0, 2.35, 0);
    const b2 = new THREE.Mesh(beaconGeo, beaconMat);
    b2.position.set(1.0, 2.35, 0);
    group.add(b1, b2);
  } else if (type === 'barrier_low') {
    // "Touch Grass" lawnmower / low hedge - Must JUMP or switch lanes
    const baseGeo = new THREE.BoxGeometry(2.1, 0.4, 0.6);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.8,
    });
    const hedge = new THREE.Mesh(baseGeo, grassMat);
    hedge.position.y = 0.2;
    hedge.castShadow = true;
    group.add(hedge);

    // Little flowers / blades on top
    for (let i = -0.8; i <= 0.8; i += 0.4) {
      const flowerGeo = new THREE.ConeGeometry(0.08, 0.25, 4);
      const flowerMat = new THREE.MeshStandardMaterial({ color: 0xfef08a });
      const fl = new THREE.Mesh(flowerGeo, flowerMat);
      fl.position.set(i + (Math.random() - 0.5) * 0.1, 0.48, (Math.random() - 0.5) * 0.2);
      group.add(fl);
    }

    // Little warning sign "TOUCH GRASS"
    const signGeo = new THREE.BoxGeometry(1.2, 0.25, 0.05);
    const signMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 0.42, 0.32);
    group.add(sign);
  } else if (type === 'barrier_high') {
    // "Cringe Laser" Floating overhead beam - Must SLIDE or switch lanes
    const frameGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.0, 8);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });

    // Left and Right tall posts
    const p1 = new THREE.Mesh(frameGeo, frameMat);
    p1.position.set(-1.1, 1.5, 0);
    const p2 = new THREE.Mesh(frameGeo, frameMat);
    p2.position.set(1.1, 1.5, 0);
    group.add(p1, p2);

    // High overhead bar (positioned at y = 1.6 - 2.0 so player must slide)
    const barGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.3, 8);
    barGeo.rotateZ(Math.PI / 2);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0xa855f7,
      emissiveIntensity: 0.5,
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, 1.65, 0);
    group.add(bar);

    // Glowing laser beam underneath the bar
    const laserGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8);
    laserGeo.rotateZ(Math.PI / 2);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(0, 1.45, 0);
    group.add(laser);
  } else if (type === 'banana_stumble') {
    // "Emotional Damage" Banana Peel - Causes a stumble!
    const peelMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.3,
    });
    const peelGeo = new THREE.ConeGeometry(0.25, 0.15, 6);
    const base = new THREE.Mesh(peelGeo, peelMat);
    base.position.y = 0.08;
    group.add(base);

    // Slippery skins
    for (let i = 0; i < 4; i++) {
      const skinGeo = new THREE.BoxGeometry(0.08, 0.02, 0.32);
      const skin = new THREE.Mesh(skinGeo, peelMat);
      skin.position.set(0, 0.02, 0.15);
      skin.rotation.y = (i * Math.PI) / 2;
      group.add(skin);
    }
  } else if (type === 'dumpster_fire') {
    // "Dumpster Fire" burning bin
    const binGeo = new THREE.CylinderGeometry(0.5, 0.42, 0.9, 8);
    const binMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.6,
      metalness: 0.5,
    });
    const bin = new THREE.Mesh(binGeo, binMat);
    bin.position.y = 0.45;
    bin.castShadow = true;
    group.add(bin);

    // Fire flames (cone cluster)
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    for (let i = 0; i < 3; i++) {
      const flameGeo = new THREE.ConeGeometry(0.2, 0.6, 6);
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set((Math.random() - 0.5) * 0.3, 1.0 + Math.random() * 0.2, (Math.random() - 0.5) * 0.3);
      group.add(flame);
    }
  }

  return group;
}

/**
 * Procedural Collectible Factory (Dogecoin, Diamond, Power-Up Box)
 */
export function createCollectibleMesh(type: 'dogecoin' | 'diamond' | 'powerup', powerUpType?: PowerUpType): THREE.Group {
  const group = new THREE.Group();
  group.name = `Collectible_${type}`;

  if (type === 'dogecoin') {
    const tex = getDogecoinTexture();
    const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 20);
    coinGeo.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.9,
      roughness: 0.2,
    });
    const faceMat = new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.7,
      roughness: 0.3,
    });

    const coin = new THREE.Mesh(coinGeo, [rimMat, faceMat, faceMat]);
    coin.castShadow = true;
    group.add(coin);
  } else if (type === 'diamond') {
    const diaGeo = new THREE.OctahedronGeometry(0.32, 0);
    const diaMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      ior: 2.4,
      thickness: 0.6,
    });
    const dia = new THREE.Mesh(diaGeo, diaMat);
    group.add(dia);

    // Outer glow halo
    const haloGeo = new THREE.TorusGeometry(0.42, 0.03, 8, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    group.add(halo);
  } else if (type === 'powerup') {
    // Glowing Mystery Meme Cube
    let cubeColor = 0xa855f7;
    if (powerUpType === 'much_speed') cubeColor = 0xf59e0b;
    if (powerUpType === 'stonks') cubeColor = 0x10b981;
    if (powerUpType === 'nyan_magnet') cubeColor = 0xec4899;
    if (powerUpType === 'gigachad') cubeColor = 0x8b5cf6;
    if (powerUpType === 'this_is_fine') cubeColor = 0xea580c;
    if (powerUpType === 'rickroll') cubeColor = 0x3b82f6;

    const boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const boxMat = new THREE.MeshStandardMaterial({
      color: cubeColor,
      emissive: cubeColor,
      emissiveIntensity: 0.5,
      metalness: 0.6,
      roughness: 0.2,
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    // Floating question/glyph mark
    const ringGeo = new THREE.RingGeometry(0.15, 0.22, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = 0.26;
    group.add(ring);
  }

  return group;
}
