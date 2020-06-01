function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

export const checkLength = (input, min, max) => {
  let error = false;
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} debe contener al menos ${min} caracteres`
    );
    error = true;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} debe contener maximo ${max} caracteres`
    );
    error = true;
  } else {
    showSuccess(input);
    input.parentElement.classList.remove("error");
  }
  return error;
};

export const checkEmail = (input) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let error = false;
  if (re.test(input.value)) {
    showSuccess(input);
  } else {
    showError(input, "Ingrese un correo valido");
    error = true;
  }
  return error;
};
