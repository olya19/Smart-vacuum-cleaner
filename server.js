const express = require('express');
let bodyParser = require('body-parser')
let path = require('path');
let router = express.Router();
let fs = require('fs');

const app = express();


app.use(express.static('assets'));
app.use(express.static('db'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');
app.get('/', (req, res) => {
  console.log(req.url);
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
      case "empty": className = ''; break;
  }

  res.send({newDiv: getNewDiv(className)});
});

app.post('/registration', (req, res) => {

let newUser = {
  login: req.body.login,
  cleanerState: false,
  cleanerColor: ""
};

console.log(newUser);

let usersArray = readJSONFile('db/users.json');
console.log(usersArray);

let indexUser = -1;
let userFromDB = usersArray.find((element, index) => {
    if (element.login === newUser.login){
      indexUser = index;
      return true;
  }
  });

if(indexUser === -1){
  //add user to db
  usersArray.push(newUser);
  rewriteJSONFile(usersArray, 'db/users.json');
  res.send({user: newUser});
  //set properies
} else {
  console.log(usersArray[indexUser]);
  res.send({user:usersArray[indexUser]});
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

function readJSONFile(filePath){

  let dataFromFile = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(dataFromFile);

}

function rewriteJSONFile(object, filePath){
  fs.writeFile(filePath, JSON.stringify(object), (err) => {
    if (err) throw err;
    console.log('success save');
  });
}
