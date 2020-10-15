const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


const ship = {
    "x": document.getElementById("canvas").offsetWidth / 2,
    "y": document.getElementById("canvas").offsetHeight / 2,
    "rot": 0,
    "velx": 0,
    "vely": 0,
    "shootx": 0,
    "shooty": 0
};



class Asteroid {
    constructor(x, y, rad, rot, velx, vely) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.rot = rot;
        this.velx = velx;
        this.vely = vely;
    }
}

const asteroid1 = new Asteroid(50, 50, 50, 2, 4);

const pointer = [0, 0];

function pointerPos(e) {
    pointer[0] = e.clientX;
    pointer[1] = e.clientY;
    document.getElementById("accelerate").innerHTML = pointer;
}


function acceleration() {
    ship.accX += Math.cos(rot) / 100;
    ship.accY += Math.sin(rot) / 100;
}

function rotation() {
    let [x, y] = [...pointer];
    
    if (Math.floor(ship.x) == Math.floor(x)) {
        ship.rot = (ship.y + 10) <= y ? Math.PI / 2 : (3 * Math.PI) / 2;
        document.getElementById("test").innerHTML = "true";
    } else {
        ship.rot = Math.atan((y - ship.y) / (x - ship.x));
        ship.rot += ship.x > x ? Math.PI : 0;
        document.getElementById("test").innerHTML = "false";
    }
}

function accelerateShip(){
    ship.velx += Math.cos(ship.rot) / 10;
    ship.vely += Math.sin(ship.rot) / 10;
}

function trajectory(element){
    element.x = (element.x + element.velx + 600) % 600;
    element.y = (element.y + element.vely + 600) % 600;
}

function drawCanvas() {
    ctx.clearRect(0, 0, 600, 600)
    rotation();
    trajectory(ship);
    ctx.beginPath();
    ctx.moveTo((ship.x + (15 * Math.cos(ship.rot))), ship.y + (15 * Math.sin(ship.rot)));
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (3 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (3 * Math.PI / 4))));
    ctx.lineTo(ship.x + (5 * Math.cos(ship.rot + Math.PI)), ship.y + (5 * Math.sin(ship.rot + Math.PI)));
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (5 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (5 * Math.PI / 4))))
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot)), ship.y + (15 * Math.sin(ship.rot)))
    ctx.fill();
}

setInterval(drawCanvas, 16.6);

let a;

document.getElementById("canvas").addEventListener("mousedown", () => {
    a = setInterval(accelerateShip, 16.6);
})
document.getElementById("canvas").addEventListener("mouseup", () => {
    clearInterval(a);
})
document.getElementById("canvas").addEventListener("pointermove", () => {
    pointerPos(event);
    document.getElementById("position").innerHTML = [ship.x, ship.y, ship.rot];
})

document.getElementById("canvas")
