/* global _,$ , fetch, document, M, alert  */
'use strict';

function mostrarCliente() {
  var selectedClient = $(document.querySelector('.autocomplete')).val();
  var comboVal = selectedClient.split(' ');
  var userId = comboVal[(comboVal.length - 1)]
    .replace('(cod.', '')
    .replace(')', '');
  fetch('http://localhost:3000/api/clientes/' + userId, {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    return response.json();
  }).then(function(cliente) {
    // Cargar la info del cliente en los inputs
    // aca deberia ir en lugar de JUAN o SANCHEZ cliente.nombre_cliente o lo que corresponda
    $('#nombre_cliente').val('JUAN');
    $('#apellido_cliente').val('SANCHEZ');

    // Esto hace que se actualizen los inputs para que se vean bien con el
    // framework materialize
    M.updateTextFields();
  }).catch(function(error) {
    alert(error.message);
  });
}

function listarClientes() {
  fetch('http://localhost:3000/api/clientes', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    return response.json();
  }).then(function(clientes) {
    clientes = [{
      nombre_cliente: "juan",
      apellido_cliente: "sanchez",
      id_cliente: "1",
    }];
    let listado = _.reduce(clientes, function(result, cliente, key) {
      let name = cliente.nombre_cliente + ' ' + cliente.apellido_cliente;
      let code = ' (cod.' + cliente.id_cliente + ')';
      result[name + code] = null;
      return result;
    }, {});
    var elem = document.querySelector('.autocomplete');
    var instance = M.Autocomplete.getInstance(elem);

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
