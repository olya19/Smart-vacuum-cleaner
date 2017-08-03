const express = require('express');
let bodyParser = require('body-parser')
let path = require('path');
let router = express.Router();
let url = require('url');
let fs = require('fs');

const app = express();


app.use(express.static('assets'));
app.use(express.static('db'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');
app.get('/', (req, res) => {
  console.log(`${req.method} ${res.statusCode} ${req.url}`); ///added method & StatusCode
   res.render('index', {className: "ddd"});
});

app.get('/assets/*', (req, res) => {
   res.sendFile(path.join(__dirname + req.path));
});

app.post('/change-color', (req, res) => {
  console.log(req.body.colorName);
  let color = req.body.colorName.toString();
  let className;

  switch (color) {
      case "red": className = 'red-cleaner'; break;
      case "blue": className = 'blue-cleaner'; break;
      case "green": className = 'green-cleaner'; break;
      case "pink": className = 'pink-cleaner'; break;
      case "purple": className = 'purple-cleaner'; break;
      case "gold": className = 'gold-cleaner'; break;
      case "turquoise": className = 'turquoise-cleaner'; break;
  }

  res.send({newDiv: getNewDiv(className)});
});

app.post('/registration', (req, res) => {

let newUser = {
  login: req.body._login,
  password: req.body._password,
  cleanerState: req.body._cleanerState,
  cleanerColor: req.body._cleanerColor
}

console.log(newUser);

let obj;
fs.readFile('db/users.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  console.log(obj);
});
let isUserExist = false;
for (let i = 0; i < obj.length; i++){
  if (obj[i].login === newUser.login) {
    isUserExist = true;
  }
}

if(isUserExist){
  //change state
} else {
	fs.appendFile('db/users.json', obj.push(JSON.stringify(newUser)), function (err) {
  if (err) throw err;
  console.log('New user was added!'); //add user to db
});
  
}

});

const server = app.listen(8080, () => {
   const host = server.address().address
   const port = server.address().port
   console.log(`host ${host}, port ${port}`);
});

function getNewDiv(className){
  return   `<div class="cleaner ${className}" id="cleaner"></div>`;
}
