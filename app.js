import * as T from "./assets/vendor/three.module.js?v=ce1fa418de16a19495a9f72495580e3015d7745c296d3ce0485897f902ddedfb";
import { createRenderControl } from "./render-control.js?v=37253f0cea0acd696b7e0a6efb32a0c9e5229cc876bf998b8f34d3248e645f4c";
const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
  form = document.querySelector("#scent-form");
const openingWords = {
  Bergamot: ["Luminous", "a bright space"],
  "Black pepper": ["Electric", "a dry, sparkling edge"],
  Cardamom: ["Cool", "an aromatic hush"],
};
const heartWords = {
  Iris: ["silence", "softens the edges"],
  Rose: ["reverie", "adds a dark floral heart"],
  Incense: ["shadow", "draws a mineral veil"],
};
const baseWords = {
  Vetiver: "a dry, grounded trace",
  Sandalwood: "a quiet, creamy warmth",
  Amber: "a warm, enveloping echo",
};
let selection,
  activeStage = "opening",
  control,
  renderer,
  scene,
  camera,
  sculpture,
  facets,
  facetMaterial,
  cap,
  plaque,
  outline,
  progress = 0,
  px = 0;
function updateSelection() {
  const data = new FormData(form),
    opening = data.get("opening"),
    heart = data.get("heart"),
    base = data.get("base"),
    intensity = Number(document.querySelector("#sillage").value);
  const names = [
    ["Bergamot", "Black pepper", "Cardamom"],
    ["Iris", "Rose", "Incense"],
    ["Vetiver", "Sandalwood", "Amber"],
  ];
  const indices = [
    names[0].indexOf(opening),
    names[1].indexOf(heart),
    names[2].indexOf(base),
  ];
  const code = indices[0] * 9 + indices[1] * 3 + indices[2] + 1;
  const name = `${openingWords[opening][0]} ${heartWords[heart][0]}.`;
  const description = `${opening} opens ${openingWords[opening][1]}. ${heart} ${heartWords[heart][1]}. ${base} leaves ${baseWords[base]}.`;
  const presence = ["Intimate", "Present", "Lingering"][intensity - 1];
  document.querySelector("#selection-name").textContent = name;
  document.querySelector("#selection-description").textContent = description;
  document.querySelector("#selected-opening").textContent =
    opening.toUpperCase();
  document.querySelector("#selected-heart").textContent = heart.toUpperCase();
  document.querySelector("#selected-base").textContent = base.toUpperCase();
  document.querySelector("#sillage-output").value = presence.toUpperCase();
  document.querySelector("#constellation-code").textContent =
    `N° ${String(code).padStart(3, "0")}`;
  const points = indices.map((value, i) => {
    const angle = ((-90 + i * 120 + value * 12) * Math.PI) / 180,
      r = 82 + value * 14 + intensity * 5;
    return [160 + Math.cos(angle) * r, 160 + Math.sin(angle) * r];
  });
  document
    .querySelector("#scent-polygon")
    .setAttribute("points", points.map((p) => p.join(",")).join(" "));
  document.querySelectorAll("#scent-points circle").forEach((node, i) => {
    node.setAttribute("cx", points[i][0]);
    node.setAttribute("cy", points[i][1]);
  });
  selection = {
    opening,
    heart,
    base,
    intensity,
    presence,
    name,
    description,
    code,
  };
  document.querySelector("#save-status").textContent =
    "A personal selection sheet, saved to your device.";
  control?.invalidate();
}
form.addEventListener("change", updateSelection);
document.querySelector("#sillage").addEventListener("input", updateSelection);
document.querySelector("#save-selection").addEventListener("click", () => {
  const s = selection;
  const text = `NOCTURNE / PERSONAL STUDY ${String(s.code).padStart(3, "0")}\n\n${s.name}\n\nOpening: ${s.opening}\nHeart: ${s.heart}\nTrace: ${s.base}\nImpression: ${s.presence}\n\n${s.description}\n\nThis is a fragrance preference selection, not a manufactured perfume or mixing formula.\nIndependent fragrance concept by Polina Koljanikova.\n`;
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `nocturne-study-${String(s.code).padStart(3, "0")}.txt`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#save-status").textContent =
    "Your personal study is ready. Keep a trace of the feeling.";
});
const stageDescriptions = {
  opening: "Opening / a crisp, luminous first impression.",
  heart: "Heart / powdered iris and a quiet thread of incense.",
  base: "Trace / dry woods and the warmth that stays.",
};
document.querySelectorAll("[data-note]").forEach((button) =>
  button.addEventListener("click", () => {
    activeStage = button.dataset.note;
    document.querySelectorAll("[data-note]").forEach((b) => {
      b.classList.toggle("selected", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    document.querySelector("#note-status").textContent =
      stageDescriptions[activeStage];
    control?.invalidate();
  }),
);
updateSelection();

const canvas = document.querySelector("#nocturne-canvas"),
  story = document.querySelector(".story"),
  stage = document.querySelector(".stage");
const clamp = (v) => Math.max(0, Math.min(1, v)),
  ease = (v) => {
    v = clamp(v);
    return v * v * (3 - 2 * v);
  };
const faceData = [],
  dummy = new T.Object3D(),
  silver = new T.Color();
function environment() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const x = c.getContext("2d"),
    ambient = x.createLinearGradient(0, 0, 0, 512);
  ambient.addColorStop(0, "#101316");
  ambient.addColorStop(0.48, "#3b4147");
  ambient.addColorStop(1, "#08090b");
  x.fillStyle = ambient;
  x.fillRect(0, 0, 1024, 512);
  const softbox = (left, width, top, height, brightness) => {
    const g = x.createLinearGradient(left, 0, left + width, 0);
    g.addColorStop(0, "rgba(235,237,239,0)");
    g.addColorStop(0.2, `rgba(235,237,239,${brightness * 0.6})`);
    g.addColorStop(0.45, `rgba(255,254,249,${brightness})`);
    g.addColorStop(0.62, `rgba(255,254,249,${brightness})`);
    g.addColorStop(1, "rgba(235,237,239,0)");
    x.fillStyle = g;
    x.fillRect(left, top, width, height);
  };
  softbox(84, 138, 15, 470, 0.94);
  softbox(555, 220, 35, 430, 0.62);
  softbox(890, 24, 70, 350, 1);
  const map = new T.CanvasTexture(c);
  map.mapping = T.EquirectangularReflectionMapping;
  map.colorSpace = T.SRGBColorSpace;
  const p = new T.PMREMGenerator(renderer),
    target = p.fromEquirectangular(map);
  p.dispose();
  map.dispose();
  return target.texture;
}
function addTriangle(a, b, c, id) {
  const centre = a
      .clone()
      .add(b)
      .add(c)
      .multiplyScalar(1 / 3),
    u = b.clone().sub(a),
    v = c.clone().sub(a),
    n = u.clone().cross(v).normalize(),
    local = a.clone().sub(centre);
  const matrix = new T.Matrix4().set(
    u.x,
    v.x,
    n.x,
    local.x,
    u.y,
    v.y,
    n.y,
    local.y,
    u.z,
    v.z,
    n.z,
    local.z,
    0,
    0,
    0,
    1,
  );
  faceData.push({
    matrix,
    centre,
    direction: centre.clone().normalize(),
    phase: id * 0.37,
  });
}
function makeBottle() {
  const ring = (y, r) =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      return new T.Vector3(Math.sin(a) * r, y, Math.cos(a) * r * 0.72);
    });
  const rings = [
    ring(-1.18, 0.68),
    ring(-1.03, 0.82),
    ring(0.72, 0.82),
    ring(1.08, 0.29),
  ];
  let id = 0;
  for (let j = 0; j < 3; j++)
    for (let i = 0; i < 8; i++) {
      const k = (i + 1) % 8;
      addTriangle(rings[j][i], rings[j][k], rings[j + 1][i], id++);
      addTriangle(rings[j][k], rings[j + 1][k], rings[j + 1][i], id++);
    }
  const g = new T.BufferGeometry();
  g.setAttribute(
    "position",
    new T.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3),
  );
  g.setAttribute(
    "normal",
    new T.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1], 3),
  );
  facetMaterial = new T.MeshStandardMaterial({
    color: 0xc4c6c8,
    metalness: 0.9,
    roughness: 0.27,
    side: T.DoubleSide,
    envMapIntensity: 1.6,
  });
  facets = new T.InstancedMesh(g, facetMaterial, faceData.length);
  facets.frustumCulled = false;
  facets.instanceMatrix.setUsage(T.DynamicDrawUsage);
  for (let i = 0; i < faceData.length; i++) {
    // The two triangles belong to one machined face and must share its finish.
    const panel = Math.floor(i / 2),
      v = 0.93 + Math.sin((panel % 8) * 1.71) * 0.025;
    facets.setColorAt(i, new T.Color(v, v, v));
  }
  sculpture.add(facets);
  const edges = [];
  for (const ring of rings)
    for (let i = 0; i < 8; i++) edges.push([ring[i], ring[(i + 1) % 8]]);
  for (let j = 0; j < rings.length - 1; j++)
    for (let i = 0; i < 8; i++) edges.push([rings[j][i], rings[j + 1][i]]);
  const edgeMetal = new T.MeshStandardMaterial({
    color: 0xd0d0cc,
    metalness: 0.94,
    roughness: 0.18,
    envMapIntensity: 1.9,
  });
  outline = new T.InstancedMesh(
    new T.CylinderGeometry(0.0035, 0.0035, 1, 5, 1, true),
    edgeMetal,
    edges.length,
  );
  const edgeTransform = new T.Object3D(),
    up = new T.Vector3(0, 1, 0),
    direction = new T.Vector3();
  edges.forEach(([a, b], i) => {
    direction.copy(b).sub(a);
    edgeTransform.position.copy(a).add(b).multiplyScalar(0.5);
    edgeTransform.quaternion.setFromUnitVectors(
      up,
      direction.clone().normalize(),
    );
    edgeTransform.scale.set(1, direction.length(), 1);
    edgeTransform.updateMatrix();
    outline.setMatrixAt(i, edgeTransform.matrix);
  });
  outline.instanceMatrix.needsUpdate = true;
  sculpture.add(outline);
  const metal = new T.MeshStandardMaterial({
    color: 0x9b9c9d,
    metalness: 0.95,
    roughness: 0.2,
  });
  const collar = new T.Mesh(
    new T.CylinderGeometry(0.24, 0.24, 0.17, 24),
    metal,
  );
  collar.position.y = 1.14;
  sculpture.add(collar);
  cap = new T.Mesh(
    new T.CylinderGeometry(0.31, 0.31, 0.49, 32),
    new T.MeshStandardMaterial({
      color: 0x777b81,
      metalness: 0.91,
      roughness: 0.2,
      envMapIntensity: 1.5,
    }),
  );
  cap.position.y = 1.48;
  sculpture.add(cap);
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const x = c.getContext("2d");
  x.fillStyle = "#15171a";
  x.fillRect(0, 0, 512, 512);
  x.strokeStyle = "#aaa8";
  x.strokeRect(18, 18, 476, 476);
  x.fillStyle = "#d6d4cc";
  x.textAlign = "center";
  x.font = "120px Bodoni";
  x.fillText("N°", 256, 200);
  x.font = "34px DM";
  x.letterSpacing = "4px";
  x.fillText("NOCTURNE", 256, 293);
  x.font = "19px DM";
  x.letterSpacing = "1px";
  x.fillText("EXTRAIT DE PARFUM", 256, 347);
  x.fillText("50 ML / STUDY 01", 256, 424);
  const map = new T.CanvasTexture(c);
  map.colorSpace = T.SRGBColorSpace;
  plaque = new T.Mesh(
    new T.PlaneGeometry(0.75, 0.75),
    new T.MeshBasicMaterial({ map, toneMapped: false }),
  );
  plaque.position.set(0, -0.06, 0.604);
  sculpture.add(plaque);
}
function build() {
  renderer = new T.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  scene = new T.Scene();
  scene.environment = environment();
  camera = new T.PerspectiveCamera(33, 1, 0.1, 40);
  camera.position.set(0, 0.2, 8.6);
  scene.add(new T.HemisphereLight(0xc6d2df, 0x0d0d0e, 0.7));
  const key = new T.DirectionalLight(0xd5dbe4, 3);
  key.position.set(-4, 4, 5);
  scene.add(key);
  const rim = new T.DirectionalLight(0xffffff, 4.6);
  rim.position.set(4, 1, -3);
  scene.add(rim);
  sculpture = new T.Group();
  scene.add(sculpture);
  makeBottle();
  document.body.classList.add("webgl");
  control = createRenderControl({
    renderer,
    canvas,
    story,
    maxDpr: 1.5,
    desktopBudget: 3000000,
    mobileBudget: 1200000,
    onResize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    paint,
  });
}
function paint() {
  const mobile = innerWidth < 701;
  const reveal = ease(progress / 0.7),
    burst = reduced.matches
      ? 0
      : Math.sin(ease((progress - 0.45) / 1.8) * Math.PI);
  const y = mobile ? -0.75 : -0.38,
    scale = mobile ? 0.83 : 1.28;
  sculpture.position.set(0, y, 0);
  sculpture.scale.setScalar(scale);
  sculpture.rotation.set(
    0.025,
    reduced.matches ? -0.18 : -0.24 + progress * 0.2 + px * 0.13,
    0,
  );
  facetMaterial.color.set(
    activeStage === "opening"
      ? 0xc4c6c8
      : activeStage === "heart"
        ? 0xc9c3cb
        : 0xc9c2b6,
  );
  for (let i = 0; i < faceData.length; i++) {
    const f = faceData[i],
      distance = burst * (0.7 + (i % 4) * 0.16);
    dummy.position.copy(f.centre).addScaledVector(f.direction, distance);
    dummy.position.y += Math.sin(f.phase) * burst * 0.15;
    dummy.rotation.set(
      Math.sin(f.phase) * burst * 0.3,
      Math.cos(f.phase) * burst * 0.35,
      Math.sin(f.phase * 1.3) * burst * 0.2,
    );
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    dummy.matrix.multiply(f.matrix);
    facets.setMatrixAt(i, dummy.matrix);
  }
  facets.instanceMatrix.needsUpdate = true;
  cap.position.y = 1.48 + burst * 0.8;
  cap.rotation.y = burst * 0.5;
  plaque.visible = burst < 0.27;
  outline.visible = burst < 0.07;
  const intensity = reduced.matches ? 0.15 : 1 - reveal;
  stage.style.setProperty("--veil", String(intensity * 0.25));
  stage.style.setProperty("--slit", `${2 + reveal * (mobile ? 110 : 300)}px`);
  stage.style.setProperty("--slit-opacity", String(0.5 - reveal * 0.31));
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
function scroll() {
  progress =
    clamp(
      -story.getBoundingClientRect().top / (story.offsetHeight - innerHeight),
    ) * 3;
  document.querySelector("#progress-line").style.width =
    `${(progress / 3) * 100}%`;
  document.querySelector("#chapter-number").textContent =
    `${["I", "II", "III", "IV"][Math.min(3, Math.floor(progress))]} / IV`;
  control?.invalidate();
}
addEventListener("scroll", scroll, { passive: true });
addEventListener(
  "pointermove",
  (e) => {
    if (reduced.matches) return;
    px = e.clientX / innerWidth - 0.5;
    control?.invalidate();
  },
  { passive: true },
);
reduced.addEventListener("change", () => control?.invalidate());
canvas.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  control?.dispose();
  canvas.hidden = true;
  document.body.classList.remove("webgl");
  document.documentElement.dataset.renderMode = "fallback";
});
Promise.all([
  document.fonts.load("100px Bodoni"),
  document.fonts.load("25px DM"),
])
  .catch(() => {})
  .then(() => {
    try {
      build();
      scroll();
    } catch (e) {
      canvas.hidden = true;
      document.body.classList.remove("webgl");
      document.documentElement.dataset.renderMode = "fallback";
      console.warn("Using the static perfume illustration.", e.message);
    }
  });
