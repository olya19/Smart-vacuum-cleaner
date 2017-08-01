window.addEventListener('load', () => {

  let btn = document.getElementById("send");
  btn.addEventListener('click', () => {
    console.log('button clicked');

    let colorName;
    var colors = document.getElementById('colors');
    for (var i = 0; i < colors.length; i++){
      if (colors[i].selected) {

          var color = colors[i].value;
          var bgColor = document.getElementById('bg');

          switch (color) {
              case "red": colorName = 'red-cleaner'; break;
              case "blue": colorName = 'blue-cleaner'; break;
              case "green": colorName = 'green-cleaner'; break;
          }
      }

    }
    console.log(colorName);

    fetch('/', {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      method : 'POST',
      body: JSON.stringify({className:colorName})
    }).then((res) => {
      return res.json();
    }).then( (json) => {
      var newColor = json.newColor;
      console.log(newColor);
      document.getElementById("cleaner").classList.add(newColor);
    } );

})
})
