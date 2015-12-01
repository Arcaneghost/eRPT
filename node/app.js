var express = require('express');
var ldap = require('ldapjs');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  console.log('new method: GET');
  res.sendFile('LoginTester.html' , { root : __dirname});
});

app.post('/', function(req, res) {
  console.log('new method: POST');
  var username = req.body.username + "@gonzaga.edu";
  var password = req.body.password;
 
  var client = ldap.createClient({
     url: "ldap://dc-ad-gonzaga.gonzaga.edu"
  });
 
  client.bind(username, password, function(err) {
     client.unbind();
     if (err) {
		 res.status(500).send();
     } else {
		 res.send(username);
		 console.log(username + ' logged on');
     }
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
