var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var request = require('request');

app.use(bodyParser.json());

// verifying the tocken
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === '<your_secret_key>') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// sending back the message
var token = "<insert_your_access_token>";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


// send the token 
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text);
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});


app.listen(process.env.PORT || 3000)
