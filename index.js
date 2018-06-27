const router = require('gcf-api-router')();

router.route('/kickerbox')
    .get(getKickerboxes);

router.route('/kickerbox/:id')
    .get(getKickerbox);

router.route('/result')
    .get(getResults)
    .post(postResult);

router.route('/result/:id')
    .get(getResult);

router.notFound(handleError);

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
    res.send('Endpoint not found');
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