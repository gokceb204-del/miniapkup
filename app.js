const tg = window.Telegram.WebApp;

let user = tg.initDataUnsafe.user;

let user_id = user.id;

fetch("/balance/" + user_id)
.then(r => r.json())
.then(data => {

document.getElementById("balance").innerText =
"Bakiyen: " + data.balance + "₺"

})

function buy(){

fetch("/buy",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
user_id:user_id
})
})

}
