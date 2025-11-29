const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, IMÁGENES)
app.use(express.static("public"));

// Ruta donde llegan las suscripciones
app.post("/suscribir", async (req, res) => {
  const correoCliente = req.body.correo;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "guillermowq76@gmail.com",
      pass: "ftwkrjtioewmfgda"
    }
  });

  try {
    await transporter.sendMail({
      from: "Suscripciones 7Soaps",
      to: "guillermowq76@gmail.com",
      subject: "Nueva suscripción",
      text: `Un usuario se suscribió con el correo: ${correoCliente}`
    });

    res.send("¡Gracias por suscribirte!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el correo");
  }
});

// Iniciar servidor
app.listen(3000, () =>
  console.log("Servidor corriendo en http://localhost:3000")
);
