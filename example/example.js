var express = require('express');
var app = express();

app.get('/', function(request, response) {

});

var port = process.env.PORT || 5000;
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', port);
});