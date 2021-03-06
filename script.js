const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


const ship = {
    "x": document.getElementById("canvas").offsetWidth / 2,
    "y": document.getElementById("canvas").offsetHeight / 2,
    "rot": 0,
    "acc": false,
    "velx": 0,
    "vely": 0,
    "maxShoot": 3,
    "currentShoot": [undefined],
    "range": 100,
    "bullet_size" : 5,
    "score" : 0,
    "points" : 0,
    "status": "alive",
};

class Shoot {
    constructor(x, y, rot) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.rad = ship.bullet_size;
        this.i = 0;
        this.explosion = false;
    }
}

function calcDist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

let currentLevel = 0; 

function levelUp() {
    document.getElementById("level").innerHTML = currentLevel;
    ship["score"] += 5 * currentLevel;
    ship["points"] += 5 * currentLevel;
    newAsteroid(0, 0, (2 ** currentLevel) * 10, Math.PI / 4, currentLevel);
    currentLevel++;
}

let currentAsteroid = [];

class Asteroid {
    constructor(x, y, rad, rot, n) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.rot = rot;
        this.n = n;
        this.velx = Math.cos(this.rot) * -(n - 6) / 3;
        this.vely = Math.sin(this.rot) * -(n - 6) / 3;
        //vel dependant of n
        this.destroyed = false;
    }
}

function newAsteroid(x, y, rad, rot, n) {
    let a = new Asteroid (x, y, rad, rot, n);
    currentAsteroid.push(a);
}

function drawAsteroid(asteroid) {
    ctx.moveTo(asteroid["x"], asteroid["y"]);
    ctx.arc(asteroid["x"], asteroid["y"], asteroid["rad"], 0, 2 * Math.PI,);  
    ctx.fill();
}

function destroyAsteroid(asteroid, j) {
    [...ship["currentShoot"]].forEach((shoot, i) => {
        if (shoot != undefined) {
            if (calcDist(asteroid["x"], asteroid["y"], shoot["x"], shoot["y"]) <= asteroid["rad"] + shoot["rad"]) {
                ship.currentShoot[i]["i"] = ship.range;
                currentAsteroid[j]["destroyed"] = true;
                ship["points"]++;
                ship["score"]++;
                if (asteroid["n"] != 0) {
                    newAsteroid(asteroid["x"] + asteroid["rad"] * Math.cos(shoot["rot"] + Math.PI / 2), asteroid["y"] + asteroid["rad"] * Math.sin(shoot["rot"] + Math.PI / 2), asteroid["rad"] / 2, shoot["rot"] + Math.PI / 2, asteroid["n"] - 1);
                    newAsteroid(asteroid["x"] + asteroid["rad"] * Math.cos(shoot["rot"] - Math.PI / 2), asteroid["y"] + asteroid["rad"] * Math.sin(shoot["rot"] - Math.PI / 2), asteroid["rad"] / 2, shoot["rot"] - Math.PI / 2, asteroid["n"] - 1);
                }
            }
        }
    })
}

function destroyShip(asteroid) {
    if (calcDist(asteroid["x"], asteroid["y"], ship["x"], ship["y"]) <= asteroid["rad"] + 10) {
        ship["status"] = 0;
    }
}

function destroyShipAnimation() {

    ctx.moveTo(ship["x"] + (ship["status"] / 2 ) * 15 / 5 * Math.cos(0), ship["y"] + (ship["status"] / 2 ) * 15 / 5 * Math.sin(0));
    ctx.lineTo(ship["x"] + ship["status"] * 15 / 5 * Math.cos(Math.PI / 4), ship["y"] + ship["status"] * 15 / 5 * Math.sin(Math.PI / 4));
    ctx.lineTo(ship["x"] + (ship["status"] / 2 ) * 15 / 5 * Math.cos(Math.PI / 2), ship["y"] + (ship["status"] / 2 ) * 15 / 5 * Math.sin(Math.PI / 2));
    ctx.lineTo(ship["x"] + ship["status"] * 15 / 5 * Math.cos(3 * Math.PI / 4), ship["y"] + ship["status"] * 15 / 5 * Math.sin(3 * Math.PI / 4));
    ctx.lineTo(ship["x"] + (ship["status"] / 2 ) * 15 / 5 * Math.cos(Math.PI), ship["y"] + (ship["status"] / 2 ) * 15 / 5 * Math.sin(Math.PI));
    ctx.lineTo(ship["x"] + ship["status"] * 15 / 5 * Math.cos(5 * Math.PI / 4), ship["y"] + ship["status"] * 15 / 5 * Math.sin(5 * Math.PI / 4));
    ctx.lineTo(ship["x"] + (ship["status"] / 2 ) * 15 / 5 * Math.cos(3 * Math.PI / 2), ship["y"] + (ship["status"] / 2 ) * 15 / 5 * Math.sin(3 * Math.PI / 2));
    ctx.lineTo(ship["x"] + ship["status"] * 15 / 5 * Math.cos(7 * Math.PI / 4), ship["y"] + ship["status"] * 15 / 5 * Math.sin(5 * Math.PI / 4));
    ctx.lineTo(ship["x"] + (ship["status"] / 2 ) * 15 / 5 * Math.cos(0), ship["y"] + (ship["status"] / 2 ) * 15 / 5 * Math.sin(0));
    ctx.fill();
}

const pointer = [0, 0];

function pointerPos(e) {
    pointer[0] = e.clientX;
    pointer[1] = e.clientY;
}

