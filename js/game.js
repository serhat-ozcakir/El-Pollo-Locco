//Bu fonksiyon ne yapar
//Sayfa açıldığında (onload="init()") çalışır:
//Canvas elementini bulur
//2D çizim bağlamını (ctx) alır
//world içindeki karakteri konsola yazar
//Böylece oyun başlamış olur

let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard)
    //ctx = canvas.getContext("2d");
   // character.src = '../img/white.svg'

    console.log('My character is', world.character);
}

window.addEventListener("keydown", (e)=>{
    console.log(e.keyCode);
    if(e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
    console.log(e);
});
window.addEventListener("keyup", (e)=>{
    if(e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
   
});