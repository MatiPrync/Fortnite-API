async function buscarSkin() {
    const nombreSkin = document.getElementById('input-busqueda').value.trim();
    const contenedor = document.getElementById('contenedor-skins');
  
    if (!nombreSkin) return;
  
    contenedor.innerHTML = '<p>Buscando skins...</p>';
  
    const url = `https://fortnite-api.com/v2/cosmetics/br/search/all?name=${encodeURIComponent(nombreSkin)}&type=outfit&language=es&searchLanguage=es`;
  
    try {
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
  
      contenedor.innerHTML = '';
  
      if (resultado.status !== 200) {
        contenedor.innerHTML = '<p>No se encontraron skins con ese nombre.</p>';
        return;
      }
  
      resultado.data.forEach(skin => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-skin';
  
        const imagenUrl = skin.images.icon || skin.images.smallIcon;
  
        tarjeta.innerHTML = `
          <img src="${imagenUrl}" alt="${skin.name}">
          <h3>${skin.name}</h3>
          <p class="rareza">${skin.rarity.displayValue}</p>
          <p class="descripcion">${skin.description}</p>
        `;
  
        contenedor.appendChild(tarjeta);
      });
  
    } catch (error) {
      console.error('Error:', error);
      contenedor.innerHTML = '<p>Hubo un error al conectar con la API.</p>';
    }
  }
  
  // Permite buscar también al presionar la tecla Enter en el input
  document.getElementById('input-busqueda').addEventListener('keypress', function (evento) {
    if (evento.key === 'Enter') {
      buscarSkin();
    }
  });
  
  // Carga inicial
  buscarSkin();