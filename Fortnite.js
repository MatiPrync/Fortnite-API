
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
  

    const mapaTemporadas = new Map();
    const rarezasUnicas = new Set();
  
    todasLasSkins.forEach(skin => {
      if (skin.introduction && skin.introduction.text) {
        const texto = skin.introduction.text;
        if (!mapaTemporadas.has(texto)) {

          const cap = Number(skin.introduction.chapter) || 999;
          const temp = Number(skin.introduction.season) || 999;
          mapaTemporadas.set(texto, { texto, cap, temp });
        }
      }
      if (skin.rarity && skin.rarity.displayValue) {
        rarezasUnicas.add(skin.rarity.displayValue);
      }
    });
  

    const temporadasOrdenadas = Array.from(mapaTemporadas.values()).sort((a, b) => {
      if (a.cap !== b.cap) {
        return a.cap - b.cap;
      }
      return a.temp - b.temp;
    });
  
    temporadasOrdenadas.forEach(item => {
      const option = document.createElement('option');
      option.value = item.texto;
      option.textContent = item.texto;
      selectTemporada.appendChild(option);
    });
  
    Array.from(rarezasUnicas).sort().forEach(rareza => {
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