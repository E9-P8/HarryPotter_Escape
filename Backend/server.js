const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({ messaggio: "Il Platano Picchiatore è attivo e pronto!" });
});

app.listen(PORT, () => {
  console.log(`Il Platano Picchiatore è attivo sulla porta ${PORT}`);
});
