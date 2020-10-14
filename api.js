const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const controller = require('./controller');

const api = express();

const checkReqBodyParams = (params) => {
    return (req, res, next) => {
        const missedParams = [];
        params.forEach((param) => {
            if (!req.body[param]) missedParams.push(param);
        });
        if (missedParams.length) {
            res.status(400).send(`Missed required params: ${missedParams.join(", ")}`);
        } else {
            next();
        }
    };
};

const start = (port) => {
    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({ extended: true }));
    api.use("/", router);

    router.post("/user/login", checkReqBodyParams(["nickname"]), controller.login);

    router.get("/games/", checkReqBodyParams(["token"]), controller.getGames);
    router.post("/games/",  controller.createGame);

    router.put("games/:id/join", checkReqBodyParams(["token"]), controller.joinGame);
    router.put("games/:id/start", checkReqBodyParams(["token"]), controller.startGame);

    router.put("games/:id/move", checkReqBodyParams(["token", "cell"]), controller.submitMove);

    api.listen(port, () => console.log(`API listening on port ${port}`));
};

module.exports = {
    start,
};
