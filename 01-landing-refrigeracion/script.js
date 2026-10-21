// Servicios: se generan desde un array para que sea fácil agregar o cambiar uno.
const servicios = [
  { titulo: 'Lavarropas', detalle: 'Todas las marcas y modelos' },
  { titulo: 'Heladeras y freezers', detalle: 'Soluciones rápidas y efectivas' },
  { titulo: 'Aires acondicionados', detalle: 'Reparación e instalación, hogar y comercio' },
  { titulo: 'Carga de gas automotor', detalle: 'Rápido y seguro' },
];

const grid = document.getElementById('servicios-lista');
grid.innerHTML = servicios
  .map(s => `<article class="card"><div class="icono">${s.titulo[0]}</div><h3>${s.titulo}</h3><p>${s.detalle}</p></article>`)
  .join('');

// Formulario: valida y arma un mensaje para WhatsApp.
const form = document.getElementById('formulario');
const msg = form.querySelector('.msg');

form.addEventListener('submit', e => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));
  if (!form.checkValidity()) {
    msg.textContent = 'Revisá los datos: el nombre y el teléfono son obligatorios.';
    return;
  }
  const texto = `Hola! Soy ${datos.nombre}. Necesito presupuesto de ${datos.servicio}. Mi teléfono: ${datos.telefono}`;
  window.open(`https://wa.me/5493816443138?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  msg.textContent = '';
  form.reset();
});
