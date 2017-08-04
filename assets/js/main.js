window.addEventListener('load', () => {

  let greetingId = document.getElementById('menu').firstChild.id;
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
      document.getElementById('cleaner').className += ` ${json.color === 'empty'? '' : json.color+'-cleaner'}`;
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


    var colors = document.getElementById('colors');
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
        body: JSON.stringify({colorName:color, login:document.getElementById('menu').firstChild.id})
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

let login = document.getElementById("log-in");
let register = document.getElementById("register");

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
  let content = document.getElementById('content').appendChild(modalForm);

  let cancelButton = document.getElementById('cancel');
  cancelButton.addEventListener('click', () => {
    removeLastChildFromDOM('content');
  });

  let logInButton = document.getElementById('btnLogIn');
  logInButton.addEventListener('click', () => {
    let user = {login: document.getElementById('login').value};

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
      document.getElementById('menu').firstChild.id = json.user.login;
      showHideLoginRegister('none');

      let classNameString = document.getElementById('cleaner').className;
      let classNameArray = classNameString.split(' ');
      if (classNameArray.length > 1) {
        classNameArray[1] = json.user.cleanerColor;
        document.getElementById('cleaner').className = classNameArray.join(' ');
      } else {
        document.getElementById('cleaner').className += ` ${json.user.cleanerColor}`;
    }

    });


  })

});

let logOutButton = document.getElementById('logOut');
logOutButton.addEventListener('click', (event) =>{
  event.preventDefault();
  showHideGreeting('none');
  showHideLoginRegister('block');
  //document.getElementById('cleaner').className = 'cleaner';
  document.getElementById('colors')[0].selected = true;
  document.getElementById('cleaner').className = 'cleaner';
  document.getElementById('menu').firstChild.id = '';
});

function removeLastChildFromDOM(idDOMElement){
  document.getElementById(idDOMElement).removeChild(document.getElementById(idDOMElement).lastChild);
}


function showHideGreeting(displayState, login){
  let greetingDiv = document.getElementsByClassName('greeting')[0];
  if (displayState !== 'none'){
    greetingDiv.firstChild.innerHTML = `Hello, ${login}`;
  }
  greetingDiv.style.display = displayState;
}

function showHideLoginRegister(displayState){
  let loginRegisterDiv = document.getElementById('loginRegister');
  loginRegister.style.display = displayState;
}

function rewriteDiv(newDiv){
  let div = createNode(newDiv);
  let contentDiv = document.getElementById('content');
  contentDiv.removeChild(document.getElementById('cleaner'));
  contentDiv.insertBefore(div, document.getElementById('menu'));
}

})
