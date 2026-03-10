function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function toggleDark(){ 
  document.body.classList.toggle("dark"); 
}

let vipBackgroundActive=false;
let vip={es:false,fr:false};

// Función toast para mensajes flotantes
function showToast(msg){
  const container=document.getElementById("toastContainer");
  const toast=document.createElement("div");
  toast.className="toast";
  toast.innerText=msg;
  container.appendChild(toast);
  setTimeout(()=>container.removeChild(toast),3000);
}

function toggleVIPBackground(){
  if(vip.es || vip.fr){
    document.body.classList.toggle("vipBackground");
  } else{
    vipBackgroundActive=!vipBackgroundActive;
    if(vipBackgroundActive){
      document.body.classList.add("vipBackgroundSimulated");
    } else{
      document.body.classList.remove("vipBackgroundSimulated");
    }
    // Mensaje en inglés sin bloquear la página
    showToast("👀 VIP Background preview! Redeem the code to unlock real VIP features.");
  }
}

const subreddits={ es:["memesES","memesenespanol"], fr:["memesFR","memesfr"] };
const memeCache={es:new Set(),fr:new Set()};
let likes=JSON.parse(localStorage.getItem("likes"))||{};
let favs=JSON.parse(localStorage.getItem("favs"))||{};

function addFav(url,lang){
  if(!favs[lang]) favs[lang]=[];
  if(!favs[lang].includes(url)) favs[lang].push(url);
  localStorage.setItem("favs",JSON.stringify(favs));
  showToast("⭐ Meme guardado en favoritos!");
}

async function loadMemes(lang,count=8){
  const container=document.getElementById(lang==="es"?"memesES":"memesFR");
  const memesPerLoad=vip[lang]?count*2:count;

  for(let i=0;i<memesPerLoad;i++){
    let memeData,attempts=0;
    do{
      const sub=subreddits[lang][Math.floor(Math.random()*subreddits[lang].length)];
      const res=await fetch(`https://meme-api.com/gimme/${sub}`);
      memeData=await res.json();
      attempts++;
    }while(memeCache[lang].has(memeData.url)&&attempts<10);

    if(memeCache[lang].has(memeData.url)) continue;
    memeCache[lang].add(memeData.url);

    const card=document.createElement("div");
    card.className="memeCard";
    if(vip[lang]) card.classList.add("vip");

    const memeId=memeData.postLink;
    card.innerHTML=`
      <img src="${memeData.url}">
      <div class="memeButtons">
        <button class="like">${likes[memeId]?"❤️ Liked":"❤️ Like"}</button>
        <a href="${memeData.url}" target="_blank"><button>⬇ Descargar</button></a>
        <button onclick="addFav('${memeData.url}','${lang}')">⭐ Favorito</button>
      </div>
    `;
    card.querySelector(".like").onclick=function(){
      this.innerText="❤️ Liked";
      likes[memeId]=true;
      localStorage.setItem("likes",JSON.stringify(likes));
    };

    container.appendChild(card);
  }
}

function randomMemes(lang){
  const container=document.getElementById(lang==="es"?"memesES":"memesFR");
  container.innerHTML="";
  memeCache[lang]=new Set();
  loadMemes(lang,8);
}

let isLoading=false;
window.addEventListener("scroll",()=>{
  const esPage=document.getElementById("es");
  const frPage=document.getElementById("fr");
  const bottom=window.innerHeight+window.scrollY>=document.body.offsetHeight-150;

  if(bottom && !isLoading){
    isLoading=true;
    if(esPage.classList.contains("active")){
      loadMemes("es",4).then(()=>isLoading=false);
    } else if(frPage.classList.contains("active")){
      loadMemes("fr",4).then(()=>isLoading=false);
    } else isLoading=false;
  }
});

function redeemCode(lang){
  const codeInput=document.getElementById(lang==="es"?"codeES":"codeFR").value.trim();
  if(codeInput==="Memes0670"){
    vip[lang]=true; // temporal
    showToast("🎉 VIP mode activated for this session! More memes and animations unlocked.");
    randomMemes(lang);
  } else{
    showToast("❌ Código incorrecto");
  }
}

// Carga inicial
loadMemes("es",8);
loadMemes("fr",8);