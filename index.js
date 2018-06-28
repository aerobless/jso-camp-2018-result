const router = require('gcf-api-router')();
const mysql = require('mysql');
const config = require('./config')['production'];

router.route('/kickerbox').get(getKickerboxes);
router.route('/kickerbox/:id').get(getKickerbox);

router.route('/result').get(getResults).post(postResult);
router.route('/result/:id').get(getResult);

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

let kickerboxes = [
    {id: 0, name: 'PrettyKickerbox', location: 'Zühlke Tower', model: '1337-ABC'},
    {id: 1, name: 'UglyKickerbox', location: 'Elsewhere', model: 'R241'},
    {id: 2, name: 'AustriaKicker', location: 'Alpenhotel Montafon', model: 'R2-D2'}
];

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

function getKickerboxes(req, res) {
    res.send(kickerboxes);
}

function getKickerbox(req, res) {
    let kickerbox = kickerboxes[req.params.id];

    if (kickerbox) {
        res.status(200);
        res.send(kickerbox);
    } else {
        sendResponseNotFound(res, req.params.id);
    }
}

function getResults(req, res) {
    pool.query('select * from result;', (error, results) => {
        if (error) {
            sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
}

function getResult(req, res) {
    pool.query(`select * from result where id=${req.params.id};`, (error, results) => {
        if (error) {
            sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
}

function postResult(req, res) {
    const homeTeamScore = JSON.parse(req.body).homeTeamScore;
    const visitorTeamScore = JSON.parse(req.body).visitorTeamScore;
    const reservationId = JSON.parse(req.body).reservationId;

    if (!isEmpty(homeTeamScore) && !isEmpty(visitorTeamScore) && !isEmpty(reservationId)) {
        const insertQuery = `INSERT INTO result(homeTeamScore, visitorTeamScore, reservationId) VALUES(${homeTeamScore},${visitorTeamScore},${reservationId})`;
        pool.query(insertQuery, (error, results) => {
            if (error) {
                sendResponseBadRequest(res, error);
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
        sendResponseBadRequest(res, 'homeTeamScore, visitorTeamScore, reservationId cant be empty');
    }
}

function getChallenges(req, res) {
    pool.query('select * from challenge;', (error, results) => {
        if (error) {
            sendResponseBadRequest(res, error);
        } else {
            res.send(results);
        }
    });
}

function getChallenge(req, res) {
    pool.query(`select * from challenge where id=${req.params.id};`, (error, results) => {
        if (error) {
            sendResponseBadRequest(res, error);
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
                sendResponseBadRequest(res, error);
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
        sendResponseBadRequest(res, 'challengerId, challengeeId, status cant be empty');
    }
}

function putChallenge(req, res) {
    const status = JSON.parse(req.body).status.toUpperCase();

    if (!isEmpty(status)) {
        const updateQuery = `UPDATE challenge SET status='${status}' WHERE id=${req.params.id};`;
        pool.query(updateQuery, (error, results) => {
            if (error) {
                sendResponseBadRequest(res, error);
            } else {
                res.status(200);
                res.send(results);
            }
        });
    } else {
        sendResponseBadRequest(res, 'status cant be empty');
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

function sendResponseBadRequest(res, error) {
    let badRequestMsg = {
        httpStatus: 400,
        errorCode: 'BadRequest',
        stacktrace: error
    };

    console.log(badRequestMsg);

    res.status(400);
    res.send(badRequestMsg);
}

function sendResponseNotFound(res, notFound) {
    let notFoundMsg = {
        httpStatus: 404,
        errorCode: 'NotFound',
        stacktrace: `Unable to find: ${notFound}`
    };

    console.log(notFoundMsg);

    res.status(404);
    res.send(notFoundMsg);
}