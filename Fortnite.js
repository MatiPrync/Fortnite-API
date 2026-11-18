
let todasLasSkins = [];


async function cargarCatalogo() {
  const contenedor = document.getElementById('contenedor-skins');
  contenedor.innerHTML = '<p>Buscando skins...</p>';


  const url = 'https://fortnite-api.com/v2/cosmetics/br?language=es';

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();

    if (resultado.status === 200) {
        todasLasSkins = resultado.data.filter(item => item.type?.value === 'outfit');
        llenarFiltros();
        buscarSkin();
      } else {
        contenedor.innerHTML = '<p>No se pudieron cargar las skins.</p>';
      }
    } catch (error) {
      console.error('Error:', error);
      contenedor.innerHTML = '<p>Hubo un error al conectar con la API.</p>';
    }
  }
  function llenarFiltros() {
    const selectTemporada = document.getElementById('filtro-temporada');
    const selectRareza = document.getElementById('filtro-rareza');
  
    const temporadasUnicas = new Set();
    const rarezasUnicas = new Set();
  
    todasLasSkins.forEach(skin => {
      if (skin.introduction && skin.introduction.text) {
        temporadasUnicas.add(skin.introduction.text);
      }
      if (skin.rarity && skin.rarity.displayValue) {
        rarezasUnicas.add(skin.rarity.displayValue);
      }
    });
  
    temporadasUnicas.forEach(temp => {
      const option = document.createElement('option');
      option.value = temp;
      option.textContent = temp;
      selectTemporada.appendChild(option);
    });
  
    rarezasUnicas.forEach(rareza => {
      const option = document.createElement('option');
      option.value = rareza;
      option.textContent = rareza;
      selectRareza.appendChild(option);
    });
  }


function buscarSkin() {

    const nombreSkin = document.getElementById('input-busqueda').value.trim().toLowerCase();
    const temporadaElegida = document.getElementById('filtro-temporada').value;
    const rarezaElegida = document.getElementById('filtro-rareza').value;
    const contenedor = document.getElementById('contenedor-skins');
  
    if (todasLasSkins.length === 0) return;
  
    const coincidencias = todasLasSkins.filter(skin => {
      const coincideNombre = nombreSkin === '' || skin.name.toLowerCase().includes(nombreSkin);
      
      const tempSkin = skin.introduction ? skin.introduction.text : '';
      const coincideTemporada = temporadaElegida === '' || tempSkin === temporadaElegida;
      
      const rarezaSkin = skin.rarity ? skin.rarity.displayValue : '';
      const coincideRareza = rarezaElegida === '' || rarezaSkin === rarezaElegida;
  
      return coincideNombre && coincideTemporada && coincideRareza;
    });
  
    contenedor.innerHTML = '';
  
    if (coincidencias.length === 0) {
      contenedor.innerHTML = '<p>No se encontraron skins con esos filtros.</p>';
      return;
    }
  
    coincidencias.slice(0, 100).forEach(skin => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'tarjeta-skin';
  
      const imagenUrl = skin.images?.icon || skin.images?.smallIcon || '';
      const textoTemporada = skin.introduction?.text || 'Sin temporada';
      const textoRareza = skin.rarity?.displayValue || 'Común';
      const textoDescripcion = skin.description || 'Sin descripción';
  
      tarjeta.innerHTML = `
        <img src="${imagenUrl}" alt="${skin.name}" loading="lazy">
        <h3>${skin.name}</h3>
        <p class="rareza">${textoRareza}</p>
        <p class="temporada">${textoTemporada}</p>
        <p class="descripcion">${textoDescripcion}</p>
      `;
  
      contenedor.appendChild(tarjeta);
    });
  }
  
  document.getElementById('input-busqueda').addEventListener('input', buscarSkin);
  document.getElementById('filtro-temporada').addEventListener('change', buscarSkin);
  document.getElementById('filtro-rareza').addEventListener('change', buscarSkin);
  
  document.getElementById('input-busqueda').addEventListener('keypress', function (evento) {
    if (evento.key === 'Enter') {
      buscarSkin();
    }
  });
  
  cargarCatalogo();