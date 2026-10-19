import * as THREE from 'three';

/**
 * Creates procedural multi-part 3D character models for Meme Mania.
 * Every model is constructed as a composite THREE.Group with distinct materials,
 * articulated limbs for running animation, and bottom-center grounding.
 */

export interface CharacterRig {
  group: THREE.Group;
  leftLeg: THREE.Object3D;
  rightLeg: THREE.Object3D;
  leftArm?: THREE.Object3D;
  rightArm?: THREE.Object3D;
  head?: THREE.Object3D;
  mouth?: THREE.Object3D;
  tail?: THREE.Object3D;
  specialMesh?: THREE.Object3D;
}

// Reusable shared materials (PBR)
const dogeFurMat = new THREE.MeshStandardMaterial({
  color: 0xd99b26,
  roughness: 0.65,
  metalness: 0.05,
});
const dogeWhiteFurMat = new THREE.MeshStandardMaterial({
  color: 0xfff2d6,
  roughness: 0.7,
  metalness: 0.02,
});
const dogeNoseMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.3,
  metalness: 0.1,
});
const dogeCollarMat = new THREE.MeshStandardMaterial({
  color: 0xef4444,
  roughness: 0.3,
  metalness: 0.4,
});
const goldTagMat = new THREE.MeshStandardMaterial({
  color: 0xfacc15,
  roughness: 0.2,
  metalness: 0.85,
});

export function createDogeRig(): CharacterRig {
  const group = new THREE.Group();
  group.name = 'DogeRig';

  // Body
  const bodyGeo = new THREE.CapsuleGeometry(0.38, 0.65, 8, 16);
  const body = new THREE.Mesh(bodyGeo, dogeFurMat);
  body.rotation.x = Math.PI / 2;
  body.position.set(0, 0.68, 0);
  body.castShadow = true;
  group.add(body);

  // Chest white patch
  const chestGeo = new THREE.SphereGeometry(0.32, 12, 12);
  const chest = new THREE.Mesh(chestGeo, dogeWhiteFurMat);
  chest.scale.set(0.9, 0.9, 0.7);
  chest.position.set(0, 0.65, 0.22);
  group.add(chest);

  // Collar & Tag
  const collarGeo = new THREE.TorusGeometry(0.34, 0.04, 8, 20);
  const collar = new THREE.Mesh(collarGeo, dogeCollarMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.82, 0.28);
  group.add(collar);

  const tagGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12);
  const tag = new THREE.Mesh(tagGeo, goldTagMat);
  tag.rotation.x = Math.PI / 2;
  tag.position.set(0, 0.72, 0.38);
  group.add(tag);

  // Head Pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.95, 0.35);

  const headGeo = new THREE.SphereGeometry(0.34, 16, 16);
  const head = new THREE.Mesh(headGeo, dogeFurMat);
  head.castShadow = true;
  headPivot.add(head);

  // Snout
  const snoutGeo = new THREE.ConeGeometry(0.18, 0.3, 12);
  const snout = new THREE.Mesh(snoutGeo, dogeWhiteFurMat);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, -0.05, 0.32);
  headPivot.add(snout);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const nose = new THREE.Mesh(noseGeo, dogeNoseMat);
  nose.position.set(0, -0.02, 0.48);
  headPivot.add(nose);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const leftEye = new THREE.Mesh(eyeGeo, dogeNoseMat);
  leftEye.position.set(-0.13, 0.08, 0.28);
  const rightEye = new THREE.Mesh(eyeGeo, dogeNoseMat);
  rightEye.position.set(0.13, 0.08, 0.28);
  headPivot.add(leftEye, rightEye);

  // Ears
  const earGeo = new THREE.ConeGeometry(0.11, 0.24, 8);
  const leftEar = new THREE.Mesh(earGeo, dogeFurMat);
  leftEar.position.set(-0.2, 0.3, 0);
  leftEar.rotation.z = 0.25;
  leftEar.rotation.x = -0.15;

  const rightEar = new THREE.Mesh(earGeo, dogeFurMat);
  rightEar.position.set(0.2, 0.3, 0);
  rightEar.rotation.z = -0.25;
  rightEar.rotation.x = -0.15;
  headPivot.add(leftEar, rightEar);

  group.add(headPivot);

  // Tail
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, 0.85, -0.4);
  const tailGeo = new THREE.CylinderGeometry(0.05, 0.09, 0.35, 8);
  const tail = new THREE.Mesh(tailGeo, dogeWhiteFurMat);
  tail.position.set(0, 0.15, -0.08);
  tail.rotation.x = -0.6;
  tailPivot.add(tail);
  group.add(tailPivot);

  // Legs (Running articulation)
  const legGeo = new THREE.CapsuleGeometry(0.09, 0.35, 6, 8);
  
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.22, 0.42, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, dogeFurMat);
  leftLegMesh.position.y = -0.2;
  leftLegMesh.castShadow = true;
  leftLegPivot.add(leftLegMesh);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.22, 0.42, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, dogeFurMat);
  rightLegMesh.position.y = -0.2;
  rightLegMesh.castShadow = true;
  rightLegPivot.add(rightLegMesh);
  group.add(rightLegPivot);

  return {
    group,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    head: headPivot,
    tail: tailPivot,
  };
}

