var express = require('express');
var app = express();
var path = require('path');
var env = process.env.NODE_ENV;
var port = process.env.PORT || 3000;

console.log("env is => ", env);

if (env === 'dev') {
    app.use("/app", express.static(path.join(__dirname + '/../app/')));
    app.use("/bower_components", express.static(path.join(__dirname + '/../bower_components/')));
}

if (env === 'prod') {
    app.use(express.static(path.join(__dirname + '/../dist/')));
}

app.get('*', function (req, res) {
    if (env === 'dev') {
        res.sendFile(path.join(__dirname + '/../app/index.html'));
    }

    if (env === 'prod') {
        res.sendFile(path.join(__dirname + '/../dist/index.html'));
    }
});

app.listen(port, function () {
    console.log('listening on port', port);
});