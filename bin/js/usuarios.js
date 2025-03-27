var app;
(function (app) {
    class Usuario {
        constructor() {
            this.usuarioEditando = null;
            this.idEliminar = null;
            this.ordenAscendente = true;
            this.columnaOrdenada = null;
            this.contadorTiempo = 0;
            this.intervaloCronometro = null;
            this.formatearFecha = d3.timeFormat("%d/%m/%Y %H:%M");
            this.formatearFecha2 = d3.timeFormat("%d/%m/%Y");
            this.datosUsuario = new app.DatosUsuarios();
            const bodyUsuario = d3.select("body");
            //=======================================================0aqui empieza el modal de la tabla de usuarios
            this.ContenedorUsuario = bodyUsuario
                .append("div")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0, 0, 0, 0.5)")
                .style("z-index", "9999");
            let modalContent = this.ContenedorUsuario.append("div")
                .style("background-color", "white")
                .style("width", "900px")
                .style("height", "600px")
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("margin", "-300px 0 0 -450px");
            let encabezadoModalUsuario = modalContent
                .append("div")
                .style("background-color", "#012E4A")
                .style("width", "auto")
                .style("height", "50px")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center")
                .style("padding", "10px");
            encabezadoModalUsuario
                .append("span")
                .text("Formulario de usuarios")
                .style("color", "white")
                .style("font-size", "1.5rem")
                .style("font-weight", "bold");
            this.inputBusqueda = (encabezadoModalUsuario
                .append("input")
                .attr("placeholder", "Buscar usuario...")
                .style("margin-right", "10px")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .style("border", "1px solid #ccc")
                .on("keyup", () => {
                this.actualizarTabla();
            }));
            encabezadoModalUsuario
                .append("button")
                .text("📁Agregar Nuevo")
                .style("background-color", "#81BECE")
                .style("color", "#black")
                .style("cursor", "pointer")
                .on("click", () => this.mostrarModalNuevoUsuario());
            let contenedorRecarga = encabezadoModalUsuario.append("div").style("display", "flex").style("align-items", "center");
            contenedorRecarga
                .append("button")
                .text("♻️ Recargar")
                .style("background-color", "#81BECE")
                .style("color", "black")
                .style("cursor", "pointer")
                .style("margin-right", "10px")
                .on("click", () => this.reiniciarCronometro());
            this.etiquetaTiempo = contenedorRecarga
                .append("span")
                .text("Tiempo: 0s")
                .style("font-size", "14px")
                .style("color", "white");
            encabezadoModalUsuario
                .append("button")
                .text("Cerrar ❎ ")
                .style("background-color", "red")
                .style("color", "white")
                .style("cursor", "pointer")
                .on("click", () => this.ocultar());
            //=======================================================0aqui empieza el modal de edicion de un usuario
            this.ContenedorEdicion = bodyUsuario
                .append("div")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0, 0, 0, 0.5)")
                .style("display", "none") // Oculto por defecto
                .style("z-index", "10000");
            let modalEdicionContent = this.ContenedorEdicion.append("div")
                .style("background-color", "white")
                .style("width", "400px")
                .style("padding", "20px")
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("border-radius", "10px");
            let encabezadoEdicion = modalEdicionContent
                .append("div")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center")
                .style("margin-bottom", "15px");
            this.titulo = encabezadoEdicion
                .append("span")
                .style("font-size", "1.5rem")
                .style("font-weight", "bold");
            encabezadoEdicion
                .append("button")
                .text("✖")
                .style("background", "red")
                .style("color", "white")
                .style("border", "none")
                .style("cursor", "pointer")
                .on("click", () => this.ocultarModalEdicion());
            this.inputNombre = (modalEdicionContent
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "Nombre")
                .style("width", "90%")
                .style("margin-bottom", "10px")
                .style("padding", "8px"));
            this.inputApellidoP = (modalEdicionContent
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "Apellido Paterno")
                .style("width", "90%")
                .style("margin-bottom", "10px")
                .style("padding", "8px"));
            this.inputApellidoM = (modalEdicionContent
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "Apellido Materno")
                .style("width", "90%")
                .style("margin-bottom", "10px")
                .style("padding", "8px"));
            this.inputCorreo = (modalEdicionContent
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "correo electronico")
                .style("width", "90%")
                .style("margin-bottom", "10px")
                .style("padding", "8px"));
            this.inputFechaNacimiento = modalEdicionContent
                .append("input")
                .attr("type", "date")
                .style("width", "90%")
                .style("margin-bottom", "10px")
                .style("padding", "8px");
            modalEdicionContent
                .append("button")
                .text("Guardar Cambios")
                .style("background-color", "#81BECE")
                .style("color", "black")
                .style("border", "none")
                .style("padding", "10px")
                .style("cursor", "pointer")
                .style("width", "100%")
                .on("click", () => this.guardarCambios());
            //=======================================================0aqui se dibuja la tabla
            this.TablaUsuarios = (modalContent
                .append("table")
                .style("width", "100%")
                .style("height", "83%")
                .style("border-collapse", "collapse"));
            const encabezados = [
                { label: "Nombre", key: "Nombre" },
                { label: "Apellido P", key: "ApellidoP" },
                { label: "Apellido M", key: "ApellidoM" },
                { label: "Correo", key: "Correo" },
                { label: "Fecha Nac", key: "FechaNac" },
                { label: "Fecha Registro", key: "FechaRegistro" },
                { label: "Fecha Modificacion", key: "FechaMod" },
                { label: "control", key: null },
            ];
            this.TablaUsuarios.append("thead")
                .append("tr")
                .selectAll("th")
                .data(encabezados) // 📌 Usamos la variable en lugar de escribir los datos manualmente
                .enter()
                .append("th")
                .text((d) => d.label)
                .style("border", "1px solid black")
                .style("padding", "8px")
                .style("background-color", "#378BA4")
                .style("cursor", (d) => (d.key ? "pointer" : "default")) // Solo los ordenables tienen cursor pointer
                .on("click", (event, d) => {
                console.log("Clic en encabezado:", d); // 👀 Verificar qué se está pasando
                if (d.key) {
                    console.log("Ordenando por:", d.key);
                    this.ordenarPorColumna(d.key);
                }
            });
            //_______________________________advertencia de eliminar un ussuario
            this.advertenciaEliminar = bodyUsuario
                .append("div")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("display", "none")
                .style("background-color", "rgba(0, 0, 0, 0.5)")
                .style("z-index", "9999");
            let modalAdvertencia = this.advertenciaEliminar
                .append("div")
                .style("background-color", "white")
                .style("width", "400px")
                .style("padding", "20px")
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("border-radius", "10px")
                .style("box-shadow", "0px 4px 10px rgba(0, 0, 0, 0.2)")
                .style("display", "flex")
                .style("flex-direction", "column")
                .style("align-items", "center");
            // ✅ Texto del modal
            modalAdvertencia
                .append("span")
                .text("⚠️ ¿Estás seguro de que quieres eliminar este usuario?")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .style("text-align", "center")
                .style("margin-bottom", "20px");
            // ✅ Contenedor para los botones
            let contenedorBotones = modalAdvertencia
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");
            // ✅ Botón de eliminar
            contenedorBotones
                .append("button")
                .text("🗑️ Eliminar")
                .style("background-color", "#e74c3c")
                .style("color", "white")
                .style("border", "none")
                .style("padding", "10px 20px")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .on("mouseover", function () {
                d3.select(this).style("background-color", "#c0392b");
            })
                .on("mouseout", function () {
                d3.select(this).style("background-color", "#e74c3c");
            })
                .on("click", () => {
                if (this.idEliminar !== null) {
                    this.eliminarUsuario();
                    this.idEliminar = null;
                }
            });
            // ✅ Botón de cancelar
            contenedorBotones
                .append("button")
                .text("❌ Cancelar")
                .style("background-color", "#bdc3c7")
                .style("color", "black")
                .style("border", "none")
                .style("padding", "10px 20px")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .on("mouseover", function () {
                d3.select(this).style("background-color", "#95a5a6");
            })
                .on("mouseout", function () {
                d3.select(this).style("background-color", "#bdc3c7");
            })
                .on("click", () => this.cancelarEliminar());
            this.iniciarCronometro();
            this.actualizarTabla();
        }
        ordenarPorColumna(columna) {
            console.log("Ejecutando ordenarPorColumna con:", columna);
            // ✅ Si la columna ya estaba seleccionada, invertir el orden
            if (this.columnaOrdenada === columna) {
                this.ordenAscendente = !this.ordenAscendente;
            }
            else {
                // ✅ Si es una nueva columna, ordenar de forma ascendente por defecto
                this.ordenAscendente = true;
                this.columnaOrdenada = columna;
            }
            // ✅ Convertir el Map a un Array para ordenarlo
            let usuariosArray = Array.from(this.datosUsuario.usuarios.values());
            console.log(usuariosArray);
            // ✅ Función de comparación mejorada
            const compararUsuarios = (a, b) => {
                let valorA = a[columna];
                let valorB = b[columna];
                if (columna === "FechaRegistro") {
                    // 📌 Si es fecha, comparar por milisegundos
                    return this.ordenAscendente
                        ? valorA.getTime() - valorB.getTime()
                        : valorB.getTime() - valorA.getTime();
                }
                else {
                    // 📌 Si no es fecha, comparar como texto
                    return this.ordenAscendente ? String(valorA).localeCompare(String(valorB)) : String(valorB).localeCompare(String(valorA));
                }
            };
            usuariosArray.sort(compararUsuarios);
            this.actualizarTabla(usuariosArray);
        }
        actualizarTabla(usuariosOrdenados) {
            let usuarioBuscado = usuariosOrdenados !== null && usuariosOrdenados !== void 0 ? usuariosOrdenados : Array.from(this.datosUsuario.usuarios.values());
            let termino = this.inputBusqueda.property("value").trim().toLowerCase();
            if (termino) {
                usuarioBuscado = usuarioBuscado.filter((usuario) => {
                    return (usuario.Nombre.toLowerCase().includes(termino) ||
                        usuario.ApellidoP.toLowerCase().includes(termino) ||
                        usuario.ApellidoM.toLowerCase().includes(termino));
                });
            }
            let tbody = this.TablaUsuarios.select("tbody");
            if (tbody.empty()) {
                tbody = this.TablaUsuarios.append("tbody");
            }
            let filas = tbody
                .selectAll("tr")
                .data(usuarioBuscado, (d) => d.ID);
            // ✅ ENTER: Agregar nuevas filas
            let filasEnter = filas.enter().append("tr");
            filasEnter.each((d, i, nodes) => {
                let fila = d3.select(nodes[i]);
                const valoresSinID = [
                    d.Nombre,
                    d.ApellidoP,
                    d.ApellidoM,
                    d.Correo,
                    this.formatearFecha2(d.FechaNac),
                    this.formatearFecha(d.FechaRegistro),
                    this.formatearFecha(d.FechaMod),
                ];
                valoresSinID.forEach((valor) => {
                    fila
                        .append("td")
                        .text(String(valor))
                        .style("border", "1px solid black")
                        .style("padding", "8px")
                        .style("text-align", "center");
                });
                let celdaBotones = fila
                    .append("td")
                    .style("border", "1px solid black")
                    .style("padding", "8px");
                celdaBotones
                    .append("button")
                    .text("✏️ Editar")
                    .style("margin-right", "10px")
                    .style("background-color", "#81BECE")
                    .style("cursor", "pointer")
                    .on("click", () => this.mostrarModalEdicion(d));
                celdaBotones
                    .append("button")
                    .text("🗑️ Eliminar")
                    .style("background-color", "red")
                    .style("color", "white")
                    .style("cursor", "pointer")
                    .on("click", () => this.abrirAdvertencia(d.ID));
            });
            // 🔄 UPDATE: Actualizar celdas en filas existentes
            filas.each((d, i, nodes) => {
                let fila = d3.select(nodes[i]);
                const valoresSinID = [
                    d.Nombre,
                    d.ApellidoP,
                    d.ApellidoM,
                    d.Correo,
                    this.formatearFecha2(d.FechaNac),
                    this.formatearFecha(d.FechaRegistro),
                    this.formatearFecha(d.FechaMod),
                ];
                fila
                    .selectAll("td:not(:last-child)")
                    .data(valoresSinID)
                    .text((d) => String(d));
            });
            // 📌 FORZAR EL REORDENAMIENTO DE LAS FILAS
            filas.order(); // 🚀 Esta línea hará que D3 reorganice las filas en el DOM según los datos
            // 🛑 EXIT: Eliminar filas que ya no tienen datos
            filas.exit().transition().duration(500).style("opacity", 0).remove();
        }
        abrirAdvertencia(id) {
            this.idEliminar = id;
            this.advertenciaEliminar.style("display", "block");
        }
        eliminarUsuario() {
            if (this.idEliminar !== null) {
                this.datosUsuario.borrarUsuario(this.idEliminar, () => {
                    this.actualizarTabla();
                    this.advertenciaEliminar.style("display", "none");
                    this.idEliminar = null;
                });
            }
        }
        cancelarEliminar() {
            this.advertenciaEliminar.style("display", "none");
        }
        ocultar() {
            this.ContenedorUsuario.style("display", "none");
        }
        mostrarModalEdicion(EditandoUsuario) {
            this.usuarioEditando = EditandoUsuario;
            this.inputNombre.property("value", EditandoUsuario.Nombre);
            this.inputApellidoP.property("value", EditandoUsuario.ApellidoP);
            this.inputApellidoM.property("value", EditandoUsuario.ApellidoM);
            this.inputCorreo.property("value", EditandoUsuario.Correo);
            // ✅ Convertir la fecha al formato correcto "YYYY-MM-DD"
            const FechaNac = EditandoUsuario.FechaNac;
            const año = FechaNac.getFullYear();
            const mes = String(FechaNac.getMonth() + 1).padStart(2, "0");
            const dia = String(FechaNac.getDate()).padStart(2, "0");
            this.inputFechaNacimiento.property("value", `${año}-${mes}-${dia}`);
            this.titulo.text("Editar Usuario");
            this.ContenedorEdicion.style("display", "block");
        }
        mostrarModalNuevoUsuario() {
            this.esNuevoUsuario = true;
            this.inputNombre.property("value", "");
            this.inputApellidoP.property("value", "");
            this.inputApellidoM.property("value", "");
            this.inputCorreo.property("value", "");
            this.inputFechaNacimiento.property("value", "");
            this.titulo.text("Agregar Nuevo Usuario");
            this.ContenedorEdicion.style("display", "block");
        }
        guardarCambios() {
            let nombre = this.inputNombre.property("value").trim();
            let apellidoP = this.inputApellidoP.property("value").trim();
            let apellidoM = this.inputApellidoM.property("value").trim();
            let Correo = this.inputCorreo.property("value").trim();
            let fechaNacStr = this.inputFechaNacimiento.property("value");
            let [year, month, day] = fechaNacStr.split("-").map(Number);
            let now = new Date();
            let FechaNac = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());
            this.datosUsuario.guardarUsuario(this.usuarioEditando, this.esNuevoUsuario, {
                Nombre: nombre,
                ApellidoP: apellidoP,
                ApellidoM: apellidoM,
                Correo: Correo,
                FechaNac: FechaNac
            }, (usuarioActualizado) => {
                if (!usuarioActualizado)
                    return;
                this.datosUsuario.cargarUsuarios2(() => {
                    this.actualizarTabla();
                    this.ocultarModalEdicion();
                    this.esNuevoUsuario = false;
                });
            });
        }
        ocultarModalEdicion() {
            this.ContenedorEdicion.style("display", "none");
            this.usuarioEditando = null;
        }
        cargarUsuarios() {
            this.datosUsuario.cargarUsuarios2(() => {
                this.actualizarTabla();
            });
        }
        iniciarCronometro() {
            // Si ya hay un intervalo corriendo, lo detenemos primero
            if (this.intervaloCronometro) {
                clearInterval(this.intervaloCronometro);
            }
            // Reiniciar contador
            this.contadorTiempo = 0;
            // Actualizar la visualización inicial
            this.actualizarVisualizacionTiempo();
            // Iniciar un nuevo intervalo
            this.intervaloCronometro = setInterval(() => {
                this.contadorTiempo++;
                this.actualizarVisualizacionTiempo();
            }, 1000);
        }
        actualizarVisualizacionTiempo() {
            const minutos = Math.floor(this.contadorTiempo / 60);
            const segundos = this.contadorTiempo % 60;
            if (minutos > 0) {
                this.etiquetaTiempo.text(`Tiempo: ${minutos}m ${segundos}s`);
            }
            else {
                this.etiquetaTiempo.text(`Tiempo: ${segundos}s`);
            }
        }
        reiniciarCronometro() {
            this.cargarUsuarios(); // Recarga los datos de los usuarios
            this.iniciarCronometro(); // Reinicia el cronómetro
        }
    }
    app.Usuario = Usuario;
})(app || (app = {}));
//# sourceMappingURL=usuarios.js.map