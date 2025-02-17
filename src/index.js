const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Hello from backend!" });
});

app.listen(3001, () => console.log("Server running on port 3001"));
