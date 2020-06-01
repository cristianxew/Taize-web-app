const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const testimony = require("../models/testimony");
nodemailer = require("nodemailer");

//root route
router.get("/", async function (req, res) {
  //Get testimonies from no admin users
  const invitados = await testimony.find({
    "author.isAdmin": { $eq: "false" },
  });
  // get all Testimonies from admin Users
  testimony.find({ "author.isAdmin": { $eq: "true" } }, function (
    err,
    allTestimonies
  ) {
    if (err) {
      console.log(err);
    } else {
      res.render("inicio/index", {
        testimonies: allTestimonies,
        page: "inicio",
        invitados: invitados,
      });
    }
  });
});

//AUTH ROUTES

//Show the register form
router.get("/register", function (req, res) {
  res.render("register", { page: "register" });
});

//Sign up logic
router.post("/register", function (req, res) {
  const newUser = new User({
    username: req.body.username,
  });
  if (req.body.adminCode === process.env.ADMIN_CODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      req.flash(
        "success",
        "Te has registrado correctamente " + user.username + "!"
      );
      res.redirect("/");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login", { page: "login" });
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "Usuario y/o Contraseña invalido/a",
  }),
  function (req, res) {}
);

//logout logic
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Sesion cerrada");
  res.redirect("/");
});

//show history page
router.get("/historia", function (req, res) {
  res.render("historia", { page: "historia" });
});

//show activities page
router.get("/actividades", function (req, res) {
  res.render("actividades", { page: "actividades" });
});

router.get("/sobre-taize", function (req, res) {
  res.render("sobre-taize", { page: "sobre-taize" });
});

//contact form
router.post("/send", function (req, res) {
  const output = `
    <p>Tienes un nuevo mensaje</p>
    <h3>Detalles del remitente</h3>
    <ul>
      <li>Nombre: ${req.body.nombre}</li>
      <li>Correo: ${req.body.correo}</li>
    </ul>
    <h3>Mensaje</h3>
    <p>${req.body.mensaje}</p>
  `;
  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_KEY, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${req.body.nombre} <cristianxsa15@gmail.com>`, // sender address
      to: "cristianxsa15@gmail.com", // list of receivers
      subject: "voluntarios-taize-ielco web", // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  main().catch(console.error);
  res.render("contact", { msg: req.body.nombre, page: "contact" });
});

module.exports = router;
