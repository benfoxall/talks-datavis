var static = require('node-static');
var express = require('express');
var app = express();

var file = new static.Server('.');

// THIS IS BAD, EXPOSES ALL SECRETS
app.use(express.static(__dirname));

var rk = require('./sources/runkeeper/app.js');
rk.set('views', __dirname + '/sources/runkeeper/views');
app.use('/sources/runkeeper', rk);


app.listen(5000);

console.log('files: localhost:5000');
