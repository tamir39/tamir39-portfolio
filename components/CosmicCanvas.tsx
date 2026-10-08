"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

type Props = { progress: MotionValue<number>; moving: boolean; onUnavailable: () => void };

export default function CosmicCanvas({ progress, moving, onUnavailable }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const motionEnabled = useRef(moving);
  useEffect(() => { motionEnabled.current = moving; }, [moving]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      onUnavailable();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#e9dff3", 0.018);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight("#fff3e9", "#c6afe4", 3));
    const sun = new THREE.DirectionalLight("#fff1dd", 4);
    sun.position.set(-6, 10, 7);
    scene.add(sun);
    const fill = new THREE.DirectionalLight("#becbff", 2);
    fill.position.set(8, 2, -2);
    scene.add(fill);
    const world = new THREE.Group();
    scene.add(world);
    const material = (color: string, roughness = 0.7) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.06 });
    const peach = material("#f4bfae");
    const lavender = material("#b9a4d9");
    const cream = material("#fff0de");
    const blue = material("#a0b8dc");
    const mauve = material("#b69ac7");
    const add = (geometry: THREE.BufferGeometry, surface: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
      const mesh = new THREE.Mesh(geometry, surface);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };

    // The large ringed planet sits behind the island, in genuine perspective.
    const planet = new THREE.Group();
    planet.position.set(5, 3.4, -7);
    planet.rotation.set(0.25, 0, -0.32);
    world.add(planet);
    add(new THREE.SphereGeometry(2.65, 48, 32), peach, planet);
    const ring = add(new THREE.RingGeometry(3.25, 4.3, 96), new THREE.MeshStandardMaterial({ color: "#e7c4cf", side: THREE.DoubleSide, transparent: true, opacity: 0.75, roughness: 0.55 }), planet);
    ring.rotation.x = -Math.PI / 2.5;
    const thinRing = add(new THREE.TorusGeometry(4.45, 0.012, 6, 100), cream, planet);
    thinRing.rotation.copy(ring.rotation);
    add(new THREE.SphereGeometry(0.45, 24, 16), blue, world, -5.5, 3.2, -9);
    add(new THREE.SphereGeometry(0.25, 20, 12), peach, world, 0, 4.5, -5);
    const satellite = add(new THREE.IcosahedronGeometry(0.3, 0), lavender, world, 6.5, -0.4, 0);

    // A handmade observatory on a little floating, faceted world.
    const island = new THREE.Group();
    island.position.set(3.9, -1.8, 0);
    island.rotation.y = -0.3;
    world.add(island);
    const rock = add(new THREE.IcosahedronGeometry(1.9, 1), lavender, island, 0, -0.5, 0);
    rock.scale.set(1.4, 0.65, 1);
    const ground = add(new THREE.CylinderGeometry(1.85, 1.5, 0.3, 48), cream, island, 0, 0.2, 0);
    ground.scale.x = 1.2;
    add(new THREE.CylinderGeometry(0.7, 0.82, 1.05, 40), cream, island, 0.2, 0.88, -0.1);
    add(new THREE.SphereGeometry(0.73, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), blue, island, 0.2, 1.4, -0.1);
    const domeBand = add(new THREE.TorusGeometry(0.73, 0.035, 8, 48), mauve, island, 0.2, 1.4, -0.1);
    domeBand.rotation.x = Math.PI / 2;
    const door = add(new THREE.BoxGeometry(0.3, 0.5, 0.08), mauve, island, 0.2, 0.68, 0.68);
    add(new THREE.SphereGeometry(0.15, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mauve, island, door.position.x, 0.93, 0.68);
    const telescope = new THREE.Group();
    telescope.position.set(0.2, 1.6, -0.1);
    telescope.rotation.z = -0.8;
    island.add(telescope);
    add(new THREE.CylinderGeometry(0.13, 0.18, 0.85, 20), cream, telescope, 0, 0.35, 0);
    add(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 20), lavender, telescope, 0, 0.79, 0);
    for (let index = 0; index < 6; index++) {
      const step = add(new THREE.BoxGeometry(0.5, 0.11, 0.23), cream, island, 0.2, 0.3 - index * 0.07, 0.9 + index * 0.23);
      step.rotation.y = 0.06 * index;
    }
    for (let index = 0; index < 3; index++) {
      const stem = add(new THREE.CylinderGeometry(0.035, 0.06, 0.55, 8), mauve, island, -1.2 + index * 0.2, 0.65, -0.3 + index * 0.4);
      const crown = add(new THREE.IcosahedronGeometry(0.27, 1), index % 2 ? blue : peach, island, stem.position.x, 1, stem.position.z);
      crown.scale.y = 1.4;
    }
    add(new THREE.OctahedronGeometry(0.22), cream, world, 3.6, -3.6, 0.3);
    add(new THREE.OctahedronGeometry(0.13), lavender, world, 4.4, -4.1, -0.5);

    // Destination portal: a spatial object approached by the scroll-driven camera.
    const portal = new THREE.Group();
    portal.position.set(0.7, 0.2, -9);
    portal.rotation.y = 0.08;
    world.add(portal);
    const portalSurface = new THREE.MeshBasicMaterial({ color: "#d3d8fb", transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false });
    add(new THREE.CircleGeometry(1.6, 64), portalSurface, portal);
    add(new THREE.TorusGeometry(1.7, 0.1, 12, 80), lavender, portal);
    const innerRing = add(new THREE.TorusGeometry(1.53, 0.022, 8, 80), new THREE.MeshBasicMaterial({ color: "#ffffff" }), portal, 0, 0, 0.03);
    const orbit = add(new THREE.TorusGeometry(2.1, 0.018, 6, 80), cream, portal);
    orbit.rotation.set(0.4, 0.3, 0);
    for (let index = 0; index < 8; index++) {
      const angle = (index / 8) * Math.PI * 2;
      add(new THREE.OctahedronGeometry(0.08), cream, portal, Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0);
    }

    // Soft 2.5D clouds built from a shared radial sprite texture.
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = textureCanvas.height = 128;
    const context = textureCanvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,250,249,0.9)");
      gradient.addColorStop(0.45, "rgba(255,245,249,0.55)");
      gradient.addColorStop(1, "rgba(255,245,249,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    const cloudTexture = new THREE.CanvasTexture(textureCanvas);
    const cloudMaterial = new THREE.SpriteMaterial({ map: cloudTexture, transparent: true, opacity: 0.7, depthWrite: false });
    const clouds = new THREE.Group();
    world.add(clouds);
    for (let index = 0; index < 22; index++) {
      const cloud = new THREE.Sprite(cloudMaterial);
      cloud.position.set(Math.sin(index * 2.39) * 13, -3.6 + Math.cos(index * 1.7) * 0.6, -8 + (index % 5) * 3);
      cloud.scale.set(9 + index % 4, 2.8, 1);
      clouds.add(cloud);
    }

    // Comet and its tapered, curved lilac ribbon.
    const comet = new THREE.Group();
    world.add(comet);
    add(new THREE.SphereGeometry(0.11, 24, 16), new THREE.MeshBasicMaterial({ color: "#ffffff" }), comet);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTexture, color: "#a7c5ff", transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.setScalar(0.9);
    comet.add(glow);
    const tailCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, -0.13, 0), new THREE.Vector3(1.3, 0, -0.12), new THREE.Vector3(2.2, 0.5, -0.3)]);
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 48, 0.07, 8, false);
    const positions = tailGeometry.getAttribute("position");
    for (let index = 0; index < positions.count; index++) {
      const t = Math.floor(index / 9) / 48;
      const center = tailCurve.getPointAt(t);
      const taper = 1 - t * 0.97;
      positions.setXYZ(index, center.x + (positions.getX(index) - center.x) * taper, center.y + (positions.getY(index) - center.y) * taper, center.z + (positions.getZ(index) - center.z) * taper);
    }
    tailGeometry.computeVertexNormals();
    add(tailGeometry, new THREE.MeshBasicMaterial({ color: "#a9a3f2", transparent: true, opacity: 0.65 }), comet);
    const path = new THREE.CatmullRomCurve3([new THREE.Vector3(1.1, 0.2, 3), new THREE.Vector3(4.4, 1, 1), new THREE.Vector3(2.2, 1.5, -3), new THREE.Vector3(0.8, 0.3, -8)]);
    const particles = new THREE.Group();
    comet.add(particles);
    for (let index = 0; index < 14; index++) {
      add(new THREE.OctahedronGeometry(0.015 + (index % 3) * 0.008), new THREE.MeshBasicMaterial({ color: index % 2 ? "#ffffff" : "#b5b4fa" }), particles, 0.2 + index * 0.13, Math.sin(index * 4) * 0.15, Math.cos(index) * 0.15);
    }

    // Each universe has its own spatial language, not just a different palette.
    const designWorld = new THREE.Group();
    const digitalWorld = new THREE.Group();
    const pixelWorld = new THREE.Group();
    const gardenWorld = new THREE.Group();
    const worlds = [world, designWorld, digitalWorld, pixelWorld, gardenWorld];
    scene.add(designWorld, digitalWorld, pixelWorld, gardenWorld);
    const typographyTextures: THREE.Texture[] = [];
    const label = (text: string, color: string, parent: THREE.Group, x: number, y: number, z: number, width: number, height: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 768; canvas.height = 384;
      const ctx = canvas.getContext("2d");
      if (ctx) { ctx.fillStyle = color; ctx.font = 'bold 230px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 384, 200); }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      typographyTextures.push(texture);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthWrite: false }));
      sprite.position.set(x,y,z); sprite.scale.set(width,height,1); parent.add(sprite);
    };
    const terracotta = material("#df896b");
    const navy = material("#52618c");
    const paper = material("#fffcf1");
    const chartreuse = material("#d5dd9d");
    const designSet = new THREE.Group();
    designSet.position.set(3.7, -0.9, 0);
    designWorld.add(designSet);
    add(new THREE.BoxGeometry(5.3,0.18,3.4), paper, designSet,0,-1.5,0);
    const board = new THREE.Group();
    board.position.set(0.7,0.8,-1); board.rotation.y=-0.25; board.rotation.z=-0.08;
    designSet.add(board);
    add(new THREE.BoxGeometry(3.3,3.8,0.12), paper, board);
    const gridMaterial = new THREE.LineBasicMaterial({ color: "#a7b6c2", transparent: true, opacity: 0.55 });
    const linePoints: number[] = [];
    for(let i=0;i<7;i++) { const x=-1.65+i*0.55; linePoints.push(x,-1.9,0.08,x,1.9,0.08); }
    for(let i=0;i<8;i++) { const y=-1.9+i*(3.8/7); linePoints.push(-1.65,y,0.08,1.65,y,0.08); }
    const gridGeometry = new THREE.BufferGeometry(); gridGeometry.setAttribute("position",new THREE.Float32BufferAttribute(linePoints,3));
    board.add(new THREE.LineSegments(gridGeometry,gridMaterial));
    for(const x of [-1.65,1.65]) for(const y of [-1.9,1.9]) add(new THREE.BoxGeometry(0.14,0.14,0.1),navy,board,x,y,0.13);
    label("Aa", "#5c628e", designSet,0.8,1.2,0.1,3.4,1.7);
    const arch = add(new THREE.TorusGeometry(1.25,0.26,16,48,Math.PI),terracotta,designSet,-1.2,-0.6,1.1);
    arch.rotation.z=0;
    add(new THREE.BoxGeometry(0.52,0.9,0.52),terracotta,designSet,-2.45,-1.05,1.1);
    add(new THREE.BoxGeometry(0.52,0.9,0.52),terracotta,designSet,0.05,-1.05,1.1);
    const designSphere = add(new THREE.SphereGeometry(0.65,32,20),chartreuse,designSet,1.7,-0.7,1.2);
    const designOrbit = add(new THREE.TorusGeometry(2.5,0.015,6,80),navy,designSet,0,0.3,0);
    designOrbit.rotation.set(0.8,0.3,0.2);
    add(new THREE.OctahedronGeometry(0.4),terracotta,designSet,2.8,2.3,-0.5);

    // A bright glass city, with luminous connections between interface towers.
    const city = new THREE.Group();
    city.position.set(4,-1.9,0); city.rotation.y=-0.35;
    digitalWorld.add(city);
    const glass = new THREE.MeshPhysicalMaterial({ color:"#83cbd7", roughness:0.18, metalness:0.18, transparent:true, opacity:0.63, clearcoat:1 });
    const glassLilac = new THREE.MeshPhysicalMaterial({ color:"#b5b4e9", roughness:0.15, metalness:0.16, transparent:true, opacity:0.72, clearcoat:1 });
    const electric = new THREE.MeshBasicMaterial({color:"#d8ffff"});
    add(new THREE.CylinderGeometry(3.2,3.2,0.2,64),blue,city,0,-0.3,0);
    const towerData = [[-1.7,2.5,-0.8],[0,3.8,-1],[1.6,2.9,-0.4],[-0.9,1.6,1],[1,1.15,1.2]];
    for(let i=0;i<towerData.length;i++) {
      const [x,height,z]=towerData[i];
      const geometry = new THREE.BoxGeometry(0.95,height,0.95);
      add(geometry,i%2?glassLilac:glass,city,x,height/2-0.2,z);
      const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:"#e6fcff",transparent:true,opacity:0.9}));
      edge.position.set(x,height/2-0.2,z);city.add(edge);
      for(let j=0;j<3;j++) add(new THREE.BoxGeometry(0.6,0.035,0.025),electric,city,x,0.4+j*0.35,z+0.49);
      add(new THREE.BoxGeometry(1.03,0.06,1.03),paper,city,x,height-0.17,z);
    }
    const bridgeCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-1.7,1,0),new THREE.Vector3(-0.7,0.6,1),new THREE.Vector3(0.5,1.7,0),new THREE.Vector3(1.7,2,-0.4)]);
    add(new THREE.TubeGeometry(bridgeCurve,40,0.035,8,false),electric,city);
    label("</>","#6886ad",digitalWorld,4.1,3.5,-3,3.2,1.6);
    const dataOrbit=add(new THREE.TorusGeometry(3.6,0.025,8,96),paper,city,0,1.6,0);
    dataOrbit.rotation.set(1.05,0.3,-0.15);
    const dataNode=add(new THREE.IcosahedronGeometry(0.32,1),glassLilac,digitalWorld,6.7,2.5,0);

    // Chunky, deliberately low-resolution terrain and little game-world details.
    const voxelSet=new THREE.Group();voxelSet.position.set(4,-1.5,0);voxelSet.rotation.y=0.55;
    pixelWorld.add(voxelSet);
    const grass=material("#b6ca7a"); const soil=material("#d5ad87"); const stone=material("#a6bad2");
    const cubeGeometry=new THREE.BoxGeometry(0.55,0.55,0.55);
    for(let x=-4;x<=4;x++) for(let z=-3;z<=3;z++) {
      if(x*x+z*z>21) continue;
      const height=(Math.abs(x+z)%3)*0.16;
      add(cubeGeometry,grass,voxelSet,x*0.55,height-0.7,z*0.55);
      add(cubeGeometry,(x+z)%2?soil:stone,voxelSet,x*0.55,height-1.25,z*0.55);
      if(x*x+z*z<7) add(cubeGeometry,stone,voxelSet,x*0.55,height-1.8,z*0.55);
    }
    for(const [x,z] of [[-1.4,0],[0.8,-0.9],[1.6,0.4]]) {
      add(new THREE.BoxGeometry(0.2,1.1,0.2),soil,voxelSet,x,0.15,z);
      add(new THREE.BoxGeometry(0.95,0.65,0.95),grass,voxelSet,x,0.8,z);
      add(new THREE.BoxGeometry(0.6,0.45,0.6),chartreuse,voxelSet,x,1.35,z);
    }
    const pixelPortal=new THREE.Group();pixelPortal.position.set(0.2,1,-0.6);voxelSet.add(pixelPortal);
    for(let i=0;i<6;i++) { add(cubeGeometry,lavender,pixelPortal,-0.9,-0.5+i*0.5,0);add(cubeGeometry,lavender,pixelPortal,0.9,-0.5+i*0.5,0); }
    for(let i=0;i<3;i++) add(cubeGeometry,lavender,pixelPortal,-0.5+i*0.5,2.25,0);
    add(new THREE.PlaneGeometry(1.25,2.4),new THREE.MeshBasicMaterial({color:"#dce1fb",transparent:true,opacity:0.65,side:THREE.DoubleSide}),pixelPortal,0,0.8,0);
    const pixelCoin=add(new THREE.BoxGeometry(0.45,0.45,0.12),material("#f2ce7f"),pixelWorld,2,2,0);
    for(let i=0;i<6;i++) add(cubeGeometry,i%2?paper:blue,pixelWorld,1+i*0.8,3.7+(i%2)*0.2,-3);
    const pixelMoon=add(new THREE.BoxGeometry(1.8,1.8,1.8),peach,pixelWorld,6,3.3,-5);pixelMoon.rotation.set(0.3,0.3,0.1);

    // A quiet constellation garden completes the trip.
    const garden=new THREE.Group();garden.position.set(4,-1.9,0);gardenWorld.add(garden);
    add(new THREE.CylinderGeometry(2.8,2.3,0.4,64),paper,garden,0,-0.6,0);
    const sage=material("#a7c4ab"); const pink=material("#eab9c8");
    for(let i=0;i<7;i++) {
      const angle=i*2.4;const x=Math.cos(angle)*1.6;const z=Math.sin(angle)*1.4;const h=1.2+(i%3)*0.45;
      add(new THREE.CylinderGeometry(0.035,0.05,h,8),sage,garden,x,h/2-0.4,z);
      for(let petal=0;petal<5;petal++) {
        const a=petal/5*Math.PI*2;
        const flower=add(new THREE.SphereGeometry(0.22,16,12),i%2?pink:lavender,garden,x+Math.cos(a)*0.22,h-0.35+Math.sin(a)*0.22,z);
        flower.scale.set(1,0.8,0.5);
      }
      add(new THREE.SphereGeometry(0.12,16,12),cream,garden,x,h-0.35,z+0.12);
    }
    const gardenRing=add(new THREE.TorusGeometry(2.1,0.075,12,80),pink,garden,0,1.9,-1.2);
    gardenRing.rotation.y=-0.3;
    for(let i=0;i<9;i++) {const a=i/9*Math.PI*2;add(new THREE.OctahedronGeometry(0.1),cream,garden,Math.cos(a)*2.7,2+Math.sin(a)*2.2,-1);}
    add(new THREE.SphereGeometry(1.35,40,24),pink,gardenWorld,6,3.1,-6);
    label("✧", "#ac7d99",gardenWorld,2.3,2.5,0,1.2,0.6);

    // One comet travels across all five universes, changing its tail as it goes.
    scene.add(comet);
    const cometTailMaterial = (comet.children.find(child => child instanceof THREE.Mesh && child.geometry === tailGeometry) as THREE.Mesh).material as THREE.MeshBasicMaterial;
    const transitionRing=add(new THREE.TorusGeometry(2.5,0.035,8,96),new THREE.MeshBasicMaterial({color:"#fffaf2",transparent:true,opacity:0.7}),scene,3,0,3);
    const cometColors=["#a9a3f2","#df896b","#7fbfda","#d4bc68","#d19cb5"].map(color=>new THREE.Color(color));

    const pointer = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.set(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    let visible = true;
    let frame = 0;
    let time = 0;
    let lastTime = 0;
    let smoothProgress = progress.get();
    let travel = 0;
    let needsRender = true;
    let wasMoving = motionEnabled.current;
    let lastChapter = -1;
    const target = new THREE.Vector3();
    const cometPosition = new THREE.Vector3();
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!visible || document.hidden) return;
      const enabled = motionEnabled.current;
      if (enabled !== wasMoving) { needsRender = true; wasMoving = enabled; }
      const chapter = Math.min(4, Math.floor(progress.get() * 5 + 0.08));
      if (chapter !== lastChapter) { needsRender = true; lastChapter = chapter; }
      if (!enabled && !needsRender) return;
      if (enabled) time += delta;
      smoothProgress += (progress.get() - smoothProgress) * Math.min(1, delta * 7);
      travel = enabled ? smoothProgress : (chapter + 0.05) / 5;
      const mobile = container.clientWidth < 700;
      const journey = Math.min(4.999, travel * 5);
      const current = Math.min(4, Math.floor(journey));
      const fraction = journey - current;
      const mix = current === 4 ? 0 : THREE.MathUtils.smoothstep(fraction, 0.72, 1);
      const universePosition = current + mix;
      worlds.forEach((universe,index)=>{
        const distance=index-universePosition;
        universe.visible=Math.abs(distance)<0.99;
        universe.position.set(distance*20, -Math.abs(distance)*0.7, -Math.abs(distance)*5);
        universe.rotation.y=distance*0.15;
        if(mobile && index>0) { universe.position.y-=2; }
      });
      camera.position.set(enabled ? pointer.x * 0.25 : 0, 1.1 + (enabled ? -pointer.y * 0.1 : 0), (mobile ? 21 : 15) - Math.sin(mix*Math.PI)*1.5);
      target.set(mobile ? 1.3 : 0.3, 0.4, -1);
      camera.lookAt(target);
      // Move the island to the right on desktop; mobile keeps the world below the copy.
      island.position.y = (mobile ? -3.2 : -1.8) + Math.sin(time * 0.5) * 0.09;
      island.rotation.y = -0.3 + Math.sin(time * 0.2) * 0.03;
      planet.rotation.y = time * 0.025;
      satellite.rotation.y = time * 0.12;
      innerRing.rotation.z = time * 0.12;
      orbit.rotation.z = -time * 0.06;
      path.getPoint(0.05 + (fraction*0.35), cometPosition);
      cometPosition.x += Math.sin(mix*Math.PI)*2.5;
      if(mobile) cometPosition.y-=1.4;
      cometTailMaterial.color.copy(cometColors[current]).lerp(cometColors[Math.min(4,current+1)],mix);
      cometTailMaterial.opacity=current===3?0.3:0.65;
      particles.children.forEach((particle,index)=>{ particle.scale.setScalar(current===3?2.5:1); particle.rotation.z=time*0.3+index; });
      transitionRing.scale.setScalar(Math.max(0.001,Math.sin(mix*Math.PI)*3));
      transitionRing.visible=mix>0.02&&mix<0.98;
      designSphere.position.y=-0.7+Math.sin(time*0.6)*0.12;
      designOrbit.rotation.z=time*0.04;
      dataNode.position.y=2.5+Math.sin(time*0.5)*0.2;
      dataOrbit.rotation.z=-time*0.05;
      pixelCoin.rotation.y=time*0.5;
      gardenRing.rotation.z=Math.sin(time*0.3)*0.05;
      comet.position.copy(cometPosition);
      comet.position.y += Math.sin(time * 1.2) * 0.09;
      comet.rotation.z = -travel * 1.8 + Math.sin(time * 0.3) * 0.1;
      glow.material.opacity = 0.8 + Math.sin(time * 2) * 0.12;
      renderer.render(scene, camera);
      needsRender = false;
    };
    const resize = () => {
      needsRender = true;
      camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    intersectionObserver.observe(container);
    const onContextLost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    resize();
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) geometries.add(object.geometry);
        if (object instanceof THREE.Mesh || object instanceof THREE.Sprite || object instanceof THREE.Line) {
          const list = Array.isArray(object.material) ? object.material : [object.material];
          list.forEach(surface => materials.add(surface));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(surface => surface.dispose());
      cloudTexture.dispose();
      typographyTextures.forEach(texture => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, onUnavailable]);

  return <div ref={host} className="cosmic-canvas" aria-hidden="true" />;
}
