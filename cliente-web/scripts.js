/* global _,$ , fetch, document, M, alert  */
'use strict';

function listarClientes() {
  fetch('http://localhost:3000/api/clientes', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    return response.json();
  }).then(function(clientes) {
    let listado = _.reduce(clientes, function(result, cliente, key) {
      let name = cliente.nombre_cliente + ' ' + cliente.apellido_cliente;
      let code = ' (cod.' + cliente.id_cliente + ')';
      result[name + code] = null;
      return result;
    }, {});
    var elem = document.querySelector('.autocomplete');
    var instance = M.Autocomplete.init(elem, {data: listado});
  }).catch(function(error) {
    alert(error.message);
  });
}

function listarEmpleados() {
  fetch('http://localhost:3000/api/empleados', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    return response.json();
  }).then(function(empleados) {
    $('#combo-empleados').append('<option>Seleccione uno</option>');
    _.each(empleados, function(e) {
      let html = `<option value="${e.id}">
        ${e.nombre_empleado} ${e.apellido_empleado}</option>`;
      $('#combo-empleados').append(html);
    });
    var elem = document.querySelector('select');
    var instance = M.FormSelect.init(elem);
  }).catch(function(error) {
    alert(error.message);
  });
}

function nuevoCliente() {

}
