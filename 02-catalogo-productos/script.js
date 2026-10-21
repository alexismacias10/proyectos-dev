// Datos de ejemplo. En un proyecto real vendrían de una API o de un JSON.
const productos = [
  { id: 1, nombre: 'Auriculares inalámbricos', categoria: 'Audio', precio: 45000 },
  { id: 2, nombre: 'Parlante portátil', categoria: 'Audio', precio: 62000 },
  { id: 3, nombre: 'Teclado mecánico', categoria: 'Computación', precio: 78000 },
  { id: 4, nombre: 'Mouse ergonómico', categoria: 'Computación', precio: 28000 },
  { id: 5, nombre: 'Monitor 24"', categoria: 'Computación', precio: 185000 },
  { id: 6, nombre: 'Cargador USB-C 30W', categoria: 'Accesorios', precio: 15500 },
  { id: 7, nombre: 'Cable HDMI 2m', categoria: 'Accesorios', precio: 9000 },
];

const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// Llenar el select de categorías sin repetir valores.
const categorias = [...new Set(productos.map(p => p.categoria))].sort();
$('categoria').insertAdjacentHTML('beforeend',
  categorias.map(c => `<option>${c}</option>`).join(''));

function filtrar() {
  const texto = $('buscar').value.trim().toLowerCase();
  const cat = $('categoria').value;
  const orden = $('orden').value;

  let resultado = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) && (!cat || p.categoria === cat));

  if (orden === 'precio-asc') resultado.sort((a, b) => a.precio - b.precio);
  if (orden === 'precio-desc') resultado.sort((a, b) => b.precio - a.precio);

  $('lista').innerHTML = resultado.map(p => `
    <li class="producto">
      <span class="cat">${p.categoria}</span>
      <h2>${p.nombre}</h2>
      <span class="precio">${fmt(p.precio)}</span>
    </li>`).join('');

  $('contador').textContent = `${resultado.length} de ${productos.length} productos`;
  $('vacio').hidden = resultado.length > 0;
}

['buscar', 'categoria', 'orden'].forEach(id => $(id).addEventListener('input', filtrar));
filtrar();
