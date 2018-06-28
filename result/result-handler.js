const errorHandler = require("../error-handler");
const index = require("../index");

exports.getResults = function (req, res) {
    index.pool.query('select * from result;', (error, results) => {
        if (error) {
            errorHandler.sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
};

exports.getResult = function (req, res) {
    index.pool.query(`select * from result where id=${req.params.id};`, (error, results) => {
        if (error) {
            errorHandler.sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
};

exports.postResult = function (req, res) {
    const homeTeamScore = JSON.parse(req.body).homeTeamScore;
    const visitorTeamScore = JSON.parse(req.body).visitorTeamScore;
    const reservationId = JSON.parse(req.body).reservationId;

    if (!isEmpty(homeTeamScore) && !isEmpty(visitorTeamScore) && !isEmpty(reservationId)) {
        const insertQuery = `INSERT INTO result(homeTeamScore, visitorTeamScore, reservationId) VALUES(${homeTeamScore},${visitorTeamScore},${reservationId})`;
        index.pool.query(insertQuery, (error, results) => {
            if (error) {
                errorHandler.sendResponseBadRequest(res, error);
            } else {
                let result = {
                    homeTeamScore: homeTeamScore,
                    visitorTeamScore: visitorTeamScore,
                    reservationId: reservationId
                };

                res.status(201);
                res.send(result);
            }
        });
    } else {
        errorHandler.sendResponseBadRequest(res, 'homeTeamScore, visitorTeamScore, reservationId cant be empty');
    }
};

function isEmpty(value) {
    return (value == null || value.length === 0);
}