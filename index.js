var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var rk = require('./sources/runkeeper/app.js');
rk.set('views', __dirname + '/sources/runkeeper/views');
app.use('/sources/runkeeper', rk);


app.listen(5000);

console.log('files: localhost:5000');