export function createGigachadRig(): CharacterRig {
  const group = new THREE.Group();
  group.name = 'GigachadRig';

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xc89674,
    roughness: 0.5,
    metalness: 0.1,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.3,
    metalness: 0.2,
  });
  const glassesMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.1,
    metalness: 0.9,
  });
  const suitPantsMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.7,
    metalness: 0.1,
  });

  // Massive Torso / V-Taper
  const torsoGeo = new THREE.CylinderGeometry(0.48, 0.28, 0.75, 8);
  const torso = new THREE.Mesh(torsoGeo, skinMat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // Pectoral Sculpting
  const pecGeo = new THREE.BoxGeometry(0.22, 0.18, 0.16);
  const leftPec = new THREE.Mesh(pecGeo, skinMat);
  leftPec.position.set(-0.13, 1.25, 0.22);
  const rightPec = new THREE.Mesh(pecGeo, skinMat);
  rightPec.position.set(0.13, 1.25, 0.22);
  group.add(leftPec, rightPec);

  // Head with chiseled jaw
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.62, 0);

  const skullGeo = new THREE.BoxGeometry(0.3, 0.32, 0.28);
  const skull = new THREE.Mesh(skullGeo, skinMat);
  headPivot.add(skull);

  // The Iconic Jawline
  const jawGeo = new THREE.ConeGeometry(0.24, 0.26, 4);
  const jaw = new THREE.Mesh(jawGeo, skinMat);
  jaw.rotation.y = Math.PI / 4;
  jaw.position.set(0, -0.16, 0.05);
  headPivot.add(jaw);

  // Slick Hair
  const hairGeo = new THREE.BoxGeometry(0.32, 0.14, 0.32);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.19, -0.02);
  headPivot.add(hair);

  // Sunglasses
  const glassGeo = new THREE.BoxGeometry(0.34, 0.08, 0.08);
  const glasses = new THREE.Mesh(glassGeo, glassesMat);
  glasses.position.set(0, 0.04, 0.16);
  headPivot.add(glasses);

  group.add(headPivot);

  // Muscular Arms
  const armGeo = new THREE.CapsuleGeometry(0.12, 0.45, 6, 8);
  
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.52, 1.35, 0);
  const leftArm = new THREE.Mesh(armGeo, skinMat);
  leftArm.position.y = -0.25;
  leftArmPivot.add(leftArm);
  group.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.52, 1.35, 0);
  const rightArm = new THREE.Mesh(armGeo, skinMat);
  rightArm.position.y = -0.25;
  rightArmPivot.add(rightArm);
  group.add(rightArmPivot);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.13, 0.55, 6, 8);

  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.18, 0.65, 0);
  const leftLeg = new THREE.Mesh(legGeo, suitPantsMat);
  leftLeg.position.y = -0.3;
  leftLeg.castShadow = true;
  leftLegPivot.add(leftLeg);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.18, 0.65, 0);
  const rightLeg = new THREE.Mesh(legGeo, suitPantsMat);
  rightLeg.position.y = -0.3;
  rightLeg.castShadow = true;
  rightLegPivot.add(rightLeg);
  group.add(rightLegPivot);

  return {
    group,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    leftArm: leftArmPivot,
    rightArm: rightArmPivot,
    head: headPivot,
  };
}

