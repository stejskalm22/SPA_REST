require('dotenv').config(); // Načte konfiguraci z .env souboru

const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000; // Použije PORT z .env nebo 3000 jako default
const DATA_FILE = "data.json";

app.use(cors());
app.use(express.json());

// Načtení jmen ze souboru
app.get("/names", (req, res) => {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
});

// Přidání nového jména
app.post("/names", (req, res) => {
    const name = req.body.name;
    if (!name) return res.status(400).json({ error: "Jméno je povinné" });

    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    data.push(name);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    res.json({ message: "Jméno přidáno", names: data });
});

// Vymazání jmen
app.delete("/names", (req, res) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    res.json({ message: "Seznam vymazán" });
});

app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
