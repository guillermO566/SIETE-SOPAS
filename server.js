const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

// Configuración básica
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.post("/suscribir", async (req, res) => {
  console.log("1. Iniciando proceso de suscripción...");
  const correoCliente = req.body.correo;

  // VERIFICACIÓN DE VARIABLES (Para que sepas si Render las leyó bien)
  if (!process.env.CORREO_USER || !process.env.CORREO_PASS) {
      console.error("ERROR CRÍTICO: Faltan las variables en Render (Environment)");
      return res.status(500).send("Error interno de configuración.");
  }

  // INTENTO DE CONEXIÓN USANDO PUERTO 587 (STARTTLS)
  // Esta es la alternativa cuando el puerto 465 falla por Timeout
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, 
    secure: false, // OJO: Para el puerto 587 esto TIENE que ser false
    requireTLS: true, // Obligamos a usar seguridad
    auth: {
      user: process.env.CORREO_USER,
      pass: process.env.CORREO_PASS
    },
    tls: {
      rejectUnauthorized: false // Permite pasar aunque el certificado sea estricto
    },
    connectionTimeout: 10000 // Esperar máximo 10 segundos
  });

  try {
    console.log("2. Intentando conectar con Gmail (Puerto 587)...");
    
    // Verificamos la conexión antes de enviar (esto nos dará más detalles en el log)
    await transporter.verify();
    console.log("3. ¡Conexión con Gmail exitosa! Enviando correo...");

    await transporter.sendMail({
      from: "Suscripciones Siete Sopas",
      to: process.env.CORREO_USER,
      subject: "Nueva suscripción web",
      text: `El usuario ${correoCliente} se ha suscrito.`
    });

    console.log("4. ¡Correo enviado!");
    
    res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #e67e22;">¡Suscripción Exitosa!</h1>
        <p>Gracias por unirte. Hemos registrado tu correo: <b>${correoCliente}</b></p>
        <br>
        <a href="/" style="background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Volver al Restaurante</a>
      </div>
    `);

  } catch (error) {
    console.error("5. ERROR AL ENVIAR:", error);
    // Mostramos el error en pantalla para que sepas qué pasó sin ir a los logs
    res.status(500).send(`
      <h1>Ups, hubo un error</h1>
      <p>El servidor dijo: ${error.message}</p>
      <p>Código de error: ${error.code}</p>
      <a href="/">Volver a intentar</a>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));