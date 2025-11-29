const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));


app.post("/suscribir", async (req, res) => {
  console.log("1. Solicitud recibida en /suscribir"); // MENSAJE DE RASTREO
  const correoCliente = req.body.correo;
  console.log("2. Correo del cliente:", correoCliente);

  // Verificamos si las variables existen
  if (!process.env.CORREO_USER || !process.env.CORREO_PASS) {
      console.error("ERROR: Faltan las variables de entorno");
      return res.status(500).send("Error de configuración en el servidor");
  }

 // CONFIGURACIÓN CORREGIDA PARA RENDER (PUERTO 465)
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  // Usamos el servidor directo de Gmail
    port: 465,               // Puerto seguro SSL (El 587 suele fallar en Render)
    secure: true,            // Obligatorio true para el puerto 465
    auth: {
      user: process.env.CORREO_USER,
      pass: process.env.CORREO_PASS
      
    }
  });

  try {
    console.log("3. Intentando enviar el correo..."); // MENSAJE DE RASTREO
    
    await transporter.sendMail({
      from: "Suscripciones 7Soaps",
      to: process.env.CORREO_USER, // Se lo envía a ti mismo
      subject: "Nueva suscripción web",
      text: `Un usuario se suscribió con el correo: ${correoCliente}`
    });

    console.log("4. ¡Correo enviado con éxito!"); // SI LLEGAS AQUÍ, FUNCIONÓ
    
    // Redirigir al usuario al inicio con una alerta (opcional) o mensaje simple
    res.send(`
      <h1>¡Gracias por suscribirte!</h1>
      <p>Hemos recibido tu correo: ${correoCliente}</p>
      <a href="/">Volver al inicio</a>
    `);

  } catch (error) {
    console.error("5. ERROR AL ENVIAR:", error); // AQUÍ SALDRÁ EL ERROR REAL
    res.status(500).send(`Hubo un error al enviar el correo: ${error.message}`);
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));

