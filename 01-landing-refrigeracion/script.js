// Número de ejemplo: reemplazalo por el real (código de país + área + número, sin signos).
const WHATSAPP = '5491155550123';

const ICONOS = {
  'Lavarropas': '<circle cx="12" cy="13" r="5"/><rect x="3" y="2" width="18" height="20" rx="2"/><path d="M7 6h.01M11 6h.01"/>',
  'Heladeras y freezers': '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14M9 6v1.5M9 13v3"/>',
  'Aires acondicionados': '<rect x="2" y="4" width="20" height="9" rx="2"/><path d="M6 17c0 1.5-1 2-1 3M12 17c0 1.5-1 2-1 3M18 17c0 1.5-1 2-1 3"/>',
  'Carga de gas automotor': '<path d="M5 17h14l-1.5-6h-11zM3 17h18v3H3zM7 11l1.5-4h7L17 11"/>',
};

// Servicios: se generan desde un array para que sea fácil agregar o cambiar uno.
const servicios = [
  { titulo: 'Lavarropas', detalle: 'Todas las marcas y modelos' },
  { titulo: 'Heladeras y freezers', detalle: 'Soluciones rápidas y efectivas' },
  { titulo: 'Aires acondicionados', detalle: 'Reparación e instalación, hogar y comercio' },
  { titulo: 'Carga de gas automotor', detalle: 'Rápido y seguro' },
];

const grid = document.getElementById('servicios-lista');
grid.innerHTML = servicios
  .map(s => `
    <article class="card">
      <div class="icono"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[s.titulo]}</svg></div>
      <h3>${s.titulo}</h3>
      <p>${s.detalle}</p>
    </article>`)
  .join('');

document.querySelectorAll('[data-wa]').forEach(a => { a.href = `https://wa.me/${WHATSAPP}`; });

// Formulario: valida y arma un mensaje para WhatsApp.
const form = document.getElementById('formulario');
const msg = form.querySelector('.msg');

form.addEventListener('submit', e => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  if (!form.checkValidity()) {
    msg.textContent = 'Revisá los datos: nombre, teléfono y servicio son obligatorios.';
    return;
  }
  const texto = `Hola! Soy ${datos.nombre}. Necesito presupuesto de ${datos.servicio}. Mi teléfono: ${datos.telefono}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  msg.textContent = '';
  form.reset();
});
