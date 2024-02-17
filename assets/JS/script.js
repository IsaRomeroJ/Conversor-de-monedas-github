import { obtenerTodosLosIndicadores, obtenerUltimosPorIndicador } from './querys.js';

const montoClp = document.getElementById('monto-clp');
const tipoMoneda = document.getElementById('tipo-moneda');
const btnConvertir = document.getElementById('btn-convertir');
const resultado = document.getElementById('resultado');
const graficaIndicador = document.getElementById('graficaMoneda');

const cargarTiposMonedas = async () => {

  const indicadores = await obtenerTodosLosIndicadores();

  if (!indicadores) {
    return;
  }

  Object.values(indicadores)
  .slice(3)
  .forEach((indicador) => {
      tipoMoneda.innerHTML += `<option value="${indicador.codigo}">${indicador.nombre}</option>`;
  });
  
};

const obtenerValorTipoMoneda = async (tipoMoneda) => {
  const data = await obtenerTodosLosIndicadores();

  if (!data) {
    return "false";
  }
  const { [tipoMoneda]: { valor } } = data;
  return valor;

};


const renderizarGraficaIndicador = async () => {
  const dataTipoMoneda = await obtenerUltimosPorIndicador(tipoMoneda.value);

  if(!dataTipoMoneda) {
    return ;
  }

  const tipoDeGrafica = 'line';
  const titulo = `Gráfica ${tipoMoneda.value.toUpperCase()}`;
  const fechas = dataTipoMoneda.map((moneda) => moneda.fecha);
  const valores = dataTipoMoneda.map((moneda) => moneda.valor);
  
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: fechas,
      datasets: [{
          label: titulo,
          borderColor: 'rgb(214, 40, 40)',
          backgroundColor: 'rgba(214, 40, 40, 0.5)',
          data: valores,
          }]
      }
    };

  new Chart(graficaIndicador, config);
 
};


function validarInput(input) {
  let valor = parseFloat(input.value);

  if (Number.isInteger(valor) && valor > 0) {
    input.style.animation = "";
    return true;

  } else { 
    input.style.animation = "shake-horizontal 0.8s ease-out";
    return false;

  }
}


montoClp.addEventListener('click', () => {
  montoClp.classList.remove('is-invalid');
  montoClp.style.animation = "";
});


btnConvertir.addEventListener('click', async () => {
  if (validarInput(montoClp)) {
    const valorTipoMoneda = await obtenerValorTipoMoneda(tipoMoneda.value);

    if (valorTipoMoneda != "false") {
      resultado.innerHTML = 'Resultado: $ ' + (montoClp.value / valorTipoMoneda).toFixed(2);
      await renderizarGraficaIndicador();
    }
    montoClp.value = '';
    montoClp.focus();

  } else {
    montoClp.classList.add('is-invalid');
    montoClp.value = '';
  }
});


cargarTiposMonedas();