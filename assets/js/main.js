window.addEventListener('load', () => {

  window.sessionStorage.setItem('userLogin', '');

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

    if (color !== 'empty'){
      fetch('/change-color', {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method : 'POST',
        body: JSON.stringify({colorName:color})
      }).then( (res) => {
        return res.json();
      }).then( (json) => {
        let div = createNode(json.newDiv);
        let contentDiv = document.getElementById('content');
        contentDiv.removeChild(document.getElementById('cleaner'));
        contentDiv.insertBefore(div, document.getElementById('menu'));

      });
    }

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
      <label for="">REGISTER NOW</label>
      <input type="text" placeholder="login" id="login">
      <input type="password" name="" value="" placeholder="password" id="password">
      <input type="button" value="reg" id="reg">
      <button class="cancel" id="cancel">[ Cancel ]</button>
    </form>
  </div>`;

  let modalForm = createNode(htmlStr);
  console.log(modalForm);
  let content = document.getElementById('content').appendChild(modalForm);

  let cancelButton = document.getElementById('cancel');
  cancelButton.addEventListener('click', () => {
    content.removeChild(modalForm);
  });

  let regButton = document.getElementById('reg');
  regButton.addEventListener('click', () => {
    let user = new User(document.getElementById('login').value, document.getElementById('password').value);
    console.log(user);

    fetch('/registration', {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      method : 'POST',
      redirect: 'follow',
      body: JSON.stringify(user)
    }).then( (res) => {
      console.log(res);
    });

  })

});

})