function rotation(x1, y1, x2, y2, element) {
    if (Math.floor(x1) == Math.floor(x2)) {
        element["rot"] = (y1 + 10) <= y2 ? Math.PI / 2 : (3 * Math.PI) / 2;
    } else {
        element["rot"] = Math.atan((y2 - y1) / (x2 - x1));
        element["rot"] += x1 > x2 ? Math.PI : 0;
    }
}

function accelerateShip() {
    if (ship.acc == true) {
    ship.velx += Math.cos(ship.rot) / 10;
    ship.vely += Math.sin(ship.rot) / 10;
    }
}

function trajectory(element) {
    element.x = (element.x + element.velx + 600) % 600;
    element.y = (element.y + element.vely + 600) % 600;
}

function newShoot() {
    ship.currentShoot.forEach((element, i) => {
        if (ship.currentShoot[i] == undefined){
            ship.currentShoot[i] = new Shoot (ship.x + 15 * Math.cos(ship.rot), ship.y + 15 * Math.sin(ship.rot), ship.rot);
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

    } else if (ship.currentShoot[i]["i"] > (ship.range + 20)) {
        ship.currentShoot[i] = undefined;
        clearInterval(interval);
    }
}


function shootAnimation(shoot) {
    if (shoot != undefined){
        ctx.moveTo(shoot["x"], shoot["y"]);
        if (shoot["explosion"] == false) {
            ctx.arc(shoot["x"], shoot["y"], shoot["rad"], 0, 2 * Math.PI,);
            ctx.fill();
        } else {
            ctx.moveTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.cos(0), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.sin(0));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.cos(Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.sin(Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.cos(Math.PI / 2), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.sin(Math.PI / 2));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.cos(3 * Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.sin(3 * Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.cos(Math.PI), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.sin(Math.PI));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.cos(5 * Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.sin(5 * Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.cos(3 * Math.PI / 2), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.sin(3 * Math.PI / 2));
            ctx.lineTo(shoot["x"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.cos(7 * Math.PI / 4), shoot["y"] + (shoot["i"] - ship.range) * shoot["rad"] / 5 * Math.sin(5 * Math.PI / 4));
            ctx.lineTo(shoot["x"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.cos(0), shoot["y"] + (shoot["i"] / 2 - ship.range / 2) * shoot["rad"] / 5 * Math.sin(0));
            ctx.fill();
        }
    }
}

function drawShip() {
    ctx.moveTo(ship.x + 15 * Math.cos(ship.rot), ship.y + 15 * Math.sin(ship.rot));
    ctx.lineTo(ship.x + 15 * Math.cos(ship.rot + (3 * Math.PI / 4)), ship.y + 15 * Math.sin(ship.rot + (3 * Math.PI / 4)));
    ctx.lineTo(ship.x + 5 * Math.cos(ship.rot + Math.PI), ship.y + 5 * Math.sin(ship.rot + Math.PI));
    ctx.lineTo(ship.x + 15 * Math.cos(ship.rot + (5 * Math.PI / 4)), ship.y + 15 * Math.sin(ship.rot + (5 * Math.PI / 4)));
    ctx.lineTo(ship.x + 15 * Math.cos(ship.rot), ship.y + 15 * Math.sin(ship.rot));
    ctx.fill();
}

function frame() {
    ctx.clearRect(0, 0, 600, 600)
    if (ship.status == "alive") {
        accelerateShip();
        trajectory(ship);
        rotation(ship["x"], ship["y"], pointer[0], pointer[1], ship);
        ctx.beginPath();
        drawShip();
        currentAsteroid.forEach((element, i) => {
            if (element["destroyed"] == false) {
                trajectory(element);
                drawAsteroid(element);
                destroyAsteroid(element, i);
                destroyShip(element);
            } else {
                currentAsteroid.splice(i, 1)
            }
        }) 
        ship.currentShoot.forEach((element) => {
            shootAnimation(element);
        })
    } else {
        if (ship["status"] < 800) {
            ship["status"]++;
        }
        destroyShipAnimation();
        document.getElementById("status").innerHTML = "Game over :(";
    }
    if (currentAsteroid.length == 0) {
        levelUp();
    }
    document.getElementById("points").innerHTML = ship.points;
    document.getElementById("score").innerHTML = ship.score;
    document.getElementById("highscore").innerHTML = localStorage.getItem("highscore");
    if (localStorage.getItem("highscore") == null || localStorage.getItem("highscore") < ship.score){
        localStorage.setItem("highscore", ship.score);
        document.getElementById("newrecord").innerHTML = "New Record !!!";
    }
}

setInterval(frame, 16.6);

document.getElementById("canvas").addEventListener("mousedown", () => {
    ship["acc"] = true;
    newShoot();
})

document.addEventListener("mouseup", () => {
    ship["acc"] = false;
})

document.getElementById("canvas").addEventListener("pointermove", () => {
    pointerPos(event);
})

document.getElementById("range").addEventListener("click", () => {
    if (ship.points >= 8) {
        ship["range"] += 10;
        ship["points"] -= 8;
    }
})

document.getElementById("size").addEventListener("click", () => {
    if (ship.points >= 16) {
        ship["bullet_size"]++;
        ship["points"] -= 16;
    }
})
document.getElementById("bullet").addEventListener("click", () => {
    if (ship.points >= 32) {
        ship.currentShoot.push(undefined);
        ship["points"] -= 32;
    }
})

