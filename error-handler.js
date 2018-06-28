exports.sendResponseBadRequest = function (res, error) {
    let badRequestMsg = {
        httpStatus: 400,
        errorCode: 'BadRequest',
        stacktrace: error
    };

    console.log(badRequestMsg);

    res.status(400);
    res.send(badRequestMsg);
};

exports.sendResponseNotFound = function (res, notFound) {
    let notFoundMsg = {
        httpStatus: 404,
        errorCode: 'NotFound',
        stacktrace: `Unable to find: ${notFound}`
    };

    console.log(notFoundMsg);

    res.status(404);
    res.send(notFoundMsg);
};