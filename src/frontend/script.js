const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const nameInput = document.getElementById("nameInput");
const addNameButton = document.getElementById("addName");
const clearNamesButton = document.getElementById("clearNames");

const API_URL = "http://localhost:3000/names";

let names = [];
let angle = 0;
let spinning = false;

// Načtení jmen ze serveru
async function fetchNames() {
    const response = await fetch(API_URL);
    names = await response.json();
    drawWheel();
}

// Přidání jména
addNameButton.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) return;
    
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });

    nameInput.value = "";
    fetchNames();
});

// Vymazání jmen
clearNamesButton.addEventListener("click", async () => {
    await fetch(API_URL, { method: "DELETE" });
    fetchNames();
});

// Nakreslení kola
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const total = names.length;
    if (total === 0) return;

    const angleStep = (2 * Math.PI) / total;

    for (let i = 0; i < total; i++) {
        const startAngle = i * angleStep;
        const endAngle = startAngle + angleStep;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff6600";
        ctx.fill();
        ctx.stroke();

        // Přidání textu
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = "right";
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(names[i], canvas.width / 2.5, 5);
        ctx.restore();
    }
}

// Roztočení kola
spinButton.addEventListener("click", () => {
    if (spinning || names.length === 0) return;
    
    let spinAngle = Math.random() * 2000 + 2000;
    let rotation = 0;

    spinning = true;

    const spinInterval = setInterval(() => {
        rotation += 20;
        if (rotation >= spinAngle) {
            clearInterval(spinInterval);
            spinning = false;

            let index = Math.floor(((rotation % 360) / 360) * names.length);
            alert(`Vybrané jméno: ${names[index]}`);
        }

        canvas.style.transform = `rotate(${rotation}deg)`;
    }, 20);
});

// Načtení jmen po načtení stránky
fetchNames();
