const router = require('gcf-api-router')();
const mysql = require('mysql');
const config = require('./config')['production'];

const kickerboxHandler = require('./kickerbox/kickerbox-handler');
const resultHandler = require('./result/result-handler');
const challengeHandler = require('./challenge/challenge-handler');

router.route('/kickerbox')
    .get(kickerboxHandler.getKickerboxes);

router.route('/kickerbox/:id')
    .get(kickerboxHandler.getKickerbox);

router.route('/result')
    .get(resultHandler.getResults)
    .post(resultHandler.postResult);

router.route('/result/:id')
    .get(resultHandler.getResult);

router.route('/challenge')
    .get(challengeHandler.getChallenges)
    .post(challengeHandler.postChallenge);

router.route('/challenge/:id')
    .get(challengeHandler.getChallenge)
    .put(challengeHandler.putChallenge);

router.notFound(handleError);

exports.pool = mysql.createPool({
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

exports.entrypoint = function (req, res) {
    // Some request processing/verification/logging here
    console.log(req);
    router.onRequest(req, res);
};