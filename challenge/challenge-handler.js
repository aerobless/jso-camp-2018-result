const errorHandler = require("../error-handler");
const index = require("../index");

exports.getChallenges = function (req, res) {
    index.pool.query('select * from challenge;', (error, results) => {
        if (error) {
            errorHandler.sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
};

exports.getChallenge = function (req, res) {
    index.pool.query(`select * from challenge where id=${req.params.id};`, (error, results) => {
        if (error) {
            errorHandler.sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
};

exports.postChallenge = function (req, res) {
    const challengerId = JSON.parse(req.body).challengerId;
    const challengeeId = JSON.parse(req.body).challengeeId;
    const status = JSON.parse(req.body).status.toUpperCase();

    if (!isEmpty(challengerId) && !isEmpty(challengeeId) && !isEmpty(status)) {
        const insertQuery = `INSERT INTO challenge(challengerId, challengeeId, status, dateOfChallenge) VALUES(${challengerId},${challengeeId},'${status}', NOW());`;
        index.pool.query(insertQuery, (error, results) => {
            if (error) {
                errorHandler.sendResponseBadRequest(res, error);
            } else {
                let result = {
                    challengerId: challengerId,
                    challengeeId: challengeeId,
                    status: status
                };

                res.status(201);
                res.send(result);
            }
        });
    } else {
        errorHandler.sendResponseBadRequest(res, 'challengerId, challengeeId, status cant be empty');
    }
};

exports.putChallenge = function (req, res) {
    const status = JSON.parse(req.body).status.toUpperCase();

    if (!isEmpty(status)) {
        const updateQuery = `UPDATE challenge SET status='${status}' WHERE id=${req.params.id};`;
        index.pool.query(updateQuery, (error, results) => {
            if (error) {
                errorHandler.sendResponseBadRequest(res, error);
            } else {
                res.status(200);
                res.send(results);
            }
        });
    } else {
        errorHandler.sendResponseBadRequest(res, 'status cant be empty');
    }
};

function isEmpty(value) {
    return (value == null || value.length === 0);
}