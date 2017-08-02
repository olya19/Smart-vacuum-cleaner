let login = document.getElementById("log-in");
let register = document.getElementById("register");

login.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('login clicked');
});

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
    window.sessionStorage.setItem('userLogin', user.login);

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
      window.location.replace(res.url);
    });

  })
