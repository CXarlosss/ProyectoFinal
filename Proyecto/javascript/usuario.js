import { ComercioActividad, Usuario } from './clases.js';

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a botones y secciones
  const btnComercio = document.getElementById('btn-comercio');
  const btnUsuario = document.getElementById('btn-usuario');
  const formularioComercio = document.getElementById('formulario-comercio');
  const formularioUsuario = document.getElementById('formulario-usuario');
  const seleccionInicial = document.getElementById('seleccion-inicial');
  const comercioInfo = document.getElementById('comercio-info');
  const usuarioInfo = document.getElementById('usuario-info');

  // Variables para almacenar instancias
  let comercioActual = null;
  let usuarioActual = null;

  // Mostrar formulario de Comercio
  btnComercio.addEventListener('click', () => {
    if (seleccionInicial) seleccionInicial.classList.add('hidden');
    formularioComercio.classList.remove('hidden');
  });

  // Mostrar formulario de Usuario
  btnUsuario.addEventListener('click', () => {
    if (seleccionInicial) seleccionInicial.classList.add('hidden');
    formularioUsuario.classList.remove('hidden');
  });

  // Registrar Comercio
  const formComercio = document.getElementById('comercio-form');
  formComercio.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-comercio').value;
    const descripcion = document.getElementById('descripcion-comercio').value;
    const precio = document.getElementById('precio-comercio').value;
    const valoracion = document.getElementById('valoracion-comercio').value;

    // Instancia
    comercioActual = new ComercioActividad(
      Date.now(),
      nombre,
      descripcion,
      precio,
      valoracion,
      "Ubicación de ejemplo",
      "Horario de ejemplo",
      "Tipo de Comercio",
      "Método de Pago",
      "Categoría",
      "Imagen URL",
      "Sitio Web",
      "Disponible",
      []
    );

    // Ocultamos el formulario
    formularioComercio.classList.add('hidden');

    // Mostramos la info con un botón “Editar” en la misma línea
    comercioInfo.innerHTML = `
      <p>
        <strong>Comercio Registrado:</strong> ${comercioActual.nombre}
        <button id="editar-comercio">Editar Comercio</button>
      </p>
    `;

    // Agregar listener al botón “Editar Comercio” recién creado
    const btnEditarComercio = document.getElementById('editar-comercio');
    btnEditarComercio.addEventListener('click', () => {
      editarComercio();
    });
  });

  // Función para editar comercio
  function editarComercio() {
    // Rellenar el formulario con los datos
    document.getElementById('nombre-comercio').value = comercioActual.nombre;
    document.getElementById('descripcion-comercio').value = comercioActual.descripcion;
    document.getElementById('precio-comercio').value = comercioActual.precio;
    document.getElementById('valoracion-comercio').value = comercioActual.valoracion;

    formularioComercio.classList.remove('hidden');

    // Cambiamos el texto del botón de "Registrar Comercio" a "Guardar Cambios"
    // para indicar que estamos en modo edición
    const btnSubmit = formComercio.querySelector('button[type="submit"]');
    btnSubmit.textContent = 'Guardar Cambios';

    // Cuando el formulario se envíe nuevamente, guardamos los cambios
    formComercio.addEventListener('submit', guardarCambiosComercio);
  }

  function guardarCambiosComercio(e) {
    e.preventDefault();

    // Solo hacer esto si el botón dice "Guardar Cambios"
    const btnSubmit = formComercio.querySelector('button[type="submit"]');
    if (btnSubmit.textContent !== 'Guardar Cambios') return;

    // Actualizar datos
    comercioActual.nombre = document.getElementById('nombre-comercio').value;
    comercioActual.descripcion = document.getElementById('descripcion-comercio').value;
    comercioActual.precio = document.getElementById('precio-comercio').value;
    comercioActual.valoracion = document.getElementById('valoracion-comercio').value;

    // Ocultamos el formulario
    formularioComercio.classList.add('hidden');

    // Volvemos a mostrar la info actualizada con botón de Editar
    comercioInfo.innerHTML = `
      <p>
        <strong>Comercio Actualizado:</strong> ${comercioActual.nombre}
        <button id="editar-comercio">Editar Comercio</button>
      </p>
    `;

    // Restaurar el texto del botón a "Registrar Comercio" para la próxima vez
    btnSubmit.textContent = 'Registrar Comercio';

    // Volver a agregar listener de editar
    const btnEditarComercio = document.getElementById('editar-comercio');
    btnEditarComercio.addEventListener('click', () => {
      editarComercio();
    });

    // Removemos este listener para no duplicar eventos
    formComercio.removeEventListener('submit', guardarCambiosComercio);
  }

  // Registrar Usuario
  const formUsuario = document.getElementById('usuario-form');
  formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-usuario').value;
    const email = document.getElementById('email-usuario').value;
    const telefono = document.getElementById('telefono-usuario').value;
    const direccion = document.getElementById('direccion-usuario').value;

    // Instanciamos
    usuarioActual = new Usuario(
      Date.now(),
      nombre,
      email,
      "Contraseña Segura",
      telefono,
      direccion,
      "cliente",
      []
    );

    // Ocultamos el formulario
    formularioUsuario.classList.add('hidden');

    // Mostramos info con un botón “Editar”
    usuarioInfo.innerHTML = `
      <p>
        <strong>Usuario Registrado:</strong> ${usuarioActual.nombre}
        <button id="editar-usuario">Editar Usuario</button>
      </p>
    `;

    const btnEditarUsuario = document.getElementById('editar-usuario');
    btnEditarUsuario.addEventListener('click', () => {
      editarUsuario();
    });
  });

  // Función para editar usuario
  function editarUsuario() {
    // Rellenar form
    document.getElementById('nombre-usuario').value = usuarioActual.nombre;
    document.getElementById('email-usuario').value = usuarioActual.email;
    document.getElementById('telefono-usuario').value = usuarioActual.telefono;
    document.getElementById('direccion-usuario').value = usuarioActual.direccion;

    formularioUsuario.classList.remove('hidden');

    // Cambiar texto del botón a "Guardar Cambios"
    const btnSubmit = formUsuario.querySelector('button[type="submit"]');
    btnSubmit.textContent = 'Guardar Cambios';

    formUsuario.addEventListener('submit', guardarCambiosUsuario);
  }

  function guardarCambiosUsuario(e) {
    e.preventDefault();
    const btnSubmit = formUsuario.querySelector('button[type="submit"]');
    if (btnSubmit.textContent !== 'Guardar Cambios') return;

    // Actualizamos la instancia
    usuarioActual.nombre = document.getElementById('nombre-usuario').value;
    usuarioActual.email = document.getElementById('email-usuario').value;
    usuarioActual.telefono = document.getElementById('telefono-usuario').value;
    usuarioActual.direccion = document.getElementById('direccion-usuario').value;

    // Ocultamos el formulario
    formularioUsuario.classList.add('hidden');

    // Mostramos la info con el nuevo nombre
    usuarioInfo.innerHTML = `
      <p>
        <strong>Usuario Actualizado:</strong> ${usuarioActual.nombre}
        <button id="editar-usuario">Editar Usuario</button>
      </p>
    `;

    // Restaurar el texto del botón a "Registrar Usuario"
    btnSubmit.textContent = 'Registrar Usuario';

    // Volver a agregar listener de editar
    const btnEditarUsuario = document.getElementById('editar-usuario');
    btnEditarUsuario.addEventListener('click', () => {
      editarUsuario();
    });

    formUsuario.removeEventListener('submit', guardarCambiosUsuario);
  }
});
