window.addEventListener('load', () => {

  let greetingId = getEl('menu').firstChild.id;
  if (greetingId !== 'undefined'){
    //console.log(document.getElementById('menu').firstChild.id);
    showHideGreeting('block', greetingId);
    fetch('/setUserProperties', {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      method : 'POST',
      body: JSON.stringify({login:greetingId})
    }).then( (res) => {
      return res.json();
    }).then( (json) => {
      //rewriteDiv(json.newDiv);
      let colors = document.getElementById('colors');
      console.log(colors);
      for (var i = 0; i < colors.length; i++){
        if (colors[i].value === json.color) {
          colors[i].selected = true;
        }
      }
      getEl('cleaner').className += ` ${json.color === 'empty'? '' : json.color+'-cleaner'}`;
      showHideLoginRegister('none');
    });
  }


  class User{

    constructor(login, password){
      this._login = login;
      this._password = password;
      this._cleanerState = false;
      this._cleanerColor = "";
    }

      set login(l) { this._login = l;   }
      set password(p){ this._password = p;   }
      set cleanerState(cs){ this._cleanerState = cs;   }
      set cleanerColor(cc){ this._cleanerColor = cc;   }

      get login(){  return this._login;    }
      get password(){ return this._password; }
      get cleanerState(){ return this._cleanerState; }
      get cleanerColor(){ return this._cleanerColor; }

    }


    var colors = getEl('colors');
    colors.onchange = () => {
      let color;
      for (var i = 0; i < colors.length; i++){
        if (colors[i].selected) {
          color  = colors[i].value;
        }
      }

      fetch('/change-color', {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method : 'POST',
        body: JSON.stringify({colorName:color, login:getEl('menu').firstChild.id})
      }).then( (res) => {
        return res.json();
      }).then( (json) => {
        rewriteDiv(json.newDiv);
      });


  }
function createNode(htmlStr) {

  let frag = document.createDocumentFragment(),
  temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  frag.appendChild(temp.firstChild);

  return frag;
}

let login = getEl("log-in");
let register = getEl("register");

register.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('register clicked');

  let htmlStr = `<div class="modal-form">
    <form action="" class="form-reg">
      <label for="">LOG IN</label>
      <input type="text" placeholder="login" id="login">
      <input type="button" value="Log in" id="btnLogIn">
      <button class="cancel" id="cancel">[ Cancel ]</button>
    </form>
  </div>`;

  let modalForm = createNode(htmlStr);
  console.log(modalForm);
  let content = getEl('content').appendChild(modalForm);

  let cancelButton = getEl('cancel');
  cancelButton.addEventListener('click', () => {
    removeLastChildFromDOM('content');
  });

  let logInButton = getEl('btnLogIn');
  logInButton.addEventListener('click', () => {
    let user = {login: getEl('login').value};
    getEl('addRoom').style.display = 'block';

    console.log(user);

    fetch('/login', {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      method : 'POST',
      redirect: 'follow',
      body: JSON.stringify(user)
    }).then( (res) => {
      console.log(res);
      return res.json();
    }).then((json) => {
      removeLastChildFromDOM('content');
      showHideGreeting('block', json.user.login);
      getEl('menu').firstChild.id = json.user.login;
      showHideLoginRegister('none');

      let classNameString = getEl('cleaner').className;
      let classNameArray = classNameString.split(' ');
      if (classNameArray.length > 1) {
        classNameArray[1] = json.user.cleanerColor;
        getEl('cleaner').className = classNameArray.join(' ');
      } else {
        getEl('cleaner').className += ` ${json.user.cleanerColor}`;
    }

    });


  })

});

let logOutButton = getEl('logOut');
logOutButton.addEventListener('click', (event) =>{
  event.preventDefault();
  showHideGreeting('none');
  showHideLoginRegister('block');
  //document.getElementById('cleaner').className = 'cleaner';
  getEl('colors')[0].selected = true;
  getEl('cleaner').className = 'cleaner';
  getEl('menu').firstChild.id = '';
  getEl('addRoom').style.display = 'none';
});

