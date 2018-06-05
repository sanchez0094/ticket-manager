/* global _,$ , fetch, document, M, alert, options, location */
'use strict';
const PRIORIDAD_BAJA = 6;
const PRIORIDAD_ALTA = 5;
const PRIORIDAD_MEDIA = 7;
function obtenerIDCLiente() {
  var selectedClient = $(document.querySelector('.autocomplete')).val();
  var comboVal = selectedClient.split(' ');
  var userId = comboVal[(comboVal.length - 1)]
    .replace('(cod.', '')
    .replace(')', '');
  return userId;
}
function obtenerIDEmpleados() {
  var selectedEmpl = $(document.querySelector('.autocomplete')).val();
  var comboVal = selectedEmpl.split(' ');
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
      throw new Error('Error');
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
      throw new Error('Error');
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

function listarEmpleados(selectedId) {
  fetch('http://localhost:3000/api/empleados', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(empleados) {
    $('#combo_empleados').append('<option>Seleccione uno</option>');
    _.each(empleados, function(e) {
      let selected = selectedId && selectedId == e.id_empleado ?
      'selected' : '';
      let html = `<option value="${e.id_empleado}" ${selected}>
        ${e.nombre_empleado} ${e.apellido_empleado}</option>`;
      $('#combo_empleados').append(html);
    });
    var elem =  $('#combo_empleados');
    var instance = M.FormSelect.init(elem);
  }).catch(function(error) {
    alert(error.message);
  });
}
function listarNegocios(selectedId) {
  fetch('http://localhost:3000/api/negocios', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(negocio) {
    $('#combo_negocios').append('<option>Seleccione uno</option>');
    _.each(negocio, function(n) {
      let selected = selectedId && selectedId == n.id_negocio ?
      'selected' : '';
      let html = `<option value="${n.id_negocio}" ${selected}>
        ${n.nombre_negocio}</option>`;
      $('#combo_negocios').append(html);
    });
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
    'email': form.email.value,
    'direccion': form.direccion.value,
  };
  fetch('http://localhost:3000/api/clientes', {
    method: 'POST',
    body: JSON.stringify(cliente),
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
      throw new Error('Error');
    else
      alert('Se cargo');
    if (callback) callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback) callback(error);
  });
}
function listarEstado(selectedId) {
  fetch('http://localhost:3000/api/estado_pedidos', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(estados) {
    $('#combo_estado').append('<option>Seleccione uno</option>');
    _.each(estados, function(p) {
      let selected = selectedId && selectedId == p.id_estado ?
      'selected' : '';
      let html = `<option value="${p.id_estado}" ${selected}>
        ${p.nombre_estado}</option>`;
      $('#combo_estado').append(html);
    });
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

$('#fecha_entrega').change(function() {
  var fecha = $(this).val();
});

function obtenerPrioridad() {
  var form = document.getElementById('form-pedido');
  if (form.alta.checked) {
    return 5;
  } else if (form.media.checked) {
    return  7;
  } else if (form.baja.checked) {
    return 6;
  }
}
function saldo() {
  return $('#monto').val() -  $('#seña').val();
}

function nuevoPedido(callback) {
  var form = document.getElementById('form-pedido');
  console.log(form);
  const pedido = {
    'fecha_pedido': form.fecha_pedido.value,
    'fecha_entrega_estipulada': form.fecha_entrega.value,
    'detalle_pedido': form.detalle_pedido.value,
    'monto': form.monto.value,
    'pago_efectuado': form.pago_efectuado.checked,
    'cuenta_corriente': form.cuenta_corriente.checked,
    'seña': form.seña.value,
    'saldo': saldo(),
    'id_prioridad': obtenerPrioridad(),
    'id_negocio': form.combo_negocios.value,
    'id_cliente': obtenerIDCLiente(),
    'id_estado': form.combo_estado.value,
    'id_empleado': form.combo_empleados.value,
  };
  fetch('http://localhost:3000/api/pedidos', {
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
}

function empleados() {
  var userId = obtenerIDEmpleados();
  fetch('http://localhost:3000/api/empleados/' + userId, {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando empleado');
    return response.json();
  }).then(function(empleado) {
    $('#id_empleado').val(empleado.id_empleado);
    $('#nombre_empleado').val(empleado.nombre_empleado);
    $('#apellido_empleado').val(empleado.apellido_empleado);
    $('#cuil').val(empleado.cuil);
    $('#telefono').val(empleado.telefono);
    $('#direccion').val(empleado.direccion);
    $('#email').val(empleado.email);
    M.updateTextFields();
  }).catch(function(error) {
    alert(error.message);
  });
}

function traerEmpleado(callback) {
  fetch('http://localhost:3000/api/empleados', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(empleado) {
    let listado = _.reduce(empleado, function(result, empleado, key) {
      let name = empleado.nombre_empleado + ' ' + empleado.apellido_empleado;
      let code = ' (cod.' + empleado.id_empleado + ')';
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
function nuevoEmpleado(callback) {
  var form = document.getElementById('form-cargaE');
  console.log(form);
  const empleado = {

    'nombre_empleado': form.nombre_empleado.value,
    'apellido_empleado': form.apellido_empleado.value,
    'cuil': form.cuil.value,
    'telefono': form.telefono.value,
    'email': form.email.value,
    'direccion': form.direccion.value,
  };
  fetch('http://localhost:3000/api/empleados', {
    method: 'POST',
    body: JSON.stringify(empleado),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando empleado');
    else
      alert('Se cargo');
    if (callback) callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback) callback(error);
  });
}
function modificarEmpleado(callback) {
  var form = document.getElementById('form-cargaE');
  console.log(form);
  const empleado = {
    'id_empleado': obtenerIDEmpleados(),
    'apellido_empleado': form.apellido_empleado.value,
    'nombre_empleado': form.nombre_empleado.value,
    'cuil': form.cuil.value,
    'telefono': form.telefono.value,
    'email': form.email.value,
    'direccion': form.direccion.value,
  };
  fetch('http://localhost:3000/api/empleados', {
    method: 'PUT',
    body: JSON.stringify(empleado),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error modificando empleado');
    else
      alert('Se cargo');
    if (callback) callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback) callback(error);
  });
}
function listarPedidos(filter, callback) {
  var table = $('#tablaPedidosCuerpo');
  table.html('');
  fetch('http://localhost:3000/api/pedidos?filter={"include":[{ "relation": "cliente"},{"relation": "estado"}]}', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(pedidos) {
    pedidos.forEach(function(pedido) {
      let match = new RegExp(filter);
      if (match.test(pedido.cliente.nombre_cliente) ||
      match.test(pedido.cliente.apellido_cliente) || !filter) {
        table.append(`<tr>
          <td>${pedido.cliente.nombre_cliente}
          ${pedido.cliente.apellido_cliente} </td>
          <td>${pedido.fecha_pedido.split('T')[0]}</td>
          <td>${pedido.estado.nombre_estado}</td>
          <td><a href="pedido.html?id=${pedido.id_pedido}">editar</a></td>
          </tr> `);
      }
    });
    if (callback)
      callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback)
      callback(error);
  });
}

function mostrarPedido(id, callback) {
  fetch('http://localhost:3000/api/pedidos/' + id + '?filter={"include":[{ "relation": "cliente"}]}', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(pedido) {
    console.log(pedido);
    $('#Pedidoid').val(pedido.id_pedido);
    $('#nombre_cliente').val(pedido.cliente.nombre_cliente + ' ' +
    pedido.cliente.apellido_cliente);
    $('#fecha_pedido').val(pedido.fecha_pedido.split('T')[0]);
    $('#fecha_entrega').val(pedido.fecha_entrega_estipulada.split('T')[0]);
    $('#detalle_pedido').val(pedido.detalle_pedido);
    $('#monto').val(pedido.monto);
    $('#seña').val(pedido.seña);
    $('#saldoRestante').val(pedido.saldo);
    document.getElementById('pago_efectuado').checked = pedido.pago_efectuado;
    document.getElementById('cuenta_corriente').checked =
    pedido.cuenta_corriente;
    if (pedido.id_prioridad == 5)
      document.getElementById('alta').checked = true;
    if (pedido.id_prioridad == 7)
      document.getElementById('media').checked = true;
    if (pedido.id_prioridad == 6)
      document.getElementById('baja').checked = true;
    if (callback)
      callback(null, pedido);
  }).catch(function(error) {
    alert(error.message);
    if (callback)
      callback(error);
  });
}
function getJsonFromUrl() {
  var result = {};
  location.search.substr(1).split('&').forEach(function(part) {
    var item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
function modificarPedido(callback) {
  var form = document.getElementById('form-edit-pedido');
  console.log(form);
  const pedido = {
    'fecha_pedido': form.fecha_pedido.value,
    'fecha_entrega_estipulada': form.fecha_entrega.value,
    'detalle_pedido': form.detalle_pedido.value,
    'monto': form.monto.value,
    'pago_efectuado': form.pago_efectuado.checked,
    'cuenta_corriente': form.cuenta_corriente.checked,
    'seña': form.seña.value,
    'saldo': saldo(),
    'id_prioridad': obtenerPrioridad(),
    'id_negocio': form.combo_negocios.value,
    'id_cliente': obtenerIDCLiente(),
    'id_estado': form.combo_estado.value,
    'id_empleado': form.combo_empleados.value,
  };
  fetch('http://localhost:3000/api/pedidos', {
    method: 'PUT',
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
}
function listaDeCLientes(filter, callback) {
  var table = $('#tablaClienteCuerpo');
  table.html('');
  fetch('http://localhost:3000/api/clientes', {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(cliente) {
    cliente.forEach(function(cliente) {
      let match = new RegExp(filter);
      if (match.test(cliente.nombre_cliente) ||
      match.test(cliente.apellido_cliente) || !filter) {
        table.append(`<tr>
          <td>${cliente.nombre_cliente}</td>
          <td>${cliente.apellido_cliente}</td>
          <td>${cliente.cuit}</td>
          <td>${cliente.email}</td>
          <td>${cliente.telefono}</td>
          <td>${cliente.direccion}</td>
          </tr> `);
      }
    });
    if (callback)
      callback();
  }).catch(function(error) {
    alert(error.message);
    if (callback)
      callback(error);
  });
}
