require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



function isTimestamp(value) {
  return typeof value === 'string' && /^\d{13}$/.test(value);
}

function isDateString(value) {
  return typeof value === 'string' && !isNaN(Date.parse(value));
}

function checkDateType(value) {
  if (isTimestamp(value)) {
      return 'Timestamp';
  } else if (isDateString(value)) {
      return 'Regular Date';
  }else if(value == undefined){
    return 'Empty String';
  } else {
      return 'Invalid Date';
  }
}


// your first API endpoint... 
app.get("/api/:date?", function (req, res) {
  const date = req.params.date;
  let input;

  if (checkDateType(date) == 'Regular Date'){
    input = new Date(date);
    res.json({
      unix: input.getTime(),
      utc: input.toUTCString()
    })
  }else if (checkDateType(date) == 'Timestamp'){
    input = new Date(Number(date));
    res.json({
      unix: Number(date),
      utc: input.toUTCString() 
    })

  }else if(checkDateType(date) == 'Empty String'){
    res.json({
      unix:  Date.now(),
      utc: new Date(Date.now()).toUTCString()
    })

  }else{
    res.json({error:'Invalid Date'})

  }

  


});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env['PORT'] || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
