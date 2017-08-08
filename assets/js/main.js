window.addEventListener('load', () => {
  showHideGreeting('none');

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
    document.getElementsByClassName('modal-form')[0].style.visibility = 'visible';


  });

  let logInButton = getEl('btnLogIn');
  logInButton.addEventListener('click', () => {
    let user = {login: getEl('login').value};
    getEl('addRoom').style.display = 'block';
    document.getElementsByClassName('modal-form')[0].style.visibility = 'hidden';
    loadRoomsToLists(user);
  })
  function loadRoomsToLists(user){
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
      console.log(json.user);
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

      let rooms = json.user.rooms;
      console.log(rooms);
      for (let i=0; i< rooms.length; i++){
        addNewRoom(rooms[i].roomName, rooms[i].roomSquare, rooms[i].clean, rooms[i].wetClean, rooms[i].ionization);
      }
    });
  }

  let cancelButton = getEl('cancel');
  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementsByClassName('modal-form')[0].style.visibility = 'hidden';
  });

  let logOutButton = getEl('logOut');
  logOutButton.addEventListener('click', (event) =>{
    event.preventDefault();
    showHideGreeting('none');
    showHideLoginRegister('block');
    getEl('colors')[0].selected = true;
    getEl('cleaner').className = 'cleaner';
    getEl('menu').firstChild.id = '';
    getEl('addRoom').style.display = 'none';
    clearRoomsList();
    getEl('changeRoomForm').style.display = 'none';
    document.getElementsByClassName('colors')[0].style.display = "none";
  });

  function removeLastChildFromDOM(idDOMElement){
    getEl(idDOMElement).removeChild(getEl(idDOMElement).lastChild);
  }

  let newRoom = getEl('newRoom');
  let addRoom = getEl('addRoom');
  addRoom.addEventListener('click', () => {
  	newRoom.style.visibility = 'visible';
  	console.log('add new room');
  });


  function showHideRooms(displayState){
    getEl('rooms').style.display = displayState;
    getEl('addRoom').style.display = displayState;
    getEl('changeRoom').style.display = displayState;
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

  addNewRoom(roomName, roomSquare);
});


  getEl('changeRoom').onclick = () => {
    //getEl('changeRoomForm').style.display = 'block';
    document.getElementsByClassName('change-room-form')[0].style.visibility = 'visible';
  }
/*************************************************** */
  getEl('deleteRoom').onclick = () => {
    let roomName = getRoomNameForChanges();
    if (confirm(`Do you really want to delete ${roomName}?`)){
        let userLogin = getUserLogin();
        console.log(roomName);
        fetch(`api/rooms/delete?login=${userLogin}&roomName=${roomName}`, {
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          method : 'DELETE',
          //body: JSON.stringify({login:userLogin, "roomName":roomName})
        }).then((res) => {
          console.log(res);
          return res.json();
        }).then((json)=>{
          console.log(json.rooms, 'response from server');
          clearRoomsList();

          for (let i=0; i< json.rooms.length; i++){
            addNewRoom(json.rooms[i].roomName, json.rooms[i].roomSquare, json.rooms[i].clean, json.rooms[i].wetClean, json.rooms[i].ionization);
          }
          getEl('changeRoomForm').style.display = 'none';
        }).catch(error => console.log('error:', error));;
    }
  }
  /********************************************************************************/
  getEl('saveRoomChanges').onclick = () => {
   let newRoomName = getEl('changeNameField').value;
   if (newRoomName !== ''){
    let roomName = getRoomNameForChanges();
    let userLogin = getUserLogin();
      console.log(`${roomName} becomes ${newRoomName}`);
    fetch(`api/rooms/edit?login=${userLogin}&roomName=${roomName}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method : 'PUT',
        body: JSON.stringify({"newRoomName":newRoomName})
      }).then((res) => {
      console.log(res);
        return res.json();
      }).then((json)=>{
         console.log(json.rooms, 'response from server');

        clearRoomsList();

         for (let i=0; i< json.rooms.length; i++){
            addNewRoom(json.rooms[i].roomName, json.rooms[i].roomSquare, json.rooms[i].clean, json.rooms[i].wetClean, json.rooms[i].ionization);
          }

        getEl('changeRoomForm').style.display = 'none';
        getEl('changeNameField').value = '';
       }).catch(error => console.log('error:', error));
    }
    else alert('You have not did any changes');
  }

  function addNewRoom(roomName, roomSquare,clean, wetClean, ionization){
    let li = document.createElement('li');
    li.innerHTML = `${roomName}<br>Cleaning<input class="check" type="checkbox"}>
    Wet Cleaning<input class="check" type="checkbox"}>
    Ionization<input class="check" type="checkbox"}>`
    getEl('roomList').appendChild(li);

    let option = document.createElement('option');
    option.innerHTML = `${roomName}`;
    getEl('listOfRooms').appendChild(option);

    let time = 0;
    let checkbox = document.getElementsByClassName('check');
    for (let i=0; i < checkbox.length; i++){
    checkbox[i].onchange = () => {
      console.log('hello');
      if (checkbox[i].checked === true) {
        time += roomSquare*10;
      }
      if (checkbox[i].checked === false) {
        time -= roomSquare*10;
      }
    console.log(time);
    }
    }
  }

  function showHideGreeting(displayState, login){
    let greetingDiv = document.getElementsByClassName('greeting')[0];
    console.log(greetingDiv);
    if (displayState !== 'none'){
      greetingDiv.firstChild.innerHTML = `Hello, ${login}`;
    }
    showHideElement(displayState, greetingDiv);
    showHideRooms(displayState);
  }


    function showHideElement(displayState, element){
      element.style.display = displayState;
    }


    function clearRoomsList(){

      let roomList = getEl('roomList');

      while(roomList.firstChild !== null){
        roomList.removeChild(roomList.firstChild);
      }

      let listOfRooms = getEl('listOfRooms');
       while(listOfRooms.firstChild !== null){
        listOfRooms.removeChild(listOfRooms.firstChild);
      }
      let option = document.createElement('option');
      option.value = 'empty';
      option.innerHTML = 'Choose the room';
      listOfRooms.appendChild(option);
    }

  function getRoomNameForChanges (){
    let rooms = getEl('listOfRooms');
    let roomName;
      for (let i = 0; i < rooms.length; i++){
        if (rooms[i].selected) {
          roomName = rooms[i].value;
      }
    }
    return roomName;
  }

  let closeButtons = document.getElementsByClassName('close-button');
  for (let i=0; i<closeButtons.length; i++){
    closeButtons[i].addEventListener('click',()=>{
      closeButtons[i].parentNode.parentNode.style.visibility = 'hidden';
    });
  }



})
