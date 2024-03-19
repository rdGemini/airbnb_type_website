(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()



var map = L.map('map').setView([51.505, -0.09], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 13,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  navigator.geolocation.watchPosition(success,error);

let marker,circle;
  function success(pos) {
      let lat = coordinates[0];
      let lng = coordinates[1];
  
      // let accuracy = pos.coords.accuracy;
      if(marker){
        map.removeLayer(marker);
        map.removeLayer(circle);
      }
      marker = L.marker(coordinates).addTo(map);
      circle = L.circle({lat,lng},{radius:500}).addTo(map);
  
      map.fitBounds(circle.getBounds());
      var popup = L.popup()
      .setLatLng(coordinates)
      .setContent('<p>Exact Location will be<br />provided after booking</p>')
      .openOn(map);
  }
  function error(err){
      if(err.code ===1){
          alert("Pleas allow geolocation")
      }else{
          alert("can't get currtent location");
      }
  }