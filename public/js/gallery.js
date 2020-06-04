let imagesGallery = document.querySelectorAll(".gallery__item");
let getLatestOpenedImages;
let windowWidth = window.innerWidth;

if (imagesGallery) {
  imagesGallery.forEach((img, i) => {
    img.onclick = function (e) {
      let getFullImgUrl = e.path[2].children[1].currentSrc;
      let setNewImgUrl = getFullImgUrl.split("/img/")[1];

      getLatestOpenedImages = i;

      let container = document.body;
      let newImgWindow = document.createElement("div");
      container.appendChild(newImgWindow);
      newImgWindow.setAttribute("class", "img-window");
      //newImgWindow.setAttribute("onclick", "closeImg()");
      newImgWindow.addEventListener("click", () => {
        document.querySelector(".img-window").remove();
        document.querySelector(".img-btn-next").remove();
        document.querySelector(".img-btn-prev").remove();
      });

      let newImg = document.createElement("img");

      newImgWindow.appendChild(newImg);
      newImg.setAttribute("src", "/img/" + setNewImgUrl);
      newImg.setAttribute("id", "current-img");

      newImg.onload = function () {
        let ImgWidth = this.width;

        let calcImgToEdge = (windowWidth - ImgWidth) / 2 - 50;

        let prevBtn = document.createElement("p");
        let prevBtnText = document.createTextNode("Ant");
        prevBtn.appendChild(prevBtnText);
        container.appendChild(prevBtn);
        prevBtn.setAttribute("class", "img-btn-prev");
        prevBtn.style.cssText = "left: " + (calcImgToEdge * 0.01 + 3) + "%;";
        //prevBtn.setAttribute("onclick", "changeImg(0)");
        prevBtn.addEventListener("click", (e) => {
          document.querySelector("#current-img").remove();

          let getImgWindow = document.querySelector(".img-window");
          let newImg = document.createElement("img");

          let calcNewImg = getLatestOpenedImages - 1;

          if (calcNewImg < 0) {
            calcNewImg = imagesGallery.length - 1;
          }

          let getFullImgUrl =
            e.path[1].children[0].children[2].children[2].children[calcNewImg]
              .children[1].currentSrc;

          let setNewImgUrl = getFullImgUrl.split("/img/")[1];

          newImg.setAttribute("src", "/img/" + setNewImgUrl);
          newImg.setAttribute("id", "current-img");
          getImgWindow.appendChild(newImg);
          getImgWindow.appendChild(desc);

          getLatestOpenedImages = calcNewImg;

          newImg.onload = function () {
            let ImgWidth = this.width;
            let calcImgToEdge = (windowWidth - ImgWidth) / 2 - 50;

            let prevBtn = document.querySelector(".img-btn-prev");
            let nextBtn = document.querySelector(".img-btn-next");
            prevBtn.style.cssText =
              "left: " + (calcImgToEdge * 0.01 + 3) + "%;";
            nextBtn.style.cssText = "right: " + calcImgToEdge * 0.01 + "%;";
          };
        });

        let nextBtn = document.createElement("p");
        let nextBtnText = document.createTextNode("Prox");
        nextBtn.appendChild(nextBtnText);
        container.appendChild(nextBtn);
        nextBtn.setAttribute("class", "img-btn-next");
        nextBtn.style.cssText = "right: " + calcImgToEdge * 0.01 + "%;";
        //nextBtn.setAttribute("onclick", "changeImg(1)");
        nextBtn.addEventListener("click", (e) => {
          document.querySelector("#current-img").remove();

          let getImgWindow = document.querySelector(".img-window");
          let newImg = document.createElement("img");

          let calcNewImg = getLatestOpenedImages + 1;

          if (calcNewImg >= imagesGallery.length) {
            calcNewImg = 0;
          }
          getLatestOpenedImages = calcNewImg;
          let getFullImgUrl =
            e.path[1].children[0].children[2].children[2].children[calcNewImg]
              .children[1].currentSrc;

          let setNewImgUrl = getFullImgUrl.split("/img/")[1];

          newImg.setAttribute("src", "/img/" + setNewImgUrl);
          newImg.setAttribute("id", "current-img");
          getImgWindow.appendChild(newImg);

          newImg.onload = function () {
            let ImgWidth = this.width;
            let calcImgToEdge = (windowWidth - ImgWidth) / 2 - 50;

            let nextBtn = document.querySelector(".img-btn-next");
            let prevBtn = document.querySelector(".img-btn-prev");
            prevBtn.style.cssText =
              "left: " + (calcImgToEdge * 0.01 + 3) + "%;";
            nextBtn.style.cssText = "right: " + calcImgToEdge * 0.01 + "%;";
          };
        });
      };
    };
  });
}
