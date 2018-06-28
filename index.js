const router = require('gcf-api-router')();
const mysql = require('mysql');
const config = require('./config')['production'];
const kickerboxHandler = require('./kickerbox/kickerbox-handler');
const resultHandler = require('./result/result-handler');
const errorHandler = require("./error-handler");

router.route('/kickerbox').get(kickerboxHandler.getKickerboxes);
router.route('/kickerbox/:id').get(kickerboxHandler.getKickerbox);

router.route('/result').get(resultHandler.getResults).post(resultHandler.postResult);
router.route('/result/:id').get(resultHandler.getResult);

router.route('/challenge').get(getChallenges).post(postChallenge);
router.route('/challenge/:id').get(getChallenge).put(putChallenge);

router.notFound(handleError);

const pool = mysql.createPool({
    connectionLimit: 1,
    socketPath: '/cloudsql/' + config.database.connection,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
});

function handleError(req, res) {
    res.status(404);
    res.setHeader('content-type', 'text/html');
    res.send('<b>Usage:</b></br>\n' +
        '   GET  /api/kickerbox       returns all kickerboxes</br> \n' +
        '   GET  /api/kickerbox/:id   returns a specific kickerbox</br></br> \n' +
        '   GET  /api/result          returns all results</br> \n' +
        '   GET  /api/result/:id      returns a specific result</br> \n' +
        '   POST /api/result/         post a new result</br>');
}

function getChallenges(req, res) {
    pool.query('select * from challenge;', (error, results) => {
        if (error) {
            errorHandler.sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
}

function getChallenge(req, res) {
    pool.query(`select * from challenge where id=${req.params.id};`, (error, results) => {
        if (error) {
            errorHandler.sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
}

function postChallenge(req, res) {
    const challengerId = JSON.parse(req.body).challengerId;
    const challengeeId = JSON.parse(req.body).challengeeId;
    const status = JSON.parse(req.body).status.toUpperCase();

    if (!isEmpty(challengerId) && !isEmpty(challengeeId) && !isEmpty(status)) {
        const insertQuery = `INSERT INTO challenge(challengerId, challengeeId, status, dateOfChallenge) VALUES(${challengerId},${challengeeId},'${status}', NOW());`;
        pool.query(insertQuery, (error, results) => {
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
}

function putChallenge(req, res) {
    const status = JSON.parse(req.body).status.toUpperCase();

    if (!isEmpty(status)) {
        const updateQuery = `UPDATE challenge SET status='${status}' WHERE id=${req.params.id};`;
        pool.query(updateQuery, (error, results) => {
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
}

exports.entrypoint = function (req, res) {
    // Some request processing/verification/logging here
    console.log(req);
    router.onRequest(req, res);
};

function isEmpty(value) {
    return (value == null || value.length === 0);
}

exports.pool = pool;