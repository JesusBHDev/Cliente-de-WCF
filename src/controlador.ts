namespace app {
  export class Controlador {
    controladorcontainer: d3.Selection<
      d3.BaseType,
      unknown,
      HTMLDivElement,
      any
    >;

    constructor() {
      let bodyController = d3
        .select("body")
        .style("margin-top", "0")
        .style("margin", "0");

      this.controladorcontainer = <
        d3.Selection<any, unknown, HTMLDivElement, any>
      >bodyController
        .append("div")
        .style("background-color", "#00182c")
        .style("width", "auto")
        .style("height", "100px")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center");

      const encabezadoController = this.controladorcontainer
        .append("h1")
        .text("Cálculo de área y perímetro de Figuras")
        .style("margin", "0")
        .style("color", "white");

      const cuerpoController = bodyController
        .append("div")
        .style("background-color", "rgba(180, 180, 180, 0.57)")
        .style("width", "100%")
        .style("height", "100vh");

      const botonesContainer = cuerpoController
        .append("div")
        .style("width", "300px")
        .style("height", "200px")
        .style("position", "absolute")
        .style("top", "25%")
        .style("left", "50%")
        .style("margin", "-100px 0 0 -150px")
        .style("text-align", "center");

      botonesContainer
        .append("button")
        .text("Rectángulo")
        .style("background-color", "#00182c")
        .style("color", "white")
        .style("border", "none")
        .style("padding", "10px 20px")
        .style("border-radius", "5px")
        .style("cursor", "pointer")
        .style("display", "block")
        .style("margin", "10px auto")
        .on("click", () => {
          this.abrirRectangulo();
        });

      botonesContainer
        .append("button")
        .text("Usuario")
        .style("background-color", "rgba(12, 70, 0, 1)")
        .style("color", "white")
        .style("border", "none")
        .style("padding", "10px 20px")
        .style("border-radius", "5px")
        .style("cursor", "pointer")
        .style("display", "block")
        .style("margin", "10px auto")
        .on("click", () => {
          this.abrirUsuario();
        });


    }



    private rectangleView: app.Rectangulo;

    private abrirRectangulo(): void {
      if (!this.rectangleView) {
        this.rectangleView = new Rectangulo();
      } else {
        this.rectangleView.rectangleContainer.style("display", "block");
      }
    }

    private UsuarioView: app.Usuario;

    private abrirUsuario(): void {
      if (!this.UsuarioView) {
        this.UsuarioView = new Usuario();
        this.UsuarioView.cargarUsuarios();
      } else {
        this.UsuarioView.ContenedorUsuario.style("display", "block");
      }
    }
  }
}

const appController: app.Controlador = new app.Controlador();
