const router = require('gcf-api-router')();
const mysql = require('mysql');
const request = require('request');

const connectionName = 'jso-camp:europe-west1:kickerbox-cf';
const dbUser = 'kickboxer';
const dbPass = ''; //replace me
const dbName = 'kickerbox';

const test = getTest('test');


function getTest(name) {
    request('http://www.google.com', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        return body;
    });
}

router.route('/kickerbox').get(getKickerboxes);
router.route('/kickerbox/:id').get(getKickerbox);

router.route('/result').get(getResults).post(postResult);
router.route('/result/:id').get(getResult);

router.route('/test').get(testDb);

router.notFound(handleError);

const pool = mysql.createPool({
    connectionLimit: 1,
    socketPath: '/cloudsql/' + connectionName,
    user: dbUser,
    password: dbPass,
    database: dbName
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
    res.send(mockedResults);
}

function testDb(req, res) {

    res.send(test);

    /*request('http://metadata.google.internal/computeMetadata/v1/project/attributes/db-name" -H "Metadata-Flavor: Google', {json: true}, (err, res, body) => {
        if (err) {
            console.log(err);
            response = err;
        } else {
            console.log(body);
            response = body;
        }
    });*/

    pool.query('SELECT NOW() AS now', (error, results, fields) => {
        //callback(error, results);
        res.send(results);
        //res.send(results);
    });
}

function getResult(req, res) {
    let result = mockedResults[req.params.id];

    if (result) {
        res.status(200);
        res.send(result);
    }
    res.status(404);
    res.send('returns a specific result');
}

function postResult(req, res) {
    res.status(404);
    res.send('Not implemented yet');
}

exports.entrypoint = function (req, res) {
    // Some request processing/verification/logging here
    router.onRequest(req, res);
};