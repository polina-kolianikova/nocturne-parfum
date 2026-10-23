import {createProductStory, mix, pose, smooth} from './product-story.js?v=415f1cf1e54d0d8d36609979c9945057f9a0c0aae5577fb35102793def4ae06c';
const form = document.querySelector("#scent-form");
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
let selection,activeStage="opening",control;
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

const story=document.querySelector('.story'),stage=document.querySelector('.stage'),bottle=stage.querySelector('.image-object');
const positions=[[.71,.53,0,1],[.72,.54,-6,1.12],[.73,.43,5,.64],[.70,.54,-3,.94]];
control=createProductStory({story,stage,progressBar:document.querySelector('#progress-line'),paint({progress,index,fraction,width,height,mobile,landscape,reduced,pointer,slot}){
 const a=positions[Math.min(index,3)],b=positions[Math.min(index+1,3)],base=mobile?Math.min(width*.71,height*.42):Math.min(width*.4,height*.57);
 bottle.style.width=`${base}px`;
 let x=mix(a[0],b[0],fraction)*width,y=mix(a[1],b[1],fraction)*height,scale=mix(a[3],b[3],fraction),opacity=1;
 if(mobile){x=width*.54;y=slot.center;scale=Math.min(1,slot.height/(base*1.5*.94));opacity=smooth((slot.height-110)/75);}
 if(landscape){x=width*.76;y=height*.54;scale=.84;}
 pose(bottle,x,y,reduced?0:mix(a[2],b[2],fraction)+pointer*2.5,scale,opacity);
 stage.style.setProperty('--slit',`${2+smooth(progress/.7)*Math.min(280,width*.3)}px`);
 stage.style.setProperty('--slit-opacity',String(.22-smooth(progress/.7)*.13));
 document.querySelector('#chapter-number').textContent=`${['I','II','III','IV'][Math.min(3,index)]} / IV`;
 stage.dataset.scent=activeStage;
}});
document.documentElement.dataset.renderMode='photographic';
