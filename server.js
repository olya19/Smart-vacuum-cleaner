'use strict'
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

  console.log(`${req.method} ${res.statusCode} ${req.url}`); //added method & StatusCode
    res.render('index');

});

app.get('/assets/*', (req, res) => {

   res.sendFile(path.join(__dirname + req.path));
});

app.post('/change-color', (req, res) => {
  console.log(req.body.colorName);
  console.log(req.body.login);
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
      default : className = 'empty'; break;
  }

  fs.readFile('db/users.json', 'utf8', (err, data) => {
    let usersArray = JSON.parse(data);
    let indexUser = -1;
    usersArray.find((element, index) => {
        if (element.login === req.body.login){
          indexUser = index;
          return true;
      }
      })
      usersArray[indexUser].cleanerColor = className;
    rewriteJSONFile(usersArray, 'db/users.json');
    });



  res.send({newDiv: getNewDiv(className)});
});

app.post('/login', (req, res) => {

let newUser = {
  login: req.body.login,
  cleanerState: false,
  cleanerColor: "",
  rooms: []
};


//console.log(newUser);


fs.readFile('db/users.json', 'utf8', (err, data) => {
  let usersArray = JSON.parse(data);
  let indexUser = -1;
  let userFromDB = usersArray.find((element, index) => {
      if (element.login === newUser.login){
        indexUser = index;
        return true;
    }
    });

  if(indexUser === -1){
    usersArray.push(newUser);
    rewriteJSONFile(usersArray, 'db/users.json');
    res.send({user: newUser});
  } else {
    //console.log(usersArray[indexUser]);
    res.send({user:usersArray[indexUser]});
  }
})

});

app.post('/setUserProperties', (req, res) => {

  fs.readFile('db/users.json', 'utf8', (err, data) => {

    let usersArray = JSON.parse(data);
    let userFromDB = usersArray.find((element) => {
        if (element.login === req.body.login){
          return true;
      }
      });

      res.send({color: userFromDB.cleanerColor.split('-')[0] });

  });

});

app.post('/api/saveRoom', (req, res) => {
  fs.readFile('db/users.json', (err, data) =>{

    let usersArray = JSON.parse(data);

    let userId = -1;
    let userFromDB = usersArray.find((element, index) => {
        if (element.login === req.body.login){
          userId = index;
          return true;
      }
      });
      let room ={
        roomName: req.body.roomName,
        roomSquare: req.body.roomSquare,
        clean: false,
        wetClean: false,
        ionization: false
      };
      usersArray[userId].rooms.push(room);
      //console.log(usersArray[userId]);
      res.send({status:'success'});
      rewriteJSONFile(usersArray, 'db/users.json');
  });


});

app.delete('/api/rooms/delete', (req, res) => {

 fs.readFile('db/users.json', (err, data) => {
    let usersArray = JSON.parse(data);
    let userIndex = -1;
    usersArray.find((element, index) => {
        if (element.login === req.query.login){
          userIndex = index;
          return true;
      }
      });
      let roomIndex;
    usersArray[userIndex].rooms.find( (element, index) => {
      if (element.roomName === req.query.roomName){
        roomIndex = index;
        return true;
      }
    })
    usersArray[userIndex].rooms.splice(roomIndex, 1);

    rewriteJSONFile(usersArray, 'db/users.json');
    res.status(200).send(usersArray[userIndex]);

  });
});

app.put('/api/rooms/edit', (req, res) => {
  fs.readFile('db/users.json', (err, data) => {
    let usersArray = JSON.parse(data);
    let userIndex = -1;
    usersArray.find((element, index) => {
      if(element.login === req.query.login){
        userIndex = index;
        return true;
      }
    })

    let roomIndex;
    usersArray[userIndex].rooms.find((element, index) => {
      if (element.roomName === req.query.roomName){
        roomIndex = index;
        return true;
      }
    })
    usersArray[userIndex].rooms[roomIndex].roomName = req.body.newRoomName;
    rewriteJSONFile(usersArray, 'db/users.json');
    res.status(200).send(usersArray[userIndex]);
  })
});

app.put('/api/rooms/edit/cleanMod', (req, res) => {
  fs.readFile('db/users.json', (err, data) => {
    let usersArray = JSON.parse(data);
    let userIndex = -1;
    usersArray.find((element, index) => {
      if(element.login === req.query.login){
        //console.log(req.query.login);
        userIndex = index;
        return true;
      }
    })

    let roomIndex;
    usersArray[userIndex].rooms.find((element, index) => {
      if (element.roomName === req.query.roomName){
        //console.log(req.query.roomName);
        roomIndex = index;
        return true;
      }
    })
    console.log(roomIndex);
    let userRoom = usersArray[userIndex].rooms[roomIndex];
    userRoom[req.query.nameOfCleaningMod] = req.body.cleaningModState;
    console.log(userRoom);
    console.log(`login: ${req.query.login} roomName: ${req.query.roomName} nameOfCleaningMod: ${req.query.nameOfCleaningMod}`);
    usersArray[userIndex].rooms[roomIndex] = userRoom;


    rewriteJSONFile(usersArray, 'db/users.json', ()=>{
      res.send({room:usersArray[userIndex].rooms[roomIndex]});


    });

})
})
const server = app.listen(8080, () => {
   const host = server.address().address
   const port = server.address().port
   console.log(`host ${host}, port ${port}`);
});

function getNewDiv(className){
  return   `<div class="cleaner ${className ==='empty'? '' : className}" id="cleaner"></div>`;
}

function readJSONFile(filePath){

  let dataFromFile = fs.readFile(filePath, 'utf8');
  return JSON.parse(dataFromFile);

}

function rewriteJSONFile(object, filePath, callback){
  fs.writeFile(filePath, JSON.stringify(object), (err) => {
    if (err) throw err;
    console.log('success save');
    if (typeof callback !== 'undefined')
      callback();
  });
}
