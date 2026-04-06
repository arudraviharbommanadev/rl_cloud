const pythonService = require("../services/pythonService");

exports.decide = async (req, res) => {
    const result = await pythonService.decide(req.body);
    res.json(result);
};
