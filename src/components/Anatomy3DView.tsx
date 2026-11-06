import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Brain,
  Heart,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Info,
  Maximize2,
  Stethoscope,
  Activity
} from 'lucide-react';

interface OrganInfo {
  id: string;
  nom: string;
  systeme: 'Cardiovasculaire' | 'Respiratoire' | 'Digestif' | 'Nerveux' | 'Urinaire' | 'Squelettique';
  description: string;
  vascularisation: string;
  innervation: string;
  pathologiesCles: string[];
  explorations: string[];
}

const ORGANS_DATA: { [key: string]: OrganInfo } = {
  coeur: {
    id: 'coeur',
    nom: 'Cœur (Myocarde & Cavités)',
    systeme: 'Cardiovasculaire',
    description: 'Organe musculaire creux pyramidal à 4 cavités (2 atriums, 2 ventricules) assurant la propulsion systémique et pulmonaire du sang.',
    vascularisation: 'Artères coronaires droite et gauche (naissant des sinus de Valsalva de l\'aorte ascendante). Drainage par le sinus coronaire dans l\'atrium droit.',
    innervation: 'Plexus cardiaque autonome (parasympathique via le nerf vague X ; sympathique via les ganglions cervico-thoraciques).',
    pathologiesCles: ['Infarctus du myocarde (SCA)', 'Insuffisance cardiaque globale', 'Cardiopathie rhumatismale post-streptococcique', 'Péricardite / Tamponnade'],
    explorations: ['ECG 12 dérivations', 'Échocardiographie transthoracique (ETT)', 'Coronarographie', 'Troponine Ic/Tc']
  },
  poumons: {
    id: 'poumons',
    nom: 'Poumons (Droit & Gauche) et Arbre Trachéo-Bronchique',
    systeme: 'Respiratoire',
    description: 'Organes pairs de l\'hématose situés dans la cavité thoracique de part et d\'autre du médiastin. Le poumon droit comporte 3 lobes, le poumon gauche 2 lobes avec incisure cardiaque.',
    vascularisation: 'Double vascularisation : fonctionnelle (artères et veines pulmonaires - petite circulation) et nourricière (artères bronchiques issues de l\'aorte).',
    innervation: 'Plexus pulmonaire issu du nerf vague X et de la chaîne sympathique thoracique.',
    pathologiesCles: ['Pneumonie aiguë communautaire (PCIME)', 'Tuberculose pulmonaire excavée', 'Embolie pulmonaire aiguë', 'Asthme aigu grave'],
    explorations: ['Radiographie thoracique de face', 'Scanner thoracique injecté (Angioscanner)', 'Gazométrie artérielle', 'Spirométrie (DEP)']
  },
  cerveau: {
    id: 'cerveau',
    nom: 'Cerveau & Encéphale',
    systeme: 'Nerveux',
    description: 'Partie principale du système nerveux central logée dans la boîte crânienne, constituée des hémisphères cérébraux, du diencéphale, du tronc cérébral et du cervelet.',
    vascularisation: 'Polygone de Willis constitué des artères carotides internes et du tronc basilaire (artères vertébrales).',
    innervation: 'Origine des 12 paires de nerfs crâniens.',
    pathologiesCles: ['Neuropaludisme à P. falciparum', 'Accident Vasculaire Cérébral ischémique ou hémorragique', 'Méningite bactérienne purulente', 'Épilepsie / Convulsions'],
    explorations: ['Scanner cérébral sans injection en urgence', 'Ponction lombaire (LCR)', 'IRM encéphalique', 'Électroencéphalogramme (EEG)']
  },
  foie: {
    id: 'foie',
    nom: 'Foie & Voies Biliaires',
    systeme: 'Digestif',
    description: 'Plus volumineuse glande de l\'organisme (1,5 kg), située dans l\'hypochondre droit, assurant la synthèse protéique, l\'épuration métabolique et la sécrétion de bile.',
    vascularisation: 'Double apport : nutritif par l\'artère hépatique propre (25%) et fonctionnel par la veine porte (75%). Drainage par les veines sus-hépatiques vers la veine cave inférieure.',
    innervation: 'Plexus hépatique issu du nerf vague et du plexus cœliaque.',
    pathologiesCles: ['Hépatite virale aiguë/chronique (B, C)', 'Cirrhose et hypertension portale', 'Abcès amibien du foie', 'HELLP syndrome'],
    explorations: ['Échographie abdominale', 'Bilan hépatique (ASAT, ALAT, Bilirubine, Phosphatases alcalines, TP/INR)', 'Sérologies virales']
  },
  reins: {
    id: 'reins',
    nom: 'Reins (Droit & Gauche) & Appareil Rénovasculaire',
    systeme: 'Urinaire',
    description: 'Organes rétropéritonéaux en forme de haricot (12 cm de hauteur) situés le long du rachis lombaire, responsables de l\'ultrafiltration glomérulaire, régulation hydro-électrolytique et endocrine (rénine, érythropoïétine).',
    vascularisation: 'Artères rénales droite et gauche naissant de l\'aorte abdominale à hauteur de L1-L2. Drainage par les veines rénales dans la VCI.',
    innervation: 'Plexus rénal autonome issu du plexus cœliaque.',
    pathologiesCles: ['Insuffisance rénale aiguë sur déshydratation / choc', 'Glomérulonéphrite post-infectieuse', 'Lithiase urinaire', 'Néphropathie drépanocytaire'],
    explorations: ['Créatininémie avec calcul DFG / ClCr', 'Ionogramme sanguin et urinaire', 'Bandelette urinaire (protéinurie/hématurie)', 'Échographie rénale']
  },
  rachis: {
    id: 'rachis',
    nom: 'Rachis & Système Squelettique Axial',
    systeme: 'Squelettique',
    description: 'Colonne vertébrale constituée de 33 vertèbres (7 cervicales, 12 thoraciques, 5 lombaires, 5 sacrées soudées, 4 coccygiennes) protégeant la moelle spinale.',
    vascularisation: 'Artères vertébrales, intercostales et lombaires.',
    innervation: 'Nerfs spinaux issus des métamères médullaires.',
    pathologiesCles: ['Mal de Pott (Tuberculose osseuse rachidienne)', 'Traumatisme médullaire avec tétra/paraplégie', 'Compression médullaire aiguë', 'Crise vaso-occlusive osseuse drépanocytaire'],
    explorations: ['Radiographies du rachis face et profil', 'Scanner osseux rachidien', 'IRM médullaire urgente']
  }
};

