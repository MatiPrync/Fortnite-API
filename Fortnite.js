
let todasLasSkins = [];


async function cargarCatalogo() {
  const contenedor = document.getElementById('contenedor-skins');
  contenedor.innerHTML = '<p>Buscando skins...</p>';


  const url = 'https://fortnite-api.com/v2/cosmetics/br?language=es';

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();

    if (resultado.status === 200) {

      todasLasSkins = resultado.data.filter(item => item.type.value === 'outfit');
      buscarSkin();
    } else {
      contenedor.innerHTML = '<p>No se encontraron skins con ese nombre.</p>';
    }
  } catch (error) {
    console.error('Error:', error);
    contenedor.innerHTML = '<p>Hubo un error al conectar con la API.</p>';
  }
}


function buscarSkin() {

  const nombreSkin = document.getElementById('input-busqueda').value.trim().toLowerCase();
  const contenedor = document.getElementById('contenedor-skins');

  if (!nombreSkin || todasLasSkins.length === 0) return;


  const coincidencias = todasLasSkins.filter(skin =>
    skin.name.toLowerCase().includes(nombreSkin)
  );

  contenedor.innerHTML = '';

  if (coincidencias.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron skins con ese nombre.</p>';
    return;
  }

  coincidencias.slice(0, 40).forEach(skin => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-skin';

    const imagenUrl = skin.images.icon || skin.images.smallIcon;

    tarjeta.innerHTML = `
      <img src="${imagenUrl}" alt="${skin.name}" loading="lazy">
      <h3>${skin.name}</h3>
      <p class="rareza">${skin.rarity.displayValue}</p>
      <p class="descripcion">${skin.description}</p>
    `;

    contenedor.appendChild(tarjeta);
  });
}


document.getElementById('input-busqueda').addEventListener('input', buscarSkin);

// [ORIGINAL] Se mantuvo igual
document.getElementById('input-busqueda').addEventListener('keypress', function (evento) {
  if (evento.key === 'Enter') {
    buscarSkin();
  }
});

cargarCatalogo();