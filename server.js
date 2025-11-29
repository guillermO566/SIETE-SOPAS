const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();

// Configuración básica para recibir datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Carpeta donde está tu html e imagenes

// RUTA PARA SUSCRIBIRSE
app.post("/suscribir", async (req, res) => {
  console.log("1. Intento de suscripción recibido"); 
  
  const correoCliente = req.body.correo;
  console.log("2. Correo a suscribir:", correoCliente);

  // CONFIGURACIÓN DEL CORREO (NODEMAILER)
  // Usamos el puerto 465 y una configuración especial para que no se cuelgue
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Usar conexión segura
    auth: {
      user: process.env.CORREO_USER,
      pass: process.env.CORREO_PASS
    },
    tls: {
      // ESTA ES LA MAGIA: Le dice al servidor que no sea tan estricto con la seguridad
      // Ayuda a evitar el error "Timeout" en Render
      rejectUnauthorized: false
    }
  });

  try {
    console.log("3. Intentando conectar con Gmail..."); 
    
    // Enviamos el correo
    await transporter.sendMail({
      from: "Suscripciones Siete Sopas", // Nombre que saldrá
      to: process.env.CORREO_USER,       // Te llega a ti mismo
      subject: "¡Nueva suscripción!",
      text: `Hola, el usuario con correo ${correoCliente} se quiere suscribir.`
    });

    console.log("4. ¡Correo enviado exitosamente!"); 
    
    // Respuesta para el usuario (lo que ve en pantalla)
    res.send(`
      <div style="text-align:center; padding: 50px; font-family: sans-serif;">
        <h1>¡Gracias por suscribirte!</h1>
        <p>Hemos recibido tu correo: <b>${correoCliente}</b></p>
        <br>
        <a href="/" style="background: orange; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Volver al inicio</a>
      </div>
    `);

  } catch (error) {
    console.error("5. ERROR FATAL:", error);
    res.status(500).send("Hubo un error al enviar el correo. Intenta más tarde.");
  }
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en el puerto ${PORT}`));