export function createPepeRig(): CharacterRig {
  const group = new THREE.Group();
  group.name = 'PepeRig';

  const greenSkinMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    roughness: 0.6,
    metalness: 0.05,
  });
  const blueShirtMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.7,
    metalness: 0.05,
  });
  const brownShortsMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.75,
    metalness: 0.05,
  });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.0,
  });
  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.1,
    metalness: 0.0,
  });
  const lipMat = new THREE.MeshStandardMaterial({
    color: 0x86efac,
    roughness: 0.5,
    metalness: 0.05,
  });

  // Torso / Blue Shirt
  const torsoGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.55, 12);
  const torso = new THREE.Mesh(torsoGeo, blueShirtMat);
  torso.position.y = 0.85;
  torso.castShadow = true;
  group.add(torso);

  // Shorts
  const shortsGeo = new THREE.CylinderGeometry(0.35, 0.36, 0.25, 12);
  const shorts = new THREE.Mesh(shortsGeo, brownShortsMat);
  shorts.position.y = 0.52;
  group.add(shorts);

  // Pepe Head
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.25, 0);

  const headGeo = new THREE.SphereGeometry(0.36, 16, 16);
  headGeo.scale(1.1, 0.9, 0.95);
  const head = new THREE.Mesh(headGeo, greenSkinMat);
  headPivot.add(head);

  // Iconic Bulging Frog Eyes
  const eyeHolderGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const leftEyeHolder = new THREE.Mesh(eyeHolderGeo, greenSkinMat);
  leftEyeHolder.position.set(-0.2, 0.28, 0.12);
  const rightEyeHolder = new THREE.Mesh(eyeHolderGeo, greenSkinMat);
  rightEyeHolder.position.set(0.2, 0.28, 0.12);
  headPivot.add(leftEyeHolder, rightEyeHolder);

  const eyeBallGeo = new THREE.SphereGeometry(0.09, 10, 10);
  const leftEye = new THREE.Mesh(eyeBallGeo, eyeWhiteMat);
  leftEye.position.set(-0.2, 0.3, 0.2);
  const rightEye = new THREE.Mesh(eyeBallGeo, eyeWhiteMat);
  rightEye.position.set(0.2, 0.3, 0.2);

  const pupilGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
  leftPupil.position.set(-0.2, 0.3, 0.27);
  const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
  rightPupil.position.set(0.2, 0.3, 0.27);
  headPivot.add(leftEye, rightEye, leftPupil, rightPupil);

  // Iconic Smile Lips
  const lipGeo = new THREE.TorusGeometry(0.18, 0.05, 8, 16, Math.PI);
  const lip = new THREE.Mesh(lipGeo, lipMat);
  lip.position.set(0, -0.1, 0.32);
  lip.rotation.x = 0.3;
  headPivot.add(lip);

  group.add(headPivot);

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.35, 6, 8);
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.38, 1.05, 0);
  const leftArm = new THREE.Mesh(armGeo, greenSkinMat);
  leftArm.position.y = -0.2;
  leftArmPivot.add(leftArm);
  group.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.38, 1.05, 0);
  const rightArm = new THREE.Mesh(armGeo, greenSkinMat);
  rightArm.position.y = -0.2;
  rightArmPivot.add(rightArm);
  group.add(rightArmPivot);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.09, 0.36, 6, 8);
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.16, 0.42, 0);
  const leftLeg = new THREE.Mesh(legGeo, greenSkinMat);
  leftLeg.position.y = -0.2;
  leftLegPivot.add(leftLeg);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.16, 0.42, 0);
  const rightLeg = new THREE.Mesh(legGeo, greenSkinMat);
  rightLeg.position.y = -0.2;
  rightLegPivot.add(rightLeg);
  group.add(rightLegPivot);

  return {
    group,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    leftArm: leftArmPivot,
    rightArm: rightArmPivot,
    head: headPivot,
  };
}

