$(document).ready(function() {
  $containerGamers = $('#container-gamers');
  $inputFileImagesDay = $('#file-day');
  $containerImgDay = $('#container-image-day');

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('bd').
        on('child_added', function(s) {
          var user = s.val();
          var allGamersCode = s.ref.key;
          $('#container-gamers').prepend('<div data-code="' + allGamersCode + '" id="code-gamers"  class="col-xs-12 col-sm-12 col-md-2 col-lg-1">' + 
          '<img class="profile img-responsive img-circle center-block" src=\'' + user.photo.urlImage + '\' />' + '</div>' + '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-9">' + 
          '<h4 class="user-name color col-xs-12 col-sm-12 col-md-12 col-lg-10">' + user.name + '</h4>' + 
          '<p class="user-name color col-xs-12 col-sm-12 col-md-12 col-lg-10">' + user.phrase + '</p>' + '</div>');

          $('#container-gamers #code-gamers').on('click', function(event) {
            var anotherGamerPlace = $(this).data('code');
            window.localStorage.setItem('another-gamer-code', anotherGamerPlace);
            window.location.assign('anotherGamer.html');
          });
        });
        var codeUser = user.uid;
      
      showProfileImageDay();

      function showProfileImageDay() {
        firebase.database().ref('bd').child(codeUser).child('imgDay')
          .on('value', function(s) {
            var data = s.val();
            $containerImgDay.html('');
            for (var key in data) {
              $containerImgDay.prepend(`
              <img class="profile img-responsive img-circle image" src="${data[key].url}" alt="">`);
            }
          });
      }

      /* Con esta funcion subiremos imagenes a storage de firebase */
      $inputFileImagesDay.on('change', function() {
        var imageUpload = $(this).prop('files')[0];

        var uploadDay = storageRef.child('imagesDay/' + imageUpload.name).put(imageUpload);
        uploadDay.on('state_changed', 
          function(s) {
          // mostrar barra de progreso
          },
          function(error) {
            alert('Hubo un error al subir la imagen');
          },
          function() {
            // Se mostrará cuando se ha subido exitosamente la imagen
            var downloadURL = uploadTask.snapshot.downloadURL;
            createImagePostFirebaseNode(imageUpload.name, downloadURL);
          });
      });
      
      function createImagePostFirebaseNode(nameImgDay, url) {
        firebase.database().ref('bd').child(codeUser).child('imgDay').push({
          name: nameImgDay,
          url: url
        });
      }
    } else {
      // No user is signed in.
    }
  });
});