export const Anatomy3DView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedOrganKey, setSelectedOrganKey] = useState<string>('coeur');
  const [filterSystem, setFilterSystem] = useState<string>('TOUS');
  const [explodedView, setExplodedView] = useState<number>(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // References for Three.js instance
  const organMeshesRef = useRef<{ [key: string]: THREE.Group }>({});
  const controlsRef = useRef<OrbitControls | null>(null);
  const requestRenderRef = useRef<() => void>(() => {});

  const currentOrgan = ORGANS_DATA[selectedOrganKey] || ORGANS_DATA.coeur;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Deep dark slate background
    scene.fog = new THREE.FogExp2(0x030712, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // RoomEnvironment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.8, 0);
    controls.maxDistance = 6.0;
    controls.minDistance = 1.2;
    controlsRef.current = controls;

    // Lighting (3-Point Studio Rig)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(3, 3);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    scene.add(shadowPlane);

    // Root Anatomy Group
    const anatomyRoot = new THREE.Group();
    scene.add(anatomyRoot);

    // Materials Palette
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.45,
      metalness: 0.05
    });

    const heartMat = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c, // Rich arterial red
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.6
    });

    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Pulmonary sky blue
      roughness: 0.5,
      metalness: 0.05,
      transparent: true,
      opacity: 0.85
    });

    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6, // Cerebral soft pink
      roughness: 0.4,
      metalness: 0.05
    });

    const liverMat = new THREE.MeshStandardMaterial({
      color: 0x92400e, // Hepatic deep amber
      roughness: 0.4,
      metalness: 0.05
    });

    const kidneyMat = new THREE.MeshStandardMaterial({
      color: 0x831843, // Renal wine red
      roughness: 0.35,
      metalness: 0.05
    });

    const vesselRedMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Aorta
      roughness: 0.25,
      metalness: 0.2
    });

    const vesselBlueMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Vena Cava
      roughness: 0.25,
      metalness: 0.2
    });

    const organsMap: { [key: string]: THREE.Group } = {};

    // 1. SKELETON / SPINE (Rachis & Cage thoracique)
    const spineGroup = new THREE.Group();
    spineGroup.userData = { id: 'rachis' };

    // Spine Column
    const vertGeo = new THREE.CylinderGeometry(0.04, 0.045, 1.2, 16);
    const spineColumn = new THREE.Mesh(vertGeo, boneMat);
    spineColumn.position.set(0, 0.8, -0.08);
    spineGroup.add(spineColumn);

    // Pelvis base
    const pelvisGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 24, Math.PI);
    const pelvis = new THREE.Mesh(pelvisGeo, boneMat);
    pelvis.rotation.x = Math.PI / 2;
    pelvis.position.set(0, 0.2, 0);
    spineGroup.add(pelvis);

    // Rib cage hoops
    for (let i = 0; i < 7; i++) {
      const ribGeo = new THREE.TorusGeometry(0.24 + i * 0.015, 0.018, 8, 24, Math.PI * 1.6);
      const rib = new THREE.Mesh(ribGeo, boneMat);
      rib.rotation.x = Math.PI / 2 + 0.1;
      rib.rotation.z = Math.PI * 0.2;
      rib.position.set(0, 0.6 + i * 0.1, 0);
      spineGroup.add(rib);
    }
    anatomyRoot.add(spineGroup);
    organsMap.rachis = spineGroup;

    // 2. CŒUR (Heart & Great Vessels)
    const heartGroup = new THREE.Group();
    heartGroup.userData = { id: 'coeur' };

    const heartGeo = new THREE.SphereGeometry(0.12, 24, 24);
    heartGeo.scale(1.1, 1.3, 0.9);
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(-0.03, 0.95, 0.08);
    heartMesh.rotation.z = -0.2;
    heartGroup.add(heartMesh);

    // Aorta arch
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 1.05, 0.08),
      new THREE.Vector3(-0.02, 1.2, 0.05),
      new THREE.Vector3(0.04, 1.22, 0.02),
      new THREE.Vector3(0.05, 1.05, -0.05),
      new THREE.Vector3(0.05, 0.5, -0.06)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 20, 0.025, 12, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, vesselRedMat);
    heartGroup.add(aortaMesh);

    // Vena Cava
    const cavaGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.8, 12);
    const cavaMesh = new THREE.Mesh(cavaGeo, vesselBlueMat);
    cavaMesh.position.set(0.06, 0.85, 0.04);
    heartGroup.add(cavaMesh);

    anatomyRoot.add(heartGroup);
    organsMap.coeur = heartGroup;

    // 3. POUMONS (Lungs Right & Left)
    const lungsGroup = new THREE.Group();
    lungsGroup.userData = { id: 'poumons' };

    // Right lung (3 lobes silhouette)
    const rLungGeo = new THREE.SphereGeometry(0.16, 20, 20);
    rLungGeo.scale(0.8, 1.6, 0.9);
    const rLungMesh = new THREE.Mesh(rLungGeo, lungMat);
    rLungMesh.position.set(0.18, 0.95, 0.05);
    lungsGroup.add(rLungMesh);

    // Left lung (with cardiac notch)
    const lLungGeo = new THREE.SphereGeometry(0.15, 20, 20);
    lLungGeo.scale(0.75, 1.55, 0.85);
    const lLungMesh = new THREE.Mesh(lLungGeo, lungMat);
    lLungMesh.position.set(-0.19, 0.95, 0.05);
    lungsGroup.add(lLungMesh);

    // Trachea
    const tracheaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12);
    const tracheaMesh = new THREE.Mesh(tracheaGeo, boneMat);
    tracheaMesh.position.set(0, 1.35, 0.02);
    lungsGroup.add(tracheaMesh);

    anatomyRoot.add(lungsGroup);
    organsMap.poumons = lungsGroup;

    // 4. CERVEAU (Brain)
    const brainGroup = new THREE.Group();
    brainGroup.userData = { id: 'cerveau' };

    const brainLGeo = new THREE.SphereGeometry(0.12, 20, 20);
    brainLGeo.scale(0.9, 1.1, 1.2);
    const brainLMesh = new THREE.Mesh(brainLGeo, brainMat);
    brainLMesh.position.set(-0.06, 1.75, 0);
    brainGroup.add(brainLMesh);

    const brainRGeo = new THREE.SphereGeometry(0.12, 20, 20);
    brainRGeo.scale(0.9, 1.1, 1.2);
    const brainRMesh = new THREE.Mesh(brainRGeo, brainMat);
    brainRMesh.position.set(0.06, 1.75, 0);
    brainGroup.add(brainRMesh);

    // Brainstem
    const stemGeo = new THREE.CylinderGeometry(0.03, 0.025, 0.25, 12);
    const stemMesh = new THREE.Mesh(stemGeo, brainMat);
    stemMesh.position.set(0, 1.55, -0.03);
    brainGroup.add(stemMesh);

    anatomyRoot.add(brainGroup);
    organsMap.cerveau = brainGroup;

    // 5. FOIE (Liver)
    const liverGroup = new THREE.Group();
    liverGroup.userData = { id: 'foie' };

    const liverGeo = new THREE.CylinderGeometry(0.18, 0.08, 0.22, 16);
    liverGeo.scale(1.3, 0.8, 0.9);
    const liverMesh = new THREE.Mesh(liverGeo, liverMat);
    liverMesh.position.set(0.12, 0.62, 0.06);
    liverMesh.rotation.z = -0.3;
    liverMesh.rotation.x = 0.2;
    liverGroup.add(liverMesh);

    anatomyRoot.add(liverGroup);
    organsMap.foie = liverGroup;

    // 6. REINS (Kidneys)
    const kidneyGroup = new THREE.Group();
    kidneyGroup.userData = { id: 'reins' };

    const rKidneyGeo = new THREE.SphereGeometry(0.07, 16, 16);
    rKidneyGeo.scale(0.7, 1.3, 0.6);
    const rKidneyMesh = new THREE.Mesh(rKidneyGeo, kidneyMat);
    rKidneyMesh.position.set(0.14, 0.48, -0.06);
    kidneyGroup.add(rKidneyMesh);

    const lKidneyGeo = new THREE.SphereGeometry(0.07, 16, 16);
    lKidneyGeo.scale(0.7, 1.3, 0.6);
    const lKidneyMesh = new THREE.Mesh(lKidneyGeo, kidneyMat);
    lKidneyMesh.position.set(-0.14, 0.52, -0.06); // Rein gauche légèrement plus haut
    kidneyGroup.add(lKidneyMesh);

    anatomyRoot.add(kidneyGroup);
    organsMap.reins = kidneyGroup;

    organMeshesRef.current = organsMap;

    // Raycaster for organ selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(anatomyRoot.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData.id && obj.parent !== anatomyRoot) {
          obj = obj.parent;
        }
        if (obj && obj.userData.id) {
          setSelectedOrganKey(obj.userData.id);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Animation & Render Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();

      // Smooth auto-rotation if active
      if (autoRotate) {
        anatomyRoot.rotation.y += delta * 0.3;
      }

      // Smooth heart pulsating effect (heartbeat)
      const heartObj = organsMap.coeur;
      if (heartObj) {
        const beat = 1 + Math.sin(clock.elapsedTime * 6) * 0.03;
        heartObj.scale.set(beat, beat, beat);
      }

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    };

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle filter changes (show/hide organ groups)
  useEffect(() => {
    Object.keys(organMeshesRef.current).forEach((key) => {
      const group = organMeshesRef.current[key];
      const data = ORGANS_DATA[key];
      if (!group || !data) return;

      if (filterSystem === 'TOUS' || data.systeme.toLowerCase().includes(filterSystem.toLowerCase())) {
        group.visible = true;
      } else {
        group.visible = false;
      }
    });
  }, [filterSystem]);

  // Handle exploded view separation
  useEffect(() => {
    const factor = explodedView / 100;
    const organs = organMeshesRef.current;

    if (organs.poumons) organs.poumons.position.z = factor * 0.4;
    if (organs.coeur) organs.coeur.position.z = factor * 0.55;
    if (organs.cerveau) organs.cerveau.position.y = factor * 0.35;
    if (organs.foie) organs.foie.position.x = factor * 0.4;
    if (organs.reins) organs.reins.position.z = -factor * 0.35;
  }, [explodedView]);

  return (
    <div className="relative w-full h-[780px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Spec Badge & Organ Header */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl backdrop-blur shadow-lg">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Anatomie Humaine 3D Interactive
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            Sélectionné : <strong className="text-sky-400">{currentOrgan.nom}</strong> ({currentOrgan.systeme})
          </span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(prev => !prev)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur border transition ${
            autoRotate
              ? 'bg-sky-600/90 text-white border-sky-500 shadow-sm'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:text-white'
          }`}
        >
          {autoRotate ? 'Rotation 360° : ON' : 'Rotation : OFF'}
        </button>
      </div>

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion standard) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-transform duration-300">
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur overflow-hidden">
          {/* Dock Header Bar with Collapse Toggle */}
          <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Panneau de Contrôle Anatomique</span>
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                Faites glisser la vue ou cliquez sur un organe
              </span>
            </div>

            <button
              onClick={() => setIsDockCollapsed(prev => !prev)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded transition"
            >
              {isDockCollapsed ? (
                <>
                  <span>Afficher Détails</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Masquer</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Expanded Dock Body */}
          {!isDockCollapsed && (
            <div className="p-4 space-y-4 text-xs">
              {/* Controls Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* System Filter */}
                <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['TOUS', 'Cardiovasculaire', 'Respiratoire', 'Nerveux', 'Digestif'].map(sys => (
                    <button
                      key={sys}
                      onClick={() => setFilterSystem(sys)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                        filterSystem === sys
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {sys}
                    </button>
                  ))}
                </div>

                {/* Exploded View Slider */}
                <div className="md:col-span-4 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">Vue Éclatée :</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={explodedView}
                    onChange={(e) => setExplodedView(parseInt(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-sky-400 w-8 text-right">{explodedView}%</span>
                </div>

                {/* Direct Organ Selector */}
                <div className="md:col-span-3">
                  <select
                    value={selectedOrganKey}
                    onChange={(e) => setSelectedOrganKey(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option value="coeur">Cœur & Vaisseaux</option>
                    <option value="poumons">Poumons & Trachée</option>
                    <option value="cerveau">Cerveau & Encéphale</option>
                    <option value="foie">Foie & Voies Biliaires</option>
                    <option value="reins">Reins & Vaisseaux</option>
                    <option value="rachis">Rachis & Cage Thoracique</option>
                  </select>
                </div>
              </div>

              {/* Organ Clinical Sheet Card */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-[11px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-sky-400 text-xs">{currentOrgan.nom}</span>
                  <span className="text-slate-400">{currentOrgan.systeme}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">{currentOrgan.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 pt-1">
                  <div>
                    <strong className="text-slate-200">Vascularisation :</strong> {currentOrgan.vascularisation}
                  </div>
                  <div>
                    <strong className="text-slate-200">Innervation :</strong> {currentOrgan.innervation}
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-300">Pathologies associées :</span>
                  {currentOrgan.pathologiesCles.map((p, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
