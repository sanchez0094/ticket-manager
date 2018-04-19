/* global _,$ , fetch, document, M, alert, options  */
'use strict';
function obtenerIDCLiente() {
  var selectedClient = $(document.querySelector('.autocomplete')).val();
  var comboVal = selectedClient.split(' ');
  var userId = comboVal[(comboVal.length - 1)]
    .replace('(cod.', '')
    .replace(')', '');
  return userId;
}
function mostrarCliente() {
  var userId = obtenerIDCLiente();
  fetch('http://localhost:3000/api/clientes/' + userId, {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    return response.json();
  }).then(function(cliente) {
    $('#nombre_cliente').val(cliente.nombre_cliente);
    $('#apellido_cliente').val(cliente.apellido_cliente);
    $('#cuit').val(cliente.cuit);
    $('#telefono').val(cliente.telefono);
    $('#direccion').val(cliente.direccion);
    $('#email').val(cliente.email);
    M.updateTextFields();
    console.log('tendria q verse');
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
    var elem =  $('#combo-empleados');
    var instance = M.FormSelect.init(elem);
  }).catch(function(error) {
    alert(error.message);
  });
}
function listarNegocios() {
  fetch('http://localhost:3000/api/negocios', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    return response.json();
  }).then(function(negocios) {
    $('#combo-negocios').append('<option>Seleccione uno</option>');
    _.each(negocios, function(n) {
      let html = `<option value="${n.id}">
        ${n.nombre_negocio}</option>`;
      $('#combo-negocios').append(html);
    });
    // var elem = document.querySelector('select');
    var elem = $('#combo-negocios');
    var instance = M.FormSelect.init(elem);
  }).catch(function(error) {
    alert(error.message);
  });
}

function nuevoCliente() {
  var form = document.getElementById('form-pedido');
  console.log(form);
  const cliente = {

    'nombre_cliente': form.nombre_cliente.value,
    'apellido_cliente': form.apellido_cliente.value,
    'cuit': form.cuit.value,
    'telefono': form.telefono.value,
    'direccion': form.direccion.value,
    'email': form.email.value,
  };
  fetch('http://localhost:3000/api/clientes', {
    method: 'POST',
    body: JSON.stringify(cliente),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    else
      alert('Se cargo');
  }).catch(function(error) {
    alert(error.message);
  });
}
function modificarCliente() {
  var form = document.getElementById('form-pedido');
  console.log(form);
  const cliente = {
    'id_cliente': obtenerIDCLiente(),
    'nombre_cliente': form.nombre_cliente.value,
    'apellido_cliente': form.apellido_cliente.value,
    'cuit': form.cuit.value,
    'telefono': form.telefono.value,
    'direccion': form.direccion.value,
    'email': form.email.value,
  };
  fetch('http://localhost:3000/api/clientes', {
    method: 'PUT',
    body: JSON.stringify(cliente),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    else
      alert('Se cargo');
  }).catch(function(error) {
    alert(error.message);
  });
}
function listarEstado() {
  fetch('http://localhost:3000/api/estado_pedidos', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando cliente');
    return response.json();
  }).then(function(estados) {
    $('#combo-estado').append('<option>Seleccione uno</option>');
    _.each(estados, function(p) {
      let html = `<option value="${p.id_estado}">
        ${p.nombre_estado}</option>`;
      $('#combo-estado').append(html);
    });
    // var elem = document.querySelector('select');
    var elem = $('#combo-estado');
    var instance = M.FormSelect.init(elem);
  }).catch(function(error) {
    alert(error.message);
  });
}