export function createPopcatRig(): CharacterRig {
  const group = new THREE.Group();
  group.name = 'PopcatRig';

  const catMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.5,
    metalness: 0.05,
  });
  const innerEarMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.6,
  });
  const mouthInsideMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.4,
  });

  // Rounded Body
  const bodyGeo = new THREE.SphereGeometry(0.38, 16, 16);
  bodyGeo.scale(1.0, 1.15, 1.0);
  const body = new THREE.Mesh(bodyGeo, catMat);
  body.position.y = 0.65;
  body.castShadow = true;
  group.add(body);

  // Head
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.15, 0);

  const headGeo = new THREE.SphereGeometry(0.34, 16, 16);
  const head = new THREE.Mesh(headGeo, catMat);
  headPivot.add(head);

  // Ears
  const earGeo = new THREE.ConeGeometry(0.11, 0.22, 6);
  const leftEar = new THREE.Mesh(earGeo, catMat);
  leftEar.position.set(-0.18, 0.3, 0);
  leftEar.rotation.z = 0.3;
  const leftInner = new THREE.Mesh(earGeo, innerEarMat);
  leftInner.scale.set(0.7, 0.7, 0.7);
  leftInner.position.set(-0.17, 0.3, 0.02);
  leftInner.rotation.z = 0.3;

  const rightEar = new THREE.Mesh(earGeo, catMat);
  rightEar.position.set(0.18, 0.3, 0);
  rightEar.rotation.z = -0.3;
  const rightInner = new THREE.Mesh(earGeo, innerEarMat);
  rightInner.scale.set(0.7, 0.7, 0.7);
  rightInner.position.set(0.17, 0.3, 0.02);
  rightInner.rotation.z = -0.3;

  headPivot.add(leftEar, leftInner, rightEar, rightInner);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.12, 0.06, 0.29);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.12, 0.06, 0.29);
  headPivot.add(leftEye, rightEye);

  // POPPING Mouth (Articulated for the famous pop animation!)
  const mouthPivot = new THREE.Group();
  mouthPivot.position.set(0, -0.1, 0.28);
  const openMouthGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.15, 12);
  openMouthGeo.rotateX(Math.PI / 2);
  const mouthMesh = new THREE.Mesh(openMouthGeo, mouthInsideMat);
  mouthPivot.add(mouthMesh);
  headPivot.add(mouthPivot);

  group.add(headPivot);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.08, 0.28, 6, 8);
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.16, 0.3, 0);
  const leftLeg = new THREE.Mesh(legGeo, catMat);
  leftLeg.position.y = -0.15;
  leftLegPivot.add(leftLeg);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.16, 0.3, 0);
  const rightLeg = new THREE.Mesh(legGeo, catMat);
  rightLeg.position.y = -0.15;
  rightLegPivot.add(rightLeg);
  group.add(rightLegPivot);

  return {
    group,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    head: headPivot,
    mouth: mouthPivot,
  };
}

