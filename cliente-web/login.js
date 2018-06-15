/* global _,$ , fetch, document, M, alert, options, location */
'use strict';
function validacion(callback) {
  fetch('http://localhost:3000/api/logins', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(login) {
    if (login.mail == $('#email')) {
      if (login.pass == $('#password')) {
        document.location.href = 'pedido.html';
      } else alert('Contraseña incorrecta');
    } else alert('Usuario o contraseña incorrectas.');
    if (callback)
      callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback)
      callback(error);
  });
}
function loginNuevo(callback) {
  var form = document.getElementById('form-loginNuevo');
  console.log(form);
  const login = {

    'mail': form.email.value,
    'pass': form.password.value,
  };
  fetch('http://localhost:3000/api/logins', {
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
