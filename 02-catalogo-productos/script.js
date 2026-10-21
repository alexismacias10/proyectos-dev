// Datos de ejemplo. En un proyecto real vendrían de una API o de un JSON.
const productos = [
  { id: 1, nombre: 'Auriculares inalámbricos', categoria: 'Audio', precio: 45000, rating: 4.6, reseñas: 128, nuevo: true },
  { id: 2, nombre: 'Parlante portátil', categoria: 'Audio', precio: 62000, rating: 4.4, reseñas: 86 },
  { id: 3, nombre: 'Teclado mecánico', categoria: 'Computación', precio: 78000, rating: 4.8, reseñas: 214, nuevo: true },
  { id: 4, nombre: 'Mouse ergonómico', categoria: 'Computación', precio: 28000, rating: 4.3, reseñas: 59 },
  { id: 5, nombre: 'Monitor 24"', categoria: 'Computación', precio: 185000, rating: 4.7, reseñas: 173 },
  { id: 6, nombre: 'Cargador USB-C 30W', categoria: 'Accesorios', precio: 15500, rating: 4.5, reseñas: 301 },
  { id: 7, nombre: 'Cable HDMI 2m', categoria: 'Accesorios', precio: 9000, rating: 4.2, reseñas: 47 },
];

const ICONOS = {
  Audio: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  Computación: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  Accesorios: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
};

const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const estado = { texto: '', categoria: '', orden: '' };
const carrito = new Map();

const categorias = [...new Set(productos.map(p => p.categoria))].sort();
$('chips').innerHTML = ['Todas', ...categorias]
  .map((c, i) => `<button type="button" class="chip" data-cat="${i === 0 ? '' : c}" aria-pressed="${i === 0}">${c}</button>`)
  .join('');

function estrellas(r) {
  const llenas = Math.round(r);
  return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
}

function tarjeta(p, i) {
  return `
    <li class="producto" style="animation-delay:${i * 40}ms">
      <div class="foto g-${p.categoria}">
        ${p.nuevo ? '<span class="nuevo">NUEVO</span>' : ''}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[p.categoria]}</svg>
      </div>
      <div class="info">
        <span class="cat">${p.categoria}</span>
        <h2>${p.nombre}</h2>
        <div class="estrellas" aria-label="${p.rating} de 5">${estrellas(p.rating)}<small>${p.rating} (${p.reseñas})</small></div>
        <div class="pie">
          <span class="precio">${fmt(p.precio)}</span>
          <button type="button" class="agregar" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    </li>`;
}

function filtrar() {
  const texto = estado.texto.trim().toLowerCase();
  const resultado = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) && (!estado.categoria || p.categoria === estado.categoria));

  if (estado.orden === 'precio-asc') resultado.sort((a, b) => a.precio - b.precio);
  if (estado.orden === 'precio-desc') resultado.sort((a, b) => b.precio - a.precio);
  if (estado.orden === 'nombre') resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  $('lista').innerHTML = resultado.map(tarjeta).join('');
  $('contador').textContent = `${resultado.length} de ${productos.length} productos`;
  $('vacio').hidden = resultado.length > 0;
}

function pintarCarrito() {
  const items = [...carrito.entries()].map(([id, cant]) => ({ p: productos.find(x => x.id === id), cant }));
  const unidades = items.reduce((s, i) => s + i.cant, 0);
  const total = items.reduce((s, i) => s + i.p.precio * i.cant, 0);

  $('carrito-n').textContent = unidades;
  $('total').textContent = fmt(total);
  $('vaciar').disabled = unidades === 0;

  $('panel-lista').innerHTML = items.length
    ? items.map(({ p, cant }) => `
        <li>
          <span class="nom">${p.nombre}</span>
          <div class="cant">
            <button type="button" data-menos="${p.id}" aria-label="Quitar uno">−</button>
            <span>${cant}</span>
            <button type="button" data-mas="${p.id}" aria-label="Agregar uno">+</button>
          </div>
          <span class="sub">${fmt(p.precio * cant)}</span>
        </li>`).join('')
    : '<li class="panel-vacio">Tu carrito está vacío.</li>';
}

function cambiar(id, delta) {
  const nuevo = (carrito.get(id) || 0) + delta;
  if (nuevo <= 0) carrito.delete(id); else carrito.set(id, nuevo);
  pintarCarrito();
}

function panel(abrir) {
  $('panel').classList.toggle('abierto', abrir);
  $('panel').setAttribute('aria-hidden', String(!abrir));
  $('velo').hidden = !abrir;
}

$('buscar').addEventListener('input', e => { estado.texto = e.target.value; filtrar(); });
$('orden').addEventListener('change', e => { estado.orden = e.target.value; filtrar(); });

$('chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  estado.categoria = chip.dataset.cat;
  document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
  filtrar();
});

$('limpiar').addEventListener('click', () => {
  estado.texto = ''; estado.categoria = ''; estado.orden = '';
  $('buscar').value = ''; $('orden').value = '';
  document.querySelectorAll('.chip').forEach((c, i) => c.setAttribute('aria-pressed', String(i === 0)));
  filtrar();
});

$('lista').addEventListener('click', e => {
  const btn = e.target.closest('.agregar');
  if (!btn) return;
  cambiar(Number(btn.dataset.id), 1);
  const badge = $('carrito-n');
  badge.classList.remove('salto');
  void badge.offsetWidth;
  badge.classList.add('salto');
});

$('panel-lista').addEventListener('click', e => {
  const mas = e.target.closest('[data-mas]');
  const menos = e.target.closest('[data-menos]');
  if (mas) cambiar(Number(mas.dataset.mas), 1);
  if (menos) cambiar(Number(menos.dataset.menos), -1);
});

$('carrito-btn').addEventListener('click', () => panel(true));
$('panel-cerrar').addEventListener('click', () => panel(false));
$('velo').addEventListener('click', () => panel(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') panel(false); });
$('vaciar').addEventListener('click', () => { carrito.clear(); pintarCarrito(); });

filtrar();
pintarCarrito();
