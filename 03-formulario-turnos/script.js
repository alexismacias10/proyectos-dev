// Asistente de 3 pasos para reservar turnos. Todo en el navegador, sin backend.
const SERVICIOS = [
  { id: 'consulta', nombre: 'Consulta general', detalle: '30 min' },
  { id: 'control', nombre: 'Control', detalle: '15 min' },
  { id: 'estudio', nombre: 'Estudio de imagen', detalle: '45 min' },
];
const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];

const form = document.getElementById('turno');
const pasosUI = [...document.querySelectorAll('#pasos li')];
const secciones = [...form.querySelectorAll('.paso')];
const btnAtras = document.getElementById('atras');
const btnSig = document.getElementById('siguiente');
const estado = { paso: 1, servicio: null, fecha: '', hora: '' };

// Paso 1: generar tarjetas de servicio
document.getElementById('servicios').innerHTML = SERVICIOS.map(s => `
  <label class="opcion">
    <input type="radio" name="servicio" value="${s.id}">
    <span><strong>${s.nombre}</strong><small>${s.detalle}</small></span>
  </label>`).join('');

// Paso 2: horarios como chips, se activan al tocar
const contHorarios = document.getElementById('horarios');
const fechaInput = form.elements.fecha;
fechaInput.min = new Date().toISOString().slice(0, 10);

fechaInput.addEventListener('change', () => {
  estado.fecha = fechaInput.value;
  estado.hora = '';
  contHorarios.innerHTML = HORARIOS.map(h =>
    `<button type="button" class="chip" aria-pressed="false" data-hora="${h}">${h}</button>`).join('');
});
contHorarios.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  contHorarios.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
  chip.setAttribute('aria-pressed', 'true');
  estado.hora = chip.dataset.hora;
});

// Validación por paso: devuelve un mensaje de error o null si está bien
function validar(paso) {
  const errores = {};
  if (paso === 1 && !form.servicio.value) errores.servicio = 'Elegí un servicio.';
  if (paso === 2) {
    if (!estado.fecha) errores.fecha = 'Elegí una fecha.';
    else if (estado.fecha < fechaInput.min) errores.fecha = 'La fecha no puede ser pasada.';
    if (!estado.hora) errores.hora = 'Elegí un horario.';
  }
  if (paso === 3) {
    const nombre = form.elements.nombre.value.trim();
    const email = form.elements.email.value.trim();
    if (nombre.length < 3) errores.nombre = 'Ingresá tu nombre completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.email = 'El email no es válido.';
  }
  form.querySelectorAll('.error').forEach(el => el.textContent = '');
  Object.entries(errores).forEach(([campo, msg]) => {
    form.querySelector(`[data-error="${campo}"]`).textContent = msg;
  });
  return Object.keys(errores).length === 0;
}

function mostrarPaso(n) {
  estado.paso = n;
  secciones.forEach(s => s.hidden = Number(s.dataset.paso) !== n);
  pasosUI.forEach((li, i) => {
    li.classList.toggle('activo', i + 1 === n);
    li.classList.toggle('hecho', i + 1 < n);
  });
  btnAtras.hidden = n === 1;
  btnSig.textContent = n === 3 ? 'Confirmar turno' : 'Continuar';
}

btnSig.addEventListener('click', () => {
  if (!validar(estado.paso)) return;
  if (estado.paso < 3) return mostrarPaso(estado.paso + 1);
  confirmar();
});
btnAtras.addEventListener('click', () => mostrarPaso(estado.paso - 1));

// Confirmación: muestra el ticket con los datos
function confirmar() {
  const servicio = SERVICIOS.find(s => s.id === form.servicio.value);
  const nombre = form.elements.nombre.value.trim();
  const fecha = new Date(estado.fecha + 'T00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('t-servicio').textContent = servicio.nombre;
  document.getElementById('t-fecha').textContent = `${fecha} · ${estado.hora} hs`;
  document.getElementById('t-nombre').textContent = nombre;
  form.hidden = true;
  document.querySelector('.barra').hidden = true;
  document.getElementById('pasos').hidden = true;
  document.getElementById('ticket').hidden = false;
  ultimoTurno = { titulo: servicio.nombre, fecha: estado.fecha, hora: estado.hora, nombre };
}

// Descarga un archivo .ics para agregar el turno al calendario
let ultimoTurno = null;
document.getElementById('ics').addEventListener('click', () => {
  const [y, m, d] = ultimoTurno.fecha.split('-');
  const [hh, mm] = ultimoTurno.hora.split(':');
  const inicio = `${y}${m}${d}T${hh}${mm}00`;
  const fin = `${y}${m}${d}T${String(+hh + 1).padStart(2, '0')}${mm}00`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Reserva de turnos//ES',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@reserva-turnos`,
    `DTSTART:${inicio}`, `DTEND:${fin}`,
    `SUMMARY:${ultimoTurno.titulo} - ${ultimoTurno.nombre}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'turno.ics' });
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('nuevo').addEventListener('click', () => {
  form.reset();
  estado.servicio = null; estado.fecha = ''; estado.hora = '';
  contHorarios.innerHTML = '<span class="hint">Primero elegí una fecha.</span>';
  form.hidden = false;
  document.querySelector('.barra').hidden = false;
  document.getElementById('pasos').hidden = false;
  document.getElementById('ticket').hidden = true;
  mostrarPaso(1);
});

mostrarPaso(1);
