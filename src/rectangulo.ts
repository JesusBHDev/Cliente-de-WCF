namespace app {
  export class Rectangulo {
    rectangleContainer: d3.Selection<d3.BaseType, unknown, HTMLDivElement, any>;
    txtArea1: d3.Selection<d3.BaseType, unknown, HTMLInputElement, any>;
    txtArea2: d3.Selection<d3.BaseType, unknown, HTMLInputElement, any>;
    txtPeri1: d3.Selection<d3.BaseType, unknown, HTMLInputElement, any>;
    txtPeri2: d3.Selection<d3.BaseType, unknown, HTMLInputElement, any>;
    

    constructor() {
      let bodyRectangulo = d3.select("body");

      // rectangleContainer es un div seleccionado de bodyRectangulo que es el que aparece encima de todo
      this.rectangleContainer = <
        d3.Selection<any, unknown, HTMLDivElement, any>
      >bodyRectangulo
        .append("div")
        .style("position", "fixed")
        .style("top", "0")
        .style("left", "0")
        .style("width", "100%")
        .style("height", "100%")
        .style("background-color", "rgba(0, 0, 0, 0.5)")
        .style("z-index", "9999");

      // Contenedor interno del rectángulo
      let modalContent = this.rectangleContainer
        .append("div")
        .style("background-color", "#a58dea")
        .style("width", "600px")
        .style("height", "500px")
        .style("position", "absolute")
        .style("top", "50%")
        .style("left", "50%")
        .style("margin", "-250px 0 0 -300px")
        .style("border-radius", "10px")
        .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)");

      const encabezadoModalRectangulo = modalContent
        .append("div")
        .style("background-color", "#a58dea")
        .style("width", "auto")
        .style("height", "10%")
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("align-items", "center")
        .style("padding", "0 10px");

      encabezadoModalRectangulo
        .append("span")
        .text("Rectángulo")
        .style("color", "black")
        .style("font-size", "1.5rem")
        .style("font-weight", "bold");

      encabezadoModalRectangulo
        .append("button")
        .text("Cerrar")
        .style("background-color", "#00182c")
        .style("color", "white")
        .style("border", "none")
        .style("padding", "5px 10px")
        .style("border-radius", "5px")
        .style("cursor", "pointer")
        .on("click", () => {
          this.ocultar(); // Oculta el modal
        });

      const cuerpo = modalContent
        .append("div")
        .style("background-color", "white")
        .style("width", "100%") // Ocupa todo el ancho del modal
        .style("height", "90%") // Altura fija del contenedor
        .style("display", "flex") // Habilita Flexbox
        .style("flex-direction", "row") // Coloca los elementos en fila
        .style("padding", "0") // Elimina cualquier margen interno
        .style("gap", "0");

      const areaSection = cuerpo
        .append("div")
        .style("background-color", "white")
        .style("width", "50%") // Ocupa la mitad del ancho del contenedor
        .style("height", "100%") // Ocupa todo el alto del contenedor
        .style("display", "flex")
        .style("flex-direction", "column") // Organiza en columna
        .style("justify-content", "center") // Centra verticalmente
        .style("align-items", "center"); // Centra horizontalmente

      areaSection
        .append("h3")
        .text("Calcular Área")
        .style("color", "black")
        .style("margin-bottom", "15px")
        .style("font-size", "1.5rem")
        .style("font-family", "Arial, sans-serif"); // Fuente limpia

      this.txtArea1 = <d3.Selection<any, unknown, HTMLInputElement, any>>(
        areaSection
          .append("input")
          .attr("placeholder", "Lado 1")
          .style("margin", "5px 0") // Espaciado entre los inputs
          .style("padding", "10px")
          .style("width", "80%") // Ancho relativo al contenedor
          .style("border", "1px solid #ccc")
          .style("border-radius", "5px")
      );
      this.txtArea2 = <d3.Selection<any, unknown, HTMLInputElement, any>>(
        areaSection
          .append("input")
          .attr("placeholder", "Lado 2")
          .style("margin", "5px 0") // Espaciado entre los inputs
          .style("padding", "10px")
          .style("width", "80%") // Ancho relativo al contenedor
          .style("border", "1px solid #ccc")
          .style("border-radius", "5px")
      );
      areaSection
        .append("button")
        .text("Calcular Área")
        .style("margin-top", "10px") // Espaciado superior
        .style("padding", "10px 20px") // Tamaño del botón
        .style("background-color", "#00182c") // Azul oscuro
        .style("color", "white")
        .style("border", "none")
        .style("border-radius", "5px")
        .style("cursor", "pointer")
        .on("click", () => this.calcularArea());

      areaSection
        .append("p")
        .attr("id", "resultadoArea")
        .style("color", "black")
        .style("margin-top", "15px") // Espacio encima del resultado
        .style("font-size", "1.5rem");

      const perimetroSection = cuerpo
        .append("div")
        .style("background-color", "#5860a0")
        .style("width", "50%") // Ocupa la mitad del ancho del contenedor
        .style("height", "100%") // Ocupa todo el alto del contenedor
        .style("display", "flex")
        .style("flex-direction", "column") // Organiza en columna
        .style("justify-content", "center") // Centra verticalmente
        .style("align-items", "center"); // Centra horizontalmente

      perimetroSection
        .append("h3")
        .text("Calcular Perímetro")
        .style("color", "white")
        .style("margin-bottom", "15px")
        .style("font-size", "1.5rem")
        .style("font-family", "Arial, sans-serif");

      perimetroSection
        .append("input")
        .attr("type", "number")
        .attr("placeholder", "Lado 1")
        .attr("id", "perilado1")
        .style("margin", "5px 0") // Espaciado entre los inputs
        .style("padding", "10px")
        .style("width", "80%") // Ancho relativo al contenedor
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px");

      perimetroSection
        .append("input")
        .attr("type", "number")
        .attr("placeholder", "Lado 2")
        .attr("id", "perilado2")
        .style("margin", "5px 0") // Espaciado entre los inputs
        .style("padding", "10px")
        .style("width", "80%") // Ancho relativo al contenedor
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px");

      perimetroSection
        .append("button")
        .text("Calcular perimetro")
        .style("margin-top", "10px") // Espaciado superior
        .style("padding", "10px 20px") // Tamaño del botón
        .style("background-color", "#00182c") // Azul oscuro
        .style("color", "white")
        .style("border", "none")
        .style("border-radius", "5px")
        .style("cursor", "pointer")
        .on("click", () => this.calcularperimetro());

      perimetroSection
        .append("p")
        .attr("id", "resultadoperi")
        .style("color", "white")
        .style("margin-top", "15px") // Espacio encima del resultado
        .style("font-size", "1.5rem");
    }

    ocultar() {
      //this.rectangleContainer.remove();

      //appController.borrarInstanciaRectangulo();
      this.rectangleContainer.style("display", "none");
    }

    calcularArea() {
      let lado1 = Number(this.txtArea1.property("value"));
      const lado2 = Number(this.txtArea2.property("value"));
      if (!isNaN(lado1) && !isNaN(lado2)) {
        const area = lado1 * lado2;
        d3.select("#resultadoArea").text(`Área: ${area}`);
      } else {
        d3.select("#resultadoArea").text("Por favor, ingrese valores válidos.");
      }
    }

    calcularperimetro() {
      const lado1 = Number(
        (<HTMLInputElement>document.getElementById("perilado1")).value
      );
      const lado2 = Number(
        (<HTMLInputElement>document.getElementById("perilado2")).value
      );

      if (!isNaN(lado1) && !isNaN(lado2)) {
        const peri = (lado1 + lado2) * 2;
        d3.select("#resultadoperi").text(`perimetro: ${peri}`);
      }
    }
  }
}
