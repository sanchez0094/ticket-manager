/* global _,$ , fetch, document, alert, options, location, localStorage, window */
'use strict';
function validacion() {
  fetch('/api/Users/login', {
    method: 'POST',
    body: JSON.stringify({
      email: $('#email').val(),
      password: $('#password').val(),
    }),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(session) {
    localStorage.setItem('session', JSON.stringify(session));
    window.location = 'pedidos.html';
  }).catch(function(error) {
    alert('Usuario o contraseña incorrectas.');
  });
}

function loginNuevo(callback) {
  var form = document.getElementById('form-loginNuevo');
  console.log(form);
  const login = {
    'email': form.email.value,
    'password': form.password.value,
  };
  fetch('/api/Users', {
    method: 'POST',
    body: JSON.stringify(login),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    else
      alert('Se cargo');
    if (callback) callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback) callback(error);
  });
}
