window.addEventListener('load', () => {

  class User{

    constructor(login, password){
      this._login = login;
      this._password = password;
      this._cleanerState = false;
      this._cleanerColor = "";
    }

      set login(l){ this._login = l; }
      set password(p){ this._password = p; }
      set cleanerState(cs){  this._cleanerState = cs; }
      set cleanerColor(cc){ this._cleanerColor = cc; }

      get login(){ return this._login; }
      get password(){ return this._password;  }
      get cleanerState(){ return this._cleanerState; }
      get cleanerColor(){ return this._cleanerColor; }

    }



  let buttonSave = document.getElementById('save');
  buttonSave.addEventListener('click', () => {

    let user = new User(window.sessionStorage.getItem('userLogin'),'');


  });


})
