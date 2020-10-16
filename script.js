const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


const ship = {
    "x": document.getElementById("canvas").offsetWidth / 2,
    "y": document.getElementById("canvas").offsetHeight / 2,
    "rot": 0,
    "velx": 0,
    "vely": 0,
    "maxShoot": 3,
    "currentShoot": [undefined],
    "status": "alive",
    "range": 100,
};

class Shoot {
    constructor(x, y, rot) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.i = 0;
        this.explosion = false;
    }
}

class Asteroid {
    constructor(x, y, rad, rot, i, velx, vely) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.rot = rot;
        this.i = i;
        this.velx = velx;
        this.vely = vely;
    }
}


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

function newShoot() {
    ship.currentShoot.forEach((element, i) => {
        if (ship.currentShoot[i] == undefined){
            ship.currentShoot[i] = new Shoot (ship.x, ship.y, ship.rot);
            let int = setInterval(function(){shoot(int, i)}, 16.6);
            throw {};
            //throw is the only way I found to stop a forEach. It works, but it says in the concole that there's an error. I would like to find another way to stop the forEach.
        }
    })
}

function shoot(interval, i) {
    ship.currentShoot[i]["i"]++;
    if (ship.currentShoot[i]["i"] < ship.range) {
        ship.currentShoot[i]["x"] = (ship.currentShoot[i]["x"] + (5 * Math.cos(ship.currentShoot[i]["rot"])) + 600) % 600;
        ship.currentShoot[i]["y"] = (ship.currentShoot[i]["y"] + (5 * Math.sin(ship.currentShoot[i]["rot"])) + 600) % 600; 
        
    } else if ((ship.currentShoot[i]["i"] >= ship.range) && (ship.currentShoot[i]["i"] <= ship.range + 20)) {
        ship.currentShoot[i]["x"] = ship.currentShoot[i]["x"];
        ship.currentShoot[i]["y"] = ship.currentShoot[i]["y"];
        ship.currentShoot[i]["explosion"] = true;
        document.getElementById("test").innerHTML = ship.currentShoot[i]["i"];

    } else if (ship.currentShoot[i]["i"] > (ship.range + 20)) {
        ship.currentShoot[i]["explosion"] = false;
        ship.currentShoot[i]["i"] = 0;
        ship.currentShoot[i] = undefined;
        clearInterval(interval);
    }
}


function shootAnimation(shoot) {
    if (shoot != undefined){
        ctx.moveTo(shoot["x"], shoot["y"]);
        if (shoot["explosion"] == false) {
            ctx.arc(shoot["x"], shoot["y"], 5, 0, 2 * Math.PI,);
            ctx.fill();
        } else {
            ctx.moveTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * Math.cos(0), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * Math.sin(0));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * Math.cos(Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * Math.sin(Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * Math.cos(Math.PI / 2), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * Math.sin(Math.PI / 2));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * Math.cos(3 * Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * Math.sin(3 * Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * Math.cos(Math.PI), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * Math.sin(Math.PI));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * Math.cos(5 * Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * Math.sin(5 * Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * Math.cos(3 * Math.PI / 2), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * Math.sin(3 * Math.PI / 2));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * Math.cos(7 * Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * Math.sin(5 * Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * Math.cos(0), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * Math.sin(0));
            ctx.fill();
        }
    }
}

function drawShip() {
    if (ship.status == "alive"){
        ctx.moveTo((ship.x + (15 * Math.cos(ship.rot))), ship.y + (15 * Math.sin(ship.rot)));
        ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (3 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (3 * Math.PI / 4))));
        ctx.lineTo(ship.x + (5 * Math.cos(ship.rot + Math.PI)), ship.y + (5 * Math.sin(ship.rot + Math.PI)));
        ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (5 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (5 * Math.PI / 4))));
        ctx.lineTo(ship.x + (15 * Math.cos(ship.rot)), ship.y + (15 * Math.sin(ship.rot)));
    }
}

function frame() {
    document.getElementById("position").innerHTML = [~~ship.x, ~~ship.y, ship.rot];
    ctx.clearRect(0, 0, 600, 600)
    rotation();
    trajectory(ship);
    ctx.beginPath();
    drawShip();
    ship.currentShoot.forEach((element) => {
        shootAnimation(element);
    })
    ctx.fill();
    ctx.stroke();

}

setInterval(frame, 16.6);

let a;

document.getElementById("canvas").addEventListener("mousedown", () => {
    a = setInterval(accelerateShip, 16.6);
    newShoot();
})
document.addEventListener("mouseup", () => {
    clearInterval(a); 
    //sometimes, the ship keeps track of the pointer and keeps accelerating, even without clicking. It could be because an interval is not cleared. I should look into that.
    // => when : it happens when you click on the canvas, and release the click anywhere else.
    //if you do it multiple times, you can increase the speed at a funny rate.
    //removed the getElementById("canvas") from the addEventListener, it now works as intended. 
 
})
document.getElementById("canvas").addEventListener("pointermove", () => {
    pointerPos(event);
})

document.getElementById("button").addEventListener("click", () => {
    document.getElementById("button").innerHTML = ship.currentShoot[2]["y"]
})

document.getElementById("range").addEventListener("click", () => {
    ship.range = ship.range + 10;
})

document.getElementById("bullet").addEventListener("click", () => {
    ship.currentShoot.push(undefined);
})
