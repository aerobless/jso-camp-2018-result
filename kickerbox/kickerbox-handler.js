const index = require("../index");

let kickerboxes = [
    {id: 0, name: 'PrettyKickerbox', location: 'Zühlke Tower', model: '1337-ABC'},
    {id: 1, name: 'UglyKickerbox', location: 'Elsewhere', model: 'R241'},
    {id: 2, name: 'AustriaKicker', location: 'Alpenhotel Montafon', model: 'R2-D2'}
];

exports.getKickerboxes = function (req, res) {
    res.send(kickerboxes);
};

exports.getKickerbox = function (req, res) {
    let kickerbox = kickerboxes[req.params.id];

    if (kickerbox) {
        res.status(200);
        res.send(kickerbox);
    } else {
        index.sendResponseNotFound(res, req.params.id);
    }
};
