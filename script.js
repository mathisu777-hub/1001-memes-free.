function showPage(id){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active")
})

document.getElementById(id).classList.add("active")

}

function toggleDark(){
document.body.classList.toggle("dark")
}

let vip={es:false,fr:false}

function toggleVIPBackground(){

if(vip.es || vip.fr){

document.body.classList.toggle("vipBackground")

}else{

showToast("VIP Background preview! Redeem the code to unlock real VIP features.")

}

}

function showToast(msg){

const container=document.getElementById("toastContainer")

const toast=document.createElement("div")

toast.className="toast"
toast.innerText=msg

container.appendChild(toast)

setTimeout(()=>{
toast.remove()
},3000)

}

const subreddits={
es:["memesES","memesenespanol"],
fr:["memesFR","memesfr"]
}

async function loadMemes(lang,count=6){

const container=document.getElementById(
lang==="es"?"memesES":"memesFR"
)

for(let i=0;i<count;i++){

const sub=subreddits[lang][Math.floor(Math.random()*2)]

const res=await fetch(`https://meme-api.com/gimme/${sub}`)

const data=await res.json()

const card=document.createElement("div")

card.className="memeCard"

if(vip[lang]){
card.classList.add("vip")
}

card.innerHTML=`

<img src="${data.url}">

<div class="memeButtons">

<a href="${data.url}" target="_blank">
<button>⬇ Descargar</button>
</a>

<button onclick="likeMeme('${data.url}')">
❤️ Like
</button>

<button onclick="favMeme('${data.url}')">
⭐ Fav
</button>

</div>

`

container.appendChild(card)

}

}

function randomMemes(lang){

const container=document.getElementById(
lang==="es"?"memesES":"memesFR"
)

container.innerHTML=""

loadMemes(lang)

}

function redeemCode(lang){

const code=document.getElementById(
lang==="es"?"codeES":"codeFR"
).value.trim()

if(code==="Memes0670"){

vip[lang]=true

showToast("VIP activated for this session!")

randomMemes(lang)

}else{

showToast("Código incorrecto")

}

}

function likeMeme(url){

let likes=JSON.parse(localStorage.getItem("likes"))||[]

likes.push(url)

localStorage.setItem("likes",JSON.stringify(likes))

showToast("❤️ Liked")

}

function favMeme(url){

let favs=JSON.parse(localStorage.getItem("favs"))||[]

favs.push(url)

localStorage.setItem("favs",JSON.stringify(favs))

showToast("⭐ Saved")

}

loadMemes("es")
loadMemes("fr")
