const router = require('gcf-api-router')();
const mysql = require('mysql');
const config = require('./config')['production'];

router.route('/kickerbox').get(getKickerboxes);
router.route('/kickerbox/:id').get(getKickerbox);

router.route('/result').get(getResults).post(postResult);
router.route('/result/:id').get(getResult);

router.route('/test').get(testDb);

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
    {id: 1, name: 'UglyKickerbox', location: 'Elsewhere', model: 'R241'}
];

let mockedResults = [
    {id: 0, homeTeamScore: 2, visitorTeamScore: 0, reservationId: 42},
    {id: 0, homeTeamScore: 4, visitorTeamScore: 3, reservationId: 11},
    {id: 0, homeTeamScore: 1, visitorTeamScore: 4, reservationId: 0}
];

let notFoundMsg = {
    httpStatus: 404,
    errorCode: 'NotFound',
    stacktrace: '..'
};

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
    }
    res.status(404);
    res.send(notFoundMsg);
}

function getResults(req, res) {
    pool.query('select * from result;', (error, results) => {
        if (error) {
            console.log(error);
        }
        res.send(results);
    });
}

function testDb(req, res) {
    pool.query('SELECT NOW() AS now', (error, results, fields) => {
        res.send(results);
    });
}

function getResult(req, res) {
    pool.query(`select * from result where id=${req.params.id};`, (error, results) => {
        if (error) {
            console.log(error);
        }
        res.send(results);
    });
}

function postResult(req, res) {
    const homeTeamScore = JSON.parse(req.body).homeTeamScore;
    const visitorTeamScore = JSON.parse(req.body).visitorTeamScore;
    const reservationId = JSON.parse(req.body).reservationId;

    if (!isEmpty(homeTeamScore) && !isEmpty(visitorTeamScore) && !isEmpty(reservationId)) {
        const insertQuery = `INSERT INTO result(homeTeamScore, visitorTeamScore, reservationId) VALUES(${homeTeamScore},${visitorTeamScore},${reservationId})`;
        pool.query(insertQuery); //TODO: handle result with callback

        let result = {
            homeTeamScore: homeTeamScore,
            visitorTeamScore: visitorTeamScore,
            reservationId: reservationId
        };

        res.status(201);
        res.send(result);
    } else {
        res.status(400);
        res.send('400 - Bad Request');
    }
}

exports.entrypoint = function (req, res) {
    // Some request processing/verification/logging here
    router.onRequest(req, res);
};

function isEmpty(value) {
    return (value == null || value.length === 0);
}