namespace app {
    export interface InterfazEncabezado {
      label: string; // 📌 Nombre que se muestra en la tabla
      key: keyof interfazUsuario | null; // 📌 Propiedad en `interfazUsuario` (o `null` si no se ordena)
    }
  }
  