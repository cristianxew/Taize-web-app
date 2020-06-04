import "@babel/polyfill";
import Swal from "sweetalert2";
import WOW from "./wow.js";
import "./siriwave.js";
import "./audio.js";
import "./scroll.js";
import "./gallery.js";
import { checkEmail, checkLength } from "./validation.js";

const emailForm = document.getElementById("send-form");
const formEdit = document.querySelector("#formEdit");
const formNew = document.getElementById("formNew");
const formRegister = document.getElementById("formRegister");

if (formEdit) {
  formEdit.addEventListener("submit", function (e) {
    const title = document.getElementById("titulo-");
    const description = document.getElementById("texto-");
    const titleLengthError = checkLength(title, 6, 70);
    const descriptionLengthError = checkLength(description, 100, 10000);
    const imageCoverFile = e.target[1];
    const imagesFiles = e.target[2];
    if (
      (imagesFiles.files.length > 0 && imagesFiles.files.length < 4) ||
      imagesFiles.files.length > 4 ||
      (imageCoverFile.files.length === 0 && imagesFiles.files.length > 0) ||
      (imagesFiles.files.length === 0 && imageCoverFile.files.length > 0)
    ) {
      e.preventDefault();
      Swal.fire({
        text:
          "Para Editar tu publicacion debes seleccionar nuevamente todas las fotos, o puedes dejar esos campos vacios y editar el resto de la publicacion",
        confirmButtonColor: "#17a29b",
        buttonsStyling: "false",
      });
    } else if (titleLengthError || descriptionLengthError) {
      e.preventDefault();
    } else {
      e.returnValue = true;
      formEdit.style.opacity = "0";
      Swal.fire({
        title: "",
        showConfirmButton: false,
        width: 600,
        showLoaderOnConfirm: "true",
        allowOutsideClick: "false",
        padding: "3em",
        background: "transparent",
        backdrop: `
                  rgba(0,0,123, 0)
                  url("/img/ConventionalOblongFairybluebird-max-1mb_c4le1f.gif")
                  center
                  no-repeat
                `,
      });
    }
  });
}

if (formNew) {
  formNew.addEventListener("submit", function (e) {
    const title = document.getElementById("titulo");
    const description = document.getElementById("texto");
    const titleLengthError = checkLength(title, 6, 70);
    const descriptionLengthError = checkLength(description, 100, 10000);
    const imagesFiles = e.target[2];
    const imageCover = e.target[1];
    if (titleLengthError || descriptionLengthError) {
      e.preventDefault();
    } else if (
      imagesFiles.files.length !== 4 ||
      imageCover.files.length !== 1
    ) {
      e.preventDefault();
      Swal.fire({
        text:
          "Debes seleccionar una imagen principal y cuatro imagenes acompañantes",
        confirmButtonColor: "#17a29b",
        buttonsStyling: "false",
      });
    } else {
      e.returnValue = true;
      formNew.style.opacity = "0";
      Swal.fire({
        title: "",
        showConfirmButton: false,
        width: 600,
        showLoaderOnConfirm: "true",
        allowOutsideClick: "false",
        padding: "3em",
        background: "transparent",
        backdrop: `
              rgba(0,0,123, 0)
              url("/img/ConventionalOblongFairybluebird-max-1mb_c4le1f.gif")
              center
              no-repeat
            `,
      });
    }
  });
}

if (formRegister) {
  formRegister.addEventListener("submit", function (e) {
    const username = document.getElementById("usuario");
    const password = document.getElementById("contraseña");
    const usernameLengthError = checkLength(username, 4, 30);
    const passwordLengthError = checkLength(password, 6, 25);
    if (!usernameLengthError && !passwordLengthError) {
      username.parentElement.classList.remove("success");
      password.parentElement.classList.remove("success");
    } else {
      e.preventDefault();
    }
  });
}

if (emailForm) {
  emailForm.addEventListener("submit", function (e) {
    const email = document.getElementById("correo");
    const nombre = document.getElementById("nombre");
    const mensaje = document.getElementById("mensaje");
    const emailLengthError = checkEmail(email);
    const nombreLengthError = checkLength(nombre, 5, 30);
    const mensajeLengthError = checkLength(mensaje, 10, 3000);
    if (!emailLengthError && !nombreLengthError && !mensajeLengthError) {
      email.parentElement.classList.remove("success");
      nombre.parentElement.classList.remove("success");
      mensaje.parentElement.classList.remove("success");
    } else {
      e.preventDefault();
    }
  });
}

new WOW().init();