export function createWojakRig(): CharacterRig {
  const group = new THREE.Group();
  group.name = 'WojakRig';

  const paleSkinMat = new THREE.MeshStandardMaterial({
    color: 0xedd5be,
    roughness: 0.7,
  });
  const blackHoodieMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.8,
  });
  const diamondMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.85,
    ior: 2.4,
    thickness: 0.5,
  });

  // Body Hoodie
  const torsoGeo = new THREE.CylinderGeometry(0.34, 0.32, 0.6, 10);
  const torso = new THREE.Mesh(torsoGeo, blackHoodieMat);
  torso.position.y = 0.85;
  group.add(torso);

  // Bald Wojak Head
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.35, 0);
  const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
  headGeo.scale(1.0, 1.1, 0.95);
  const head = new THREE.Mesh(headGeo, paleSkinMat);
  headPivot.add(head);

  // Sad / Intense Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const eyeGeo = new THREE.BoxGeometry(0.07, 0.03, 0.04);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.11, 0.05, 0.3);
  leftEye.rotation.z = -0.2;
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.11, 0.05, 0.3);
  rightEye.rotation.z = 0.2;
  headPivot.add(leftEye, rightEye);

  group.add(headPivot);

  // ARMS WITH DIAMOND HANDS!
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.35, 6, 8);
  const diamondGeo = new THREE.OctahedronGeometry(0.14, 0);

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.4, 1.05, 0);
  const leftArm = new THREE.Mesh(armGeo, blackHoodieMat);
  leftArm.position.y = -0.18;
  const leftDiamond = new THREE.Mesh(diamondGeo, diamondMat);
  leftDiamond.position.y = -0.38;
  leftArmPivot.add(leftArm, leftDiamond);
  group.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.4, 1.05, 0);
  const rightArm = new THREE.Mesh(armGeo, blackHoodieMat);
  rightArm.position.y = -0.18;
  const rightDiamond = new THREE.Mesh(diamondGeo, diamondMat);
  rightDiamond.position.y = -0.38;
  rightArmPivot.add(rightArm, rightDiamond);
  group.add(rightArmPivot);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.09, 0.45, 6, 8);
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.15, 0.5, 0);
  const leftLeg = new THREE.Mesh(legGeo, blackHoodieMat);
  leftLeg.position.y = -0.22;
  leftLegPivot.add(leftLeg);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.15, 0.5, 0);
  const rightLeg = new THREE.Mesh(legGeo, blackHoodieMat);
  rightLeg.position.y = -0.22;
  rightLegPivot.add(rightLeg);
  group.add(rightLegPivot);

  return {
    group,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    leftArm: leftArmPivot,
    rightArm: rightArmPivot,
    head: headPivot,
  };
}

export function createCapybaraRig(): CharacterRig {
  const group = new THREE.Group();
  group.name = 'CapybaraRig';

  const furMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.8,
  });
  const muzzleMat = new THREE.MeshStandardMaterial({
    color: 0x713f12,
    roughness: 0.7,
  });
  const orangeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.4,
  });
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.5,
  });

  // Sturdy barrel body
  const bodyGeo = new THREE.CapsuleGeometry(0.35, 0.65, 8, 12);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.rotation.x = Math.PI / 2;
  body.position.set(0, 0.55, 0);
  group.add(body);

  // Head Pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.8, 0.35);

  const headGeo = new THREE.BoxGeometry(0.32, 0.32, 0.4);
  const head = new THREE.Mesh(headGeo, furMat);
  headPivot.add(head);

  // Snout
  const snoutGeo = new THREE.BoxGeometry(0.3, 0.26, 0.2);
  const snout = new THREE.Mesh(snoutGeo, muzzleMat);
  snout.position.set(0, -0.04, 0.26);
  headPivot.add(snout);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.06, 6, 6);
  const leftEar = new THREE.Mesh(earGeo, furMat);
  leftEar.position.set(-0.16, 0.16, -0.1);
  const rightEar = new THREE.Mesh(earGeo, furMat);
  rightEar.position.set(0.16, 0.16, -0.1);
  headPivot.add(leftEar, rightEar);

  // Zen Eyes (Sleepy lines)
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const eyeGeo = new THREE.BoxGeometry(0.06, 0.015, 0.02);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.15, 0.04, 0.15);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.15, 0.04, 0.15);
  headPivot.add(leftEye, rightEye);

  // The Famous Orange on Head!
  const orangeGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const orange = new THREE.Mesh(orangeGeo, orangeMat);
  orange.position.set(0, 0.24, 0.05);
  const leafGeo = new THREE.ConeGeometry(0.03, 0.05, 4);
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.set(0, 0.33, 0.05);
  leaf.rotation.z = 0.4;
  headPivot.add(orange, leaf);

  group.add(headPivot);

  // Four short legs
  const legGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.3, 8);
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.18, 0.3, 0);
  const leftLeg = new THREE.Mesh(legGeo, furMat);
  leftLeg.position.y = -0.15;
  leftLegPivot.add(leftLeg);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.18, 0.3, 0);
  const rightLeg = new THREE.Mesh(legGeo, furMat);
  rightLeg.position.y = -0.15;
  rightLegPivot.add(rightLeg);
  group.add(rightLegPivot);

  return {
    group,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    head: headPivot,
  };
}

