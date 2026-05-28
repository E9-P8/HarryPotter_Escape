const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/intro.html");
});

app.listen(PORT, () => {
  console.log(`Il Platano Picchiatore è attivo sulla porta ${PORT}`);
});
