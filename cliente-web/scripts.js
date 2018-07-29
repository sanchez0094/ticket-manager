/* global _,$ , fetch, document, M, alert, options, location, localStorage, Highcharts */
'use strict';
const PRIORIDAD_BAJA = 6;
const PRIORIDAD_ALTA = 5;
const PRIORIDAD_MEDIA = 7;

function getAuthorizedQuery(params) {
  let query = typeof params == 'string' ? params.split('&') : [];
  const session = localStorage.getItem('session');
  query.push('access_token=' + JSON.parse(session).id);
  return `?${query.join('&')}`;
}

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
  let query = getAuthorizedQuery();
  fetch('/api/clientes/' + userId + query, {
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
  let query = getAuthorizedQuery('filter={"where":{"estado": true}}');
  fetch('/api/clientes' + query, {
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
  let query = getAuthorizedQuery('filter={"where":{"estado": true}}');
  fetch('/api/empleados' + query, {
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
  let query = getAuthorizedQuery();
  fetch('/api/negocios' + query, {
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
    'estado': true,
  };
  let query = getAuthorizedQuery();
  fetch('/api/clientes' + query, {
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
    'estado': true,
  };
  let query = getAuthorizedQuery();
  fetch('/api/clientes' + query, {
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
  let query = getAuthorizedQuery();
  fetch('/api/estado_pedidos' + query, {
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
    return PRIORIDAD_ALTA;
  } else if (form.media.checked) {
    return  PRIORIDAD_MEDIA;
  } else if (form.baja.checked) {
    return PRIORIDAD_BAJA;
  }
}
function obtenerPrioridadModifPedido() {
  var form = document.getElementById('form-edit-pedido');
  if (form.alta.checked) {
    return PRIORIDAD_ALTA;
  } else if (form.media.checked) {
    return  PRIORIDAD_MEDIA;
  } else if (form.baja.checked) {
    return PRIORIDAD_BAJA;
  }
}
function saldo() {
  return $('#monto').val() -  $('#seña').val();
}

function nuevoPedido(callback) {
  var form = document.getElementById('form-pedido');
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
  let query = getAuthorizedQuery();
  fetch('/api/pedidos' + query, {
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
  let query = getAuthorizedQuery();
  fetch('/api/empleados/' + userId + query, {
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
  let query = getAuthorizedQuery('filter={"where":{"estado": true}}');
  fetch('/api/empleados' + query, {
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
    'estado': true,
  };
  let query = getAuthorizedQuery();
  fetch('/api/empleados' + query, {
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
    // alert(error.message);
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
    'estado': true,
  };
  let query = getAuthorizedQuery();
  fetch('/api/empleados' + query, {
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
    // alert(error.message);
    if (callback) callback(error);
  });
}
function listarPedidos(filter, callback) {
  var table = $('#tablaPedidosCuerpo');
  table.html('');
  let query = getAuthorizedQuery('filter={"include":[{ "relation": "cliente"},{"relation": "estado"}]}');
  fetch('/api/pedidos' + query, {
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
        table.append(`<tr class="fila">
    <td class="idPedido" style="display:none">${pedido.id_pedido}</td>
    <td class="nombre">${pedido.cliente.nombre_cliente}
    ${pedido.cliente.apellido_cliente} </td>
    <td class="fecha_pedido">${pedido.fecha_pedido.split('T')[0]}</td>
    <td class="nombre_estado">${pedido.estado.nombre_estado}</td>
    <td class="estado" style="display:none">${pedido.id_estado}</td>
    <td><a class="editar" href="pedido.html?id=${pedido.id_pedido}">editar</a></td>
    </tr> `);
        var fila = document.getElementsByClassName('fila');
        var estado = document.getElementsByClassName('estado');
        var editar = document.getElementsByClassName('editar');

        for (var i = 0; i < fila.length; i++) {
          if (estado[i].textContent == 5) {
            fila[i].style = 'background-color:LightSlateGrey;color:white;';
          }
        }
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
function idPedido() {
  return iid;
}
var iid;
function mostrarPedido(id, callback) {
  iid = id;
  let query = getAuthorizedQuery('filter={"include":[{ "relation": "cliente"}]}');
  fetch('/api/pedidos/' + id + query, {
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
    $('#id_cliente').val(pedido.id_cliente);
    $('#fecha_pedido').val(pedido.fecha_pedido.split('T')[0]);
    $('#fecha_entrega').val(pedido.fecha_entrega_estipulada.split('T')[0]);
    $('#detalle_pedido').val(pedido.detalle_pedido);
    $('#monto').val(pedido.monto);
    $('#seña').val(pedido.seña);
    $('#saldoRestante').val(pedido.saldo);
    document.getElementById('pago_efectuado').checked = pedido.pago_efectuado;
    document.getElementById('cuenta_corriente').checked = pedido.cuenta_corriente;
    if (pedido.id_prioridad == PRIORIDAD_ALTA)
      document.getElementById('alta').checked = true;
    if (pedido.id_prioridad == PRIORIDAD_MEDIA)
      document.getElementById('media').checked = true;
    if (pedido.id_prioridad == PRIORIDAD_BAJA)
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
    'id_pedido': idPedido(),
    'fecha_pedido': form.fecha_pedido.value,
    'fecha_entrega_estipulada': form.fecha_entrega.value,
    'detalle_pedido': form.detalle_pedido.value,
    'monto': form.monto.value,
    'pago_efectuado': form.pago_efectuado.checked,
    'cuenta_corriente': form.cuenta_corriente.checked,
    'seña': form.seña.value,
    'saldo': saldo(),
    'id_negocio': form.combo_negocios.value,
    'id_cliente': form.id_cliente.value,
    'id_prioridad': obtenerPrioridadModifPedido(),
    'id_estado': form.combo_estado.value,
    'id_empleado': form.combo_empleados.value,
  };
  let query = getAuthorizedQuery();
  fetch('/api/pedidos' + query,  {
    method: 'PUT',
    body: JSON.stringify(pedido),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error registrando pedido' + console.log(pedido));
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
  let query = getAuthorizedQuery();
  fetch('/api/clientes' + query, {
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
        table.append(`<tr class="fila">
          <td class="idCliente" style="display:none">${cliente.id_cliente}</td>
          <td class="nombre">${cliente.nombre_cliente}</td>
          <td class="apellido">${cliente.apellido_cliente}</td>
          <td class="cuit">${cliente.cuit}</td>
          <td class="email">${cliente.email}</td>
          <td class="telefono">${cliente.telefono}</td>
          <td class="direccion">${cliente.direccion}</td>
          <td class="estado" style="display:none">${cliente.estado}</td>
          <td ><a href="javascript:quitarCliente(${cliente.id_cliente});">eliminar</a></td>


          </tr> `);

        var fila = document.getElementsByClassName('fila');
        var estado = document.getElementsByClassName('estado');

        for (var i = 0; i < fila.length; i++) {
          if (estado[i].textContent == 'false') {
            fila[i].style = 'background-color:LightSlateGrey;color:white;';
          }
        }
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
function reporte() {
  const date = new Date();
  const hoy =  `${date.getFullYear()}-${date.getMonth().length > 1 ?
date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate()}`;
let query = getAuthorizedQuery('filter={"where":{"fecha_pedido": "' + hoy + '"}}');
  fetch('/api/pedidos' + query, {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(datos) {
    const sumaSenia = _.reduce(datos, (acc, pedido)=> {
      const resultado = acc + pedido.seña;
      return resultado;
    }, 0);
    const sumaMonto = _.reduce(datos, (acc, pedido)=> {
      const resultado = acc + pedido.monto;
      return resultado;
    }, 0);
    var montoDeudor = sumaMonto - sumaSenia;
    Highcharts.setOptions({
      colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
        return {
          radialGradient: {
            cx: 0.5,
            cy: 0.3,
            r: 0.7
          },
          stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')]
          ],
        };
      }),
    });
    Highcharts.chart('container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Señas totales del dia' + ' ' + hoy
      },
      tooltip: {
        pointFormat: '{series.name}: <b>${point.y:.2f}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: ${point.y:.2f}',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            },
            connectorColor: 'silver'
          },
        },
      },
      series: [{
        name: 'Share',
        data: [
            {name: 'Seña', y: sumaSenia},
            {name: 'Facturacion', y: montoDeudor}
        ]
      }],
    });
  }).catch(function(error) {
    alert(error.message);
  });
} // generar reporte diario de importe total de señas
var arrayMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function reporte1() {
  const date = new Date();
  const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const inicioMes =  `${date.getFullYear()}-${date.getMonth().length > 1 ?
                      date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-01`;
  const finMes =  `${date.getFullYear()}-${date.getMonth().length > 1 ?
    date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${ultimoDia.getDate()}`;
  let query = getAuthorizedQuery('filter={"where":{"or": [{"id_estado": 2},{"id_estado": 3}]}}');
  //let query = getAuthorizedQuery('filter={"where": {"and": [{"fecha_pedido": {"gte": "' + inicioMes + '" }},{"fecha_pedido": {"lte": "' + finMes + '"}},{"or": [{"id_estado": 2},{"id_estado": 3}]}]}}');
  fetch('/api/pedidos' + query, {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(datos) {
    const suma = _.reduce(datos, (acc, pedido)=> {
      const resultado = acc + pedido.monto;
      return resultado;
    }, 0);
    const agrupado =  _.groupBy(datos, (pedido) => {
      return new Date(pedido.fecha_pedido).getMonth();
    });
    const mapeado = _.map(agrupado, (mensual) => {
      let total = _.reduce(mensual, (acc, pedido) => {
        return acc + pedido.monto;
      }, 0);
      var etiquetaMes = new Date(mensual[0].fecha_pedido);
      var baseName = arrayMes[etiquetaMes.getMonth()] +
                     ' ' + etiquetaMes.getFullYear();
      return {
        y: total,
        name: baseName,
      };
    });
    Highcharts.chart('container2', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Total Mensual de Trabajos Entregados y Realizados'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Montos Totales'
        },

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '${point.y:.1f}'
          },
        },
      },
      'series': [
        {
          'name': 'Total $',
          'colorByPoint': true,
          'data': mapeado
        },
      ],
    });
  }).catch(function(error) {
    alert(error.message);
  });// generar reporte mensulaes de importes de trabajos realizados y entregados
}
function reportePendientes() {
  var table = $('#tablaReportesPendientes');
  table.html('');
  const date = new Date();
  const hoy =  `${date.getFullYear()}-${date.getMonth().length > 1 ?
date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate()}`;
  let query = getAuthorizedQuery('filter={"include":[{"relation": "cliente"},{"relation": "estado"}],"where":{"and": [{"fecha_pedido": "' + hoy + '"},{"id_estado":2}]}}');
  fetch('/api/pedidos' + query, {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(datos) {
    datos.forEach(function(pedido) {
      table.append(`<tr>
        <td>${pedido.cliente.nombre_cliente}
        ${pedido.cliente.apellido_cliente} </td>
        <td>${pedido.fecha_pedido.split('T')[0]}</td>
        <td>${pedido.estado.nombre_estado}</td>
        <td>${pedido.detalle_pedido}</td>
        </tr> `);
    });
  }).catch(function(error) {
    alert(error.message);
  });
}// generar reporte diario de trabajos pendientes
function reporteRealizados() {
  var table = $('#tablaReportesCuerpoRealizados');
  table.html('');
  const date = new Date();
  const hoy =  `${date.getFullYear()}-${date.getMonth().length > 1 ?
date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate()}`;
  let query = getAuthorizedQuery('filter={"include":[{"relation": "cliente"},{"relation": "estado"}],"where":{"and": [{"fecha_pedido": "' + hoy + '"},{"id_estado":6}]}}');
  fetch('/api/pedidos' + query, {
    method: 'GET',
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    return response.json();
  }).then(function(datos) {
    datos.forEach(function(pedido) {
      table.append(`<tr>
        <td>${pedido.cliente.nombre_cliente}
        ${pedido.cliente.apellido_cliente} </td>
        <td>${pedido.fecha_pedido.split('T')[0]}</td>
        <td>${pedido.estado.nombre_estado}</td>
        <td>${pedido.detalle_pedido}</td>
        </tr> `);
    });
  }).catch(function(error) {
    alert(error.message);
  });
}// generar reporte diario de trabajos realizados

function quitarEmpleado(callback) {
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
    'estado': false,
  };
  let query = getAuthorizedQuery();
  fetch('/api/empleados' + query, {
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
    if (callback) callback(error);
  });
}
function quitarCliente(idCliente) {
  var fila = document.getElementsByClassName('fila');
  var idClienteA = document.getElementsByClassName('idCliente');
  var nombre = document.getElementsByClassName('nombre');
  var apellido = document.getElementsByClassName('apellido');
  var cuit = document.getElementsByClassName('cuit');
  var email = document.getElementsByClassName('email');
  var telefono = document.getElementsByClassName('telefono');
  var direccion = document.getElementsByClassName('direccion');
  var cliente = null;
  for (var i = 0; i < fila.length; i++) {
    if (idClienteA[i].textContent == idCliente) {
      cliente = {
        'id_cliente': idClienteA[i].textContent,
        'apellido_cliente': apellido[i].textContent,
        'nombre_cliente': nombre[i].textContent,
        'cuit': cuit[i].textContent,
        'telefono': telefono[i].textContent,
        'email': email[i].textContent,
        'direccion': direccion[i].textContent,
        'estado': false,
      };
      break;
    }
  }
  let query = getAuthorizedQuery();
  fetch('/api/clientes' + query, {
    method: 'PUT',
    body: JSON.stringify(cliente),
    headers: {'content-type': 'application/json'},
  }).then(function(response) {
    if (response.status != 200)
      throw new Error('Error');
    else
      alert('Se cargo');
    location.href = 'clientes.html';
  //  if (callback) callback();
  }).catch(function(error) {
    // alert(error.message);
  //  if (callback) callback(error);
  });
}