/**
 * Creates the Chaser Monster:
 * "Buff Chaser / Demon NPC" who pursues the runner directly behind!
 */
export function createChaserRig(): CharacterRig {
  const group = new THREE.Group();
  group.name = 'ChaserRig';

  const monsterMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Demonic crimson
    roughness: 0.4,
    metalness: 0.2,
  });
  const eyeGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });
  const hornMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.3,
    metalness: 0.5,
  });

  // Massive Upper Torso
  const torsoGeo = new THREE.CylinderGeometry(0.65, 0.45, 0.95, 8);
  const torso = new THREE.Mesh(torsoGeo, monsterMat);
  torso.position.y = 1.3;
  torso.castShadow = true;
  group.add(torso);

  // Spikes on back
  for (let i = 0; i < 3; i++) {
    const spikeGeo = new THREE.ConeGeometry(0.1, 0.3, 5);
    const spike = new THREE.Mesh(spikeGeo, hornMat);
    spike.rotation.x = -Math.PI / 3;
    spike.position.set(0, 1.1 + i * 0.25, -0.35);
    group.add(spike);
  }

  // Head with horns and menacing red eyes
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.9, 0.15);

  const headGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const head = new THREE.Mesh(headGeo, monsterMat);
  headPivot.add(head);

  // Horns
  const hornGeo = new THREE.ConeGeometry(0.12, 0.45, 6);
  const leftHorn = new THREE.Mesh(hornGeo, hornMat);
  leftHorn.position.set(-0.25, 0.35, 0);
  leftHorn.rotation.z = 0.4;
  const rightHorn = new THREE.Mesh(hornGeo, hornMat);
  rightHorn.position.set(0.25, 0.35, 0);
  rightHorn.rotation.z = -0.4;
  headPivot.add(leftHorn, rightHorn);

  // Glowing Menace Eyes
  const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const leftEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
  leftEye.position.set(-0.14, 0.08, 0.24);
  const rightEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
  rightEye.position.set(0.14, 0.08, 0.24);
  headPivot.add(leftEye, rightEye);

  group.add(headPivot);

  // Giant Hulking Arms
  const armGeo = new THREE.CapsuleGeometry(0.2, 0.7, 6, 8);
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.75, 1.5, 0);
  const leftArm = new THREE.Mesh(armGeo, monsterMat);
  leftArm.position.y = -0.35;
  leftArmPivot.add(leftArm);
  group.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.75, 1.5, 0);
  const rightArm = new THREE.Mesh(armGeo, monsterMat);
  rightArm.position.y = -0.35;
  rightArmPivot.add(rightArm);
  group.add(rightArmPivot);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.2, 0.65, 6, 8);
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.25, 0.75, 0);
  const leftLeg = new THREE.Mesh(legGeo, monsterMat);
  leftLeg.position.y = -0.35;
  leftLegPivot.add(leftLeg);
  group.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.25, 0.75, 0);
  const rightLeg = new THREE.Mesh(legGeo, monsterMat);
  rightLeg.position.y = -0.35;
  rightLegPivot.add(rightLeg);
  group.add(rightLegPivot);

  return {
    group,
    leftLeg: leftLegPivot,
    rightLeg: rightLegPivot,
    leftArm: leftArmPivot,
    rightArm: rightArmPivot,
    head: headPivot,
  };
}

export function createCharacterRig(id: string): CharacterRig {
  switch (id) {
    case 'gigachad':
      return createGigachadRig();
    case 'pepe':
      return createPepeRig();
    case 'popcat':
      return createPopcatRig();
    case 'wojak':
      return createWojakRig();
    case 'capybara':
      return createCapybaraRig();
    case 'doge':
    default:
      return createDogeRig();
  }
}
