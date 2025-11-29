const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Carpeta pública
app.use(express.static("public"));


app.post("/suscribir", async (req, res) => {
  const correoCliente = req.body.correo;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CORREO_USER,
      pass: process.env.CORREO_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: "Suscripciones 7Soaps",
      to: process.env.CORREO_USER,
      subject: "Nueva suscripción",
      text: `Un usuario se suscribió con el correo: ${correoCliente}`
    });

    res.send("¡Gracias por suscribirte!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el correo");
  }
});

// Puerto dinámico (Render usa su propio puerto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));
