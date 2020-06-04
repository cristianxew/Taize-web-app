import $ from "jquery";
//const logo = document.querySelector(".navbar-brandd");

/* logo.addEventListener("scroll", () => {
  logo.toggleClass("showw");
}); */
$(window).scroll(function () {
  if ($(this).scrollTop() > 150) {
    $(".navbar-brandd").fadeIn();
    $(".controlsOuter").addClass("controlsOuter-sticky");
  } else {
    $(".navbar-brandd").fadeOut();
    $(".controlsOuter").removeClass("controlsOuter-sticky");
  }
});
