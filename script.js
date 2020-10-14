

const ship = {
    "x": document.getElementById("canvas").offsetWidth / 2,
    "y": document.getElementById("canvas").offsetHeight / 2,
    "accX": 0,
    "accY": 0,
    "rot": 0
}

function pointerPos(e) {
    let xPointer = e.clientX;
    let yPointer = e.clientY;
    document.getElementById("accelerate").innerHTML = [xPointer, yPointer];
    return [xPointer, yPointer];
}

function acceleration() {
    ship.accX += Math.cos(rot) / 10;
    ship.accY += Math.sin(rot) / 10;
}

function rotation() {
    let [x, y] = pointerPos(event);
    
    if (ship.x == x) {
        ship.rot = ship.y >= y ? Math.Pi / 2 : (3 * Math.Pi) / 2;
    } else {
        ship.rot = Math.atan((y - ship.y) / (x - ship.x));
        ship.rot += ship.x > x ? Math.PI : 0;
    }
}

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

document.getElementById("canvas").addEventListener("pointerover", () => {
    document.getElementById("acceleration").innerHTML = true;
})
document.getElementById("canvas").addEventListener("pointerleave", () => {
    document.getElementById("acceleration").innerHTML = false;
})
document.getElementById("canvas").addEventListener("pointermove", () => {
    pointerPos(event);
    document.getElementById("position").innerHTML = [ship.x, ship.y, ship.rot];
    rotation();
    ctx.clearRect(0, 0, 600, 600)
    ctx.beginPath();
    ctx.moveTo(ship.x + (15 * Math.cos(ship.rot)), ship.y + (15 * Math.sin(ship.rot)));
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (3 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (3 * Math.PI / 4))));
    ctx.lineTo(ship.x + (5 * Math.cos(ship.rot + Math.PI)), ship.y + (5 * Math.sin(ship.rot + Math.PI)));
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot + (5 * Math.PI / 4))), ship.y + (15 * Math.sin(ship.rot + (5 * Math.PI / 4))))
    ctx.lineTo(ship.x + (15 * Math.cos(ship.rot)), ship.y + (15 * Math.sin(ship.rot)))
    ctx.fill();
})
