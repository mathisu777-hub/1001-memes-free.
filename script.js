function showPage(id){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active")
})

document.getElementById(id).classList.add("active")

}

function toggleDark(){

document.body.classList.toggle("dark")

}

const subreddits={
es:["memesES","memesenespanol"],
fr:["memesFR","memesfr"]
}

async function loadMemes(lang){

const container=document.getElementById(
lang==="es"?"memesES":"memesFR"
)

for(let i=0;i<6;i++){

const sub=subreddits[lang][Math.floor(Math.random()*2)]

const res=await fetch(`https://meme-api.com/gimme/${sub}`)

const data=await res.json()

const card=document.createElement("div")

card.className="memeCard"

card.innerHTML=`

<img src="${data.url}">

<a href="${data.url}" target="_blank">

<button>⬇ Descargar</button>

</a>

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

loadMemes("es")
loadMemes("fr")
