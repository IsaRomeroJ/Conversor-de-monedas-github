export const obtenerTodosLosIndicadores = async () => {
    try {
      const response = await fetch('https://mindicador.cl/api');
      const data = await response.json();
  
      return data;
    } catch (error) {
  
      swal({
        text: 'Problemas para conectarse con el Servidor',
        icon: 'error',
      });
      return false;
  
    }
  };
  
  export const obtenerUltimosPorIndicador = async (tipoIndicador) => {
    try {
      const response = await fetch(`https://mindicador.cl/api/${tipoIndicador}`);
      const data = await response.json();
  
      const ultimosDiezDatos = data.serie;
  
      return ultimosDiezDatos
        .slice(0, 10)
        .reverse()
        .map((dato) => {
          return {
            fecha: dato.fecha.split('T')[0].split('-').reverse().join('-'),
            valor: dato.valor
          };
        });
  
    } catch (error) {
  
      swal({
        text: 'Problemas para conectarse con el Servidor',
        icon: 'error',
      });
      return false;
    
    }
  };