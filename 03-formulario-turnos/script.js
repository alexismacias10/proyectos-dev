// Validación de un formulario de turnos, sin backend.
const form = document.getElementById('turno');
const resumen = document.getElementById('resumen');

const reglas = {
  nombre: v => v.trim().length >= 3 || 'Ingresá al menos 3 letras.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'El email no es válido.',
  fecha: v => {
    if (!v) return 'Elegí una fecha.';
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const elegida = new Date(v + 'T00:00');
    return elegida >= hoy || 'La fecha no puede ser pasada.';
  },
  hora: v => !!v || 'Elegí un horario.',
};

function validarCampo(campo) {
  const resultado = reglas[campo.name](campo.value);
  const error = form.querySelector(`[data-for="${campo.name}"]`);
  error.textContent = resultado === true ? '' : resultado;
  campo.classList.toggle('invalido', resultado !== true);
  return resultado === true;
}

// Valida al salir de cada campo, así el error aparece sin esperar al envío.
Object.keys(reglas).forEach(name => {
  const campo = form.elements[name];
  campo.addEventListener('blur', () => validarCampo(campo));
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const validos = Object.keys(reglas).map(name => validarCampo(form.elements[name]));
  if (!validos.every(Boolean)) return;

  const { nombre, fecha, hora } = Object.fromEntries(new FormData(form));
  const dia = new Date(fecha + 'T00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('resumen-texto').textContent = `${nombre}, te esperamos el ${dia} a las ${hora} hs.`;
  form.hidden = true;
  resumen.hidden = false;
});

document.getElementById('nuevo').addEventListener('click', () => {
  form.reset();
  form.hidden = false;
  resumen.hidden = true;
});
