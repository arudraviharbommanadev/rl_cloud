const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.post("/decide", controller.decide);

module.exports = router;
