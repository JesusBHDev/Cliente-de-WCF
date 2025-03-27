namespace app {
  export interface interfazUsuario {
    ID: number;
    Nombre: string;
    ApellidoP: string;
    ApellidoM: string;
    Correo: string;
    FechaNac?: Date;
    FechaRegistro?: Date;
    Activo: boolean;
    FechaMod?: Date;
  }

  export class DatosUsuarios {
    usuarios: Map<number, interfazUsuario>;
    private ultimaFechaConsulta: Date | null = null;

    constructor() {
      this.usuarios = new Map<number, interfazUsuario>();
    }

    cargarUsuarios2(callback: () => void): void {
      let url = "http://localhost:52127/Services/Usuarios.svc/ObtenerUsuarios";

      if (this.ultimaFechaConsulta) {
        const fechaISO = this.ultimaFechaConsulta.toISOString();
        url += `?ultimaFechaConsulta=${fechaISO}`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const usuariosArray = data.ObtenerUsuariosResult;
          console.log("Datos obtenidos:", data);

          for (let i = 0; i < usuariosArray.length; i++) {
            let usuarioJson = usuariosArray[i];
            var usuario: interfazUsuario = <interfazUsuario>{};

            usuario.ID = usuarioJson.ID;
            usuario.Nombre = usuarioJson.Nombre;
            usuario.ApellidoP = usuarioJson.ApellidoP;
            usuario.ApellidoM = usuarioJson.ApellidoM;
            usuario.Correo = usuarioJson.Correo;
            usuario.FechaNac = new Date(usuarioJson.FechaNac);
            usuario.FechaRegistro = new Date(usuarioJson.FechaRegistro);
            usuario.Activo = usuarioJson.Activo;
            usuario.FechaMod = new Date(usuarioJson.FechaMod);

            if (!usuario.Activo) {
              if (this.usuarios.has(usuario.ID)) {
                this.usuarios.delete(usuario.ID);
              }
              continue;
            }

            this.usuarios.set(usuario.ID, usuario);
          }

          // 🚀 Actualizar la fecha de la última consulta con la fecha actual
          this.ultimaFechaConsulta = new Date();
          console.log("Nueva última fecha de consulta:", this.ultimaFechaConsulta.toISOString());

          callback();
        })
        .catch((error) => {
          console.error("Error al cargar usuarios:", error);
        });
    }



    //listo
    guardarUsuario(
      usuarioEditando: interfazUsuario | null,
      esNuevoUsuario: boolean,
      datosUsuario: {
        Nombre: string;
        ApellidoP: string;
        ApellidoM: string;
        Correo: string;
        FechaNac: Date;
      },
      callback: (usuario: interfazUsuario | null) => void
    ) {
      if (esNuevoUsuario) {
        this.agregarUsuario(datosUsuario, callback);
      } else if (usuarioEditando) {
        this.editarUsuario(usuarioEditando, datosUsuario, callback);
      }
    }

    agregarUsuario(
      datosUsuario: { 
        Nombre: string;
        ApellidoP: string;
        ApellidoM: string;
        Correo: string,
        FechaNac: Date },
      callback: (usuario: interfazUsuario | null) => void
    ) {
      const fechaISO = datosUsuario.FechaNac.toISOString();
      const nuevoUsuario = {
        nuevoUsuario: {
          ID: 0,
          Nombre: datosUsuario.Nombre,
          ApellidoP: datosUsuario.ApellidoP,
          ApellidoM: datosUsuario.ApellidoM,
          Correo: datosUsuario.Correo,
          FechaNac: fechaISO,
          Activo: true
        }
      };
      return fetch("http://localhost:52127/Services/Usuarios.svc/AgregarUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario)
      })
        .then(response => {
          if (!response.ok) throw new Error(`Error: ${response.statusText}`);
          return response.json();
        })
        .then(data => {
          if (!data?.AgregarUsuarioResult) {
            console.error("No se pudo agregar el usuario");
            return callback(null);
          }
          callback({
            ...nuevoUsuario.nuevoUsuario,
            FechaNac: new Date(fechaISO)
          });
        })
        .catch(error => {
          console.error("Error en la solicitud:", error);
          callback(null);
        });

    }

    editarUsuario(
      usuarioEditando: interfazUsuario,
      datosUsuario: {
        Nombre: string;
        ApellidoP: string;
        ApellidoM: string;
        Correo: string;
        FechaNac: Date;
      },
      callback: (usuario: interfazUsuario) => void
    ) {
      // Actualizar los datos del usuario en la aplicación
      usuarioEditando.Nombre = datosUsuario.Nombre;
      usuarioEditando.ApellidoP = datosUsuario.ApellidoP;
      usuarioEditando.ApellidoM = datosUsuario.ApellidoM;
      usuarioEditando.Correo = datosUsuario.Correo;
      usuarioEditando.FechaNac = datosUsuario.FechaNac;

      // Realizar la actualización en el backend con fetch
      const usuarioParaActualizar = {
        usuario: usuarioEditando
      };

      fetch("http://localhost:52127/Services/Usuarios.svc/ActualizarUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: usuarioEditando })
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.usuarios.set(usuarioEditando.ID, data); // Usar el objeto actualizado del backend
            callback(data);
          } else {
            console.error("No se pudo actualizar el usuario");
            callback(null);
          }
        })
        .catch(error => {
          console.error("Error al actualizar usuario:", error);
          callback(null);
        });

    }


    borrarUsuario(idUsuario: number, callback: () => void): void {
      // Primero, eliminamos el usuario localmente de la colección
      if (this.usuarios.has(idUsuario)) {
        this.usuarios.delete(idUsuario);

        // Luego, hacemos la solicitud a la API para eliminar el usuario en la base de datos
        fetch("http://localhost:52127/Services/Usuarios.svc/EliminarUsuario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ usuarioID: idUsuario })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error al eliminar el usuario: ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            if (data) {
              console.log("Usuario eliminado correctamente desde la base de datos.");
              callback();  // Llamamos al callback después de eliminar el usuario en la base de datos
            } else {
              console.error("No se pudo eliminar el usuario desde la base de datos.");
            }
          })
          .catch(error => {
            console.error("Error al eliminar el usuario:", error);
          });
      } else {
        console.error("Usuario no encontrado en la colección local.");
      }
    }


  }
}
