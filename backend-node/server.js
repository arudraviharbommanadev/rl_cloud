const express = require("express");
const app = express();
const routes = require("./routes/api");

app.use(express.json());
app.use("/api", routes);

app.listen(3000, () => console.log("Node running on 3000"));