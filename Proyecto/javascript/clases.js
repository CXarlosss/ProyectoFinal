export class ComercioActividad {
    constructor(
      id,              // ← Recuerda poner 'id' aquí
      nombre,
      descripcion,
      precio,
      valoracion,
      ubicacion,
      horario,
      tipo,
      metodoPago,
      categoria,
      imagen,
      sitioWeb,
      disponible,
      comentarios
    ) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.precio = precio;
      this.valoracion = valoracion;
      this.ubicacion = ubicacion;
      this.horario = horario;
      this.tipo = tipo;
      this.metodoPago = metodoPago;
      this.categoria = categoria;
      this.imagen = imagen;
      this.sitioWeb = sitioWeb;
      this.disponible = disponible;
      this.comentarios = comentarios;
    }
  }
  
  
export class Usuario {
    constructor(
      id,
      nombre,
      email,
      contrasena,
      telefono,
      direccion,
      tipoUsuario,
      valoraciones
    ) {
      this.id = id;
      this.nombre = nombre;
      this.email = email;
      this.contrasena = contrasena;
      this.telefono = telefono;
      this.direccion = direccion;
      this.tipoUsuario = tipoUsuario;
      this.valoraciones = valoraciones;
    }
  }
  