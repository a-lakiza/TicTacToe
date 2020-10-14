const ticTacToe = require("./ticTacToe");

const login = (req, res) => {
    ticTacToe
        .login(req.body.nickname)
        .then((token) => {
            res.status(201).send({ token });
        })
        .catch((error) => {
            res.status(500).send({
                error: error.message,
            });
        });
};

const createGame = (req, res) => {
    ticTacToe
        .createGame(req.body.token)
        .then((game_id) => {
            res.status(201).send({ game_id });
        })
        .catch((error) => {
            res.status(500).send({
                error: error.message,
            });
        });
};

const getGames = (req, res) => {
    ticTacToe
        .getGames()
        .then((games) => {
            res.status(200).send({ games });
        })
        .catch((error) => {
            res.status(500).send({
                error: error.message,
            });
        });
};

const joinGame = (req, res) => {
    ticTacToe
        .joinGame(req.body.token, req.params.id)
        .then((result) => {
            res.status(201).send({ result });
        })
        .catch((error) => {
            res.status(500).send({
                error: error.message,
            });
        });
};

const startGame = (req, res) => {
    ticTacToe
        .startGame(req.body.token, req.params.id)
        .then((result) => {
            res.status(201).send({ result });
        })
        .catch((error) => {
            res.status(500).send({
                error: error.message,
            });
        });
};

const submitMove = (req, res) => {
    ticTacToe
        .submitMove(req.body.token, req.params.id, req.body.cell)
        .then((board_status) => {
            res.status(200).send({ board_status });
        })
        .catch((error) => {
            res.status(500).send({
                error: error.message,
            });
        });
};

module.exports = {
    login,
    createGame,
    getGames,
    joinGame,
    startGame,
    submitMove,
};
