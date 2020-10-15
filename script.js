const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


const ship = {
    "x": document.getElementById("canvas").offsetWidth / 2,
    "y": document.getElementById("canvas").offsetHeight / 2,
    "rot": 0,
    "velx": 0,
    "vely": 0,
    "shoot1x": -30,
    "shoot1y": -30,
    "shoot2x": -30,
    "shoot2y": -30,
    "shoot3x": -30,
    "shoot3y": -30,
    "j": 0,
    "k": 0,
    "l": 0
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
    document.getElementById("pointer").innerHTML = pointer;
}


function acceleration() {
    ship.accX += Math.cos(rot) / 100;
    ship.accY += Math.sin(rot) / 100;
}

function rotation() {
    let [x, y] = [...pointer];
    
    if (Math.floor(ship.x) == Math.floor(x)) {
        ship.rot = (ship.y + 10) <= y ? Math.PI / 2 : (3 * Math.PI) / 2;
    } else {
        ship.rot = Math.atan((y - ship.y) / (x - ship.x));
        ship.rot += ship.x > x ? Math.PI : 0;
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

let explosion = false;

function shoot(object, inc, shootx, shooty, tra, interval){
    object[inc]++;
    if (object[inc] < 100) {
        object[shootx] = (object[shootx] + (5 * Math.cos(tra)) + 600) % 600;
        object[shooty] = (object[shooty] + (5 * Math.sin(tra)) + 600) % 600; 
        document.getElementById("test").innerHTML = object[inc];
    } else if ((object[inc] >= 100) && (object[inc] <= 120)) {
        object[shootx] = object[shootx];
        object[shooty] = object[shooty];
        explosion = true;
        document.getElementById("test").innerHTML = object[inc];

    } else if (object[inc] > 120) {
        explosion = false;
        object[inc] = 0;
        object[shootx] = -30;
        object[shooty] = -30;
        clearInterval(interval);
    }
}

function explosionAnimation(c, x, y, i) {
    c.moveTo(x, y);
    if (explosion == false) {
        c.arc(x, y, 5 + i / 100 , 0, 2 * Math.PI,);
    } else {
        c.moveTo(x, y)
        c.lineTo(x + (5 + i / 100) * Math.cos(Math.PI / 4), y + (5 + i / 100) * Math.sin(Math.PI / 4));
        c.moveTo(x, y);
        c.lineTo(x + (5 + i / 100) * Math.cos(Math.PI / 2), y + (5 + i / 100) * Math.sin(Math.PI / 2));
        c.moveTo(x, y);
        c.lineTo(x + (5 + i / 100) * Math.cos(3 * Math.PI / 4), y + (5 + i / 100) * Math.sin(3 * Math.PI / 4));
        c.moveTo(x, y);
        c.lineTo(x + (5 + i / 100) * Math.cos(5 * Math.PI / 4), y + (5 + i / 100) * Math.sin(5 * Math.PI / 4));
        c.moveTo(x, y);
        c.lineTo(x + (5 + i / 100) * Math.cos(3 * Math.PI / 2), y + (5 + i / 100) * Math.sin(3 * Math.PI / 2));
        c.moveTo(x, y);
        c.lineTo(x + (5 + i / 100) * Math.cos(5 * Math.PI / 4), y + (5 + i / 100) * Math.sin(5 * Math.PI / 4));
    
    }
}

function drawCanvas() {
    document.getElementById("position").innerHTML = [~~ship.x, ~~ship.y, ship.rot, ~~ship.shootx, ~~ship.shooty];
    ctx.clearRect(0, 0, 600, 600)
    rotation();
    trajectory(ship);
    ctx.beginPath();
    ctx.moveTo((ship.x + (15 * Math.cos(ship.rot))), ship.y + (15 * Math.sin(ship.rot)));
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (3 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (3 * Math.PI / 4))));
    ctx.lineTo(ship.x + (5 * Math.cos(ship.rot + Math.PI)), ship.y + (5 * Math.sin(ship.rot + Math.PI)));
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (5 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (5 * Math.PI / 4))));
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot)), ship.y + (15 * Math.sin(ship.rot)));
    explosionAnimation(ctx, ship.shoot1x, ship.shoot1y, ship.j);
    explosionAnimation(ctx, ship.shoot2x, ship.shoot2y, ship.k);
    explosionAnimation(ctx, ship.shoot3x, ship.shoot3y, ship.l);
    ctx.fill();
    ctx.stroke();
}


setInterval(drawCanvas, 16.6);

let a;

document.getElementById("canvas").addEventListener("mousedown", () => {
    a = setInterval(accelerateShip, 16.6);

    shootRot = ship.rot;
    
    if (ship.shoot1x == -30) {
        ship.shoot1x = ship.x;
        ship.shoot1y = ship.y;
        let shootRot1 = ship.rot;
        let b = setInterval(function(){shoot(ship, "j", "shoot1x", "shoot1y", shootRot1, b)}, 16.6);
    } else if (ship.shoot2x == -30) {
        let shootRot2 = ship.rot;
        ship.shoot2x = ship.x;
        ship.shoot2y = ship.y;
        let c = setInterval(function(){shoot(ship, "k", "shoot2x", "shoot2y", shootRot2, c)}, 16.6);
    } else if (ship.shoot3x == -30){
        let shootRot3 = ship.rot;
        ship.shoot3x = ship.x;
        ship.shoot3y = ship.y;
        let d = setInterval(function(){shoot(ship, "l", "shoot3x", "shoot3y", shootRot3, d)}, 16.6);
    }
})
document.getElementById("canvas").addEventListener("mouseup", () => {
    clearInterval(a);
    document.getElementById("test").innerHTML = "false";
})
document.getElementById("canvas").addEventListener("pointermove", () => {
    pointerPos(event);

})

document.getElementById("canvas")
