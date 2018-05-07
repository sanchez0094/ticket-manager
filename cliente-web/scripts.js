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
    $('#id_cliente').val(cliente.id_cliente);
    $('#nombre_cliente').val(cliente.nombre_cliente);
    $('#apellido_cliente').val(cliente.apellido_cliente);
    $('#cuit').val(cliente.cuit);
    $('#telefono').val(cliente.telefono);
    $('#direccion').val(cliente.direccion);
    $('#email').val(cliente.email);
    M.updateTextFields();
  }).catch(function(error) {
    alert(error.message);
  });
}

function listarClientes(callback) {
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
    if (callback)
      callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback)
      callback(error);
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
    $('#combo_empleados').append('<option>Seleccione uno</option>');
    _.each(empleados, function(e) {
      let html = `<option value="${e.id_empleado}">
        ${e.nombre_empleado} ${e.apellido_empleado}</option>`;
      $('#combo_empleados').append(html);
    });
    var elem =  $('#combo_empleados');
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
    $('#combo_negocios').append('<option>Seleccione uno</option>');
    _.each(negocios, function(n) {
      let html = `<option value="${n.id_negocio}">
        ${n.nombre_negocio}</option>`;
      $('#combo_negocios').append(html);
    });
    // var elem = document.querySelector('select');
    var elem = $('#combo_negocios');
    var instance = M.FormSelect.init(elem);
  }).catch(function(error) {
    alert(error.message);
  });
}

function nuevoCliente(callback) {
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
    if (callback) callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback) callback(error);
  });
}
function modificarCliente(callback) {
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
    if (callback) callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback) callback(error);
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
    $('#combo_estado').append('<option>Seleccione uno</option>');
    _.each(estados, function(p) {
      let html = `<option value="${p.id_estado}">
        ${p.nombre_estado}</option>`;
      $('#combo_estado').append(html);
    });
    // var elem = document.querySelector('select');
    var elem = $('#combo_estado');
    var instance = M.FormSelect.init(elem);
  }).catch(function(error) {
    alert(error.message);
  });
}
function actualizarClientes() {
  listarClientes(function(error) {
    if (!error) {
      $('#form-cliente').toggle();
      $('#add-btn').toggle();
      $('#remove-btn').toggle();
      $(document.querySelector('.autocomplete')).val(
     $('#nombre_cliente').val() + ' ' + $('#apellido_cliente').val() +
      ' (cod.' + $('#id_cliente').val() + ')');
    }
  });
}
/* function nuevoPedido(callback) {
  var form = document.getElementById('form-pedido');
  console.log(form);
  const pedido = {
    'fecha_pedido':,
    'fecha_entrega':,
    'detalle_pedido':,
    'monto':,
    'pago_efectuado':,
    'cuenta_corriente':,
    'seña':,
    'saldo':,
    'id_negocio_entrega': form.combo_negocios.selectedIndex,
    'id_cliente':,
    'id_preoridad':,
    'id_estado':,
    'id_empleado': form.combo_empledo.selectedIndex,

  };
  fetch('http://localhost:3000/api/pedido', {
    method: 'POST',
    body: JSON.stringify(pedido),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando pedido');
    else
      alert('Se cargo');
    if (callback) callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback) callback(error);
  });
} */
