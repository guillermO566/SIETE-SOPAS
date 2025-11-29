const express = require("express");
const path = require("path");
const app = express();

// Servir archivos estáticos (HTML, CSS, Imágenes)
app.use(express.static("public")); 
// O si tus archivos están en la raíz, usa: app.use(express.static(__dirname));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor web listo en puerto " + PORT));