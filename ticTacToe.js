const config = require("./config");
const uuid = require("uuid");

const couch = require("nano")({ url: config.couchDB.url, parseUrl: false });
const couchDB = couch.use("docs");

const login = async (nickname) => {
    const token = uuid.v4();

    try {
        await couch.insert({
            _id: token,
            nickname,
        });
    } catch {
        throw new Error("Error! Please, try again!");
    }

    return token;
};

const createGame = async (token) => {
    const gameId = uuid.v4();

    try {
        await couch.insert({
            _id: gameId,
            players: [{ sign: "X", token }],
            status: "ready",
            board: "---------",
        });
    } catch {
        throw new Error("Error! Please, try again!");
    }

    return gameId;
};

const getGames = () => {
    const games = [];
    couchDB.list().then((body) => {
        body.rows.forEach((doc) => {
            games.push({ game_id: doc._id, status: doc.status });
        });
        return games;
    });
};

const joinGame = async (token, gameId) => {
    let game;
    try {
        game = await couchDB.get(gameId);
    } catch {
        throw new Error("Game not found!");
    }
    if (game.status === "active") throw new Error("Game is already active");
    if (game.players.length === 2) throw new Error("Game session is full");

    game.players.push({ sign: "O", token });
    try {
        await couchDB.insert(game);
    } catch {
        throw new Error("Error! Please, try again!");
    }
    return "Joined successfully!";
};

const startGame = async (token, gameId) => {
    let game;
    try {
        game = await couchDB.get(gameId);
    } catch {
        throw new Error("Game not found!");
    }
    if (game.status === "active") throw new Error("Game is already active");
    if (game.players.length !== 2) throw new Error("You can't start without second player");
    if (game.players[0].token !== token) throw new Error("Only creator can start the game");

    game.status = "active";

    try {
        await couchDB.insert(game);
    } catch {
        throw new Error("Error! Please, try again!");
    }
};

const submitMove = async (token, gameId, cell) => {
    let game;
    try {
        game = await couchDB.get(gameId);
    } catch {
        throw new Error("Game not found!");
    }
    if (game.status !== "active") throw new Error("Game is not active");

    const freeCells = game.board.match(/-/g);

    if (!freeCells) throw new Error("Game is over");

    const playerIndex = game.players.map((player) => { return player.token; }).indexOf(token);

    if (playerIndex === -1) throw new Error("You are not a participant of this game");

    if (playerIndex + 1 % 2 !== freeCells.length % 2) throw new Error("It's not your turn now");

    if (game.board[cell - 1] !== '-') throw new Error("Cell is not free");

    game.board[cell - 1] = game.players[playerIndex].sign;
    try {
        await couchDB.insert(game);
    } catch {
        throw new Error("Error! Please, try again!");
    }
    return game.board;
};

module.exports = {
    login,
    createGame,
    getGames,
    joinGame,
    startGame,
    submitMove,
};