function removeLastChildFromDOM(idDOMElement){
  getEl(idDOMElement).removeChild(getEl(idDOMElement).lastChild);
}

let newRoom = getEl('newRoom');    //
let addRoom = getEl('addRoom');
addRoom.addEventListener('click', () => {
	newRoom.style.visibility = 'visible';
	console.log('add new room');
});
let closeAddRoom = getEl('closeNew');
closeAddRoom.addEventListener('click', () => {
	newRoom.style.visibility = 'hidden';
});

let closeChanges = getEl('closeChanges');
closeChanges.addEventListener('click', () => {
  getEl('changeRoomForm').style.display = 'none';
});

function showHideGreeting(displayState, login){
  let greetingDiv = document.getElementsByClassName('greeting')[0];
  if (displayState !== 'none'){
    greetingDiv.firstChild.innerHTML = `Hello, ${login}`;
  }
  greetingDiv.style.display = displayState;
  showHideRooms(displayState);
}

function showHideRooms(displayState){
  getEl('rooms').style.display = displayState;
}

function showHideLoginRegister(displayState){
  let loginRegisterDiv = getEl('loginRegister');
  loginRegister.style.display = displayState;
}

function rewriteDiv(newDiv){
  let div = createNode(newDiv);
  let contentDiv = getEl('content');
  contentDiv.removeChild(getEl('cleaner'));
  contentDiv.insertBefore(div, getEl('menu'));
}

function getEl(id){
  return document.getElementById(id);
}

function getUserLogin(){
  return getEl('menu').firstChild.id;
}

let saveBtnRoom =  getEl('saveRoom');
saveBtnRoom.addEventListener('click', () => {
  let roomName = getEl('roomName').value;
  let roomSquare = getEl('roomSquare').value;
  let login = getUserLogin();
  if (roomName === '' || roomSquare ===''){
    alert('Please, enter name and square');
   return;
  }


  let newRoomObj = {
    'roomName': roomName,
    'roomSquare': roomSquare,
    'login': login
  };
  fetch('api/saveRoom', {
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    method : 'POST',
    body: JSON.stringify(newRoomObj)
  }).then((res) => {
    console.log(res);
    return res.json();
  }).then( (json) => {
    console.log(json);
    if(json.status === 'success') {
      newRoom.style.visibility = 'hidden';
      getEl('anyRoom').style.display = 'none';
    }
  });

function addNewRoom(roomName, roomSquare){
  let li = document.createElement('li');
  li.innerHTML = `${roomName}<br>Cleaning<input class="check" type="checkbox">
  Wet Cleaning<input class="check" type="checkbox">Ionization<input class="check"type="checkbox">`
  getEl('roomList').appendChild(li);
  let option = document.createElement('option');
  option.innerHTML = `${roomName}`;
  getEl('listOfRooms').appendChild(option);
}

addNewRoom(roomName, roomSquare);
let time = 0;
let checkbox = document.getElementsByClassName('check');
for (let i=0; i < checkbox.length; i++){
checkbox[i].onchange = () => {
  if (checkbox[i].checked === true) {
    time += roomSquare*5;
  }
  if (checkbox[i].checked === false) {
    time -= roomSquare*5;
  }
console.log(time);
}
}

})

getEl('changeRoom').onclick = () => {
  getEl('changeRoomForm').style.display = 'block';
}

getEl('deleteRoom').onclick = () => {

  let rooms = getEl('listOfRooms');
  rooms.onchange = () => {
    let room;
    for (let i = 0; i < rooms.length; i++){
      if (rooms[i].selected) {
        room = rooms[i].value;

      }
    }
};

  if (confirm('Do you really want to delete this room?')){
  alert('thanks');


}
}
})
