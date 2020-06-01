const express = require("express");
const router = express.Router();
const testimony = require("../models/testimony");
const middleware = require("../middleware");

//Image upload Configuration
const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Solo se permiten imagenes"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });
const imagesToUpload = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* //INDEX route. Show all testimonys
router.get("/", function (req, res) {
  const perPage = 9;
  const pageQuery = parseInt(req.query.page);
  const pageNumber = pageQuery ? pageQuery : 1;
  const noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    testimony
      .find({ name: regex })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, alltestimonys) {
        testimony.countDocuments({ name: regex }).exec(function (err, count) {
          if (err) {
            console.log(err);
            res.redirect("back");
          } else {
            if (alltestimonys.length < 1) {
              noMatch = "Aun no hay testimonios con ese nombre";
            }
            res.render("inicio/index", {
              testimonys: alltestimonys,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: req.query.search,
            });
          }
        });
      });
  } else {
    // get all testimonys from DB
    testimony
      .find({})
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, alltestimonys) {
        testimony.countDocuments().exec(function (err, count) {
          if (err) {
            console.log(err);
          } else {
            res.render("inicio/index", {
              testimonys: alltestimonys,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: false,
              page: "inicio",
            });
          }
        });
      });
  }
}); */

//NEW route. Show form to create a new Testimony
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("inicio/new");
});

//CREATE route. add new post to DB
router.post("/", middleware.isLoggedIn, imagesToUpload, async function (
  req,
  res,
  next
) {
  try {
    const imgCoverPath = Object.values(req.files)[0].map(
      (path) => path["path"]
    );
    const imagesPath = Object.values(req.files)[1].map((path) => path["path"]);

    console.time();

    const imgCoverSecureUrl = await cloudinary.v2.uploader.upload(
      imgCoverPath.toString(),
      { folder: "Voluntarios-Taize-Ielco/" },
      function (err, result) {
        return result;
      }
    );

    const imageCover = imgCoverSecureUrl.secure_url;
    const imageCoverId = imgCoverSecureUrl.public_id;

    const imageSecureUrl1 = cloudinary.v2.uploader.upload(
      imagesPath[0].toString(),
      { folder: "Voluntarios-Taize-Ielco/" },
      function (err, result) {
        return result;
      }
    );

    const imageSecureUrl2 = cloudinary.v2.uploader.upload(
      imagesPath[1].toString(),
      { folder: "Voluntarios-Taize-Ielco/" },
      function (err, result) {
        return result;
      }
    );

    const imageSecureUrl3 = cloudinary.v2.uploader.upload(
      imagesPath[2].toString(),
      { folder: "Voluntarios-Taize-Ielco/" },
      function (err, result) {
        return result;
      }
    );

    const imageSecureUrl4 = cloudinary.v2.uploader.upload(
      imagesPath[3].toString(),
      { folder: "Voluntarios-Taize-Ielco/" },
      function (err, result) {
        return result;
      }
    );

    const all = await Promise.all([
      imageSecureUrl1,
      imageSecureUrl2,
      imageSecureUrl3,
      imageSecureUrl4,
    ]);

    console.timeEnd();

    const name = req.body.testimony.name;
    const images = all.map((el) => el.secure_url);
    const imagesIds = all.map((el) => el.public_id);
    const desc = req.body.testimony.description;
    const author = {
      id: req.user._id,
      username: req.user.username,
      isAdmin: req.user.isAdmin,
    };

    const newTestimony = {
      name: name,
      imageCover: imageCover,
      imageCoverId: imageCoverId,
      images: images,
      imagesIds: imagesIds,
      description: desc,
      author: author,
    };
    // get data from form and add to testimoniess array
    testimony.create(newTestimony, function (err, newlyCreated) {
      //redirect back to testimoniess page
      if (err) {
        res.redirect("back");
      }
      console.log(newlyCreated);
      res.redirect("/inicio/" + newlyCreated.id);
    });
  } catch (err) {
    req.flash(
      "error",
      "Debes seleccionar 1 imagen principal y cuatro imagenes acompañantes"
    );
  }
});

//SHOW route. shows info about the...
router.get("/:id", function (req, res) {
  //find the Testimony with provided ID
  testimony
    .findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundTestimony) {
      if (err || !foundTestimony) {
        req.flash("error", "No se ha podido encontrar lo que buscas...");
        console.log(err);
        res.redirect("back");
      } else {
        //render show template with that Testimony
        res.render("inicio/show", { testimony: foundTestimony });
      }
    });
});

//EDIT Testimony ROUTE
router.get("/:id/edit", middleware.checkTestimonyOwnership, function (
  req,
  res
) {
  testimony.findById(req.params.id, function (err, foundTestimony) {
    res.render("inicio/edit", { testimony: foundTestimony });
  });
});

// UPDATE Testimony ROUTE
router.put(
  "/:id",
  middleware.checkTestimonyOwnership,
  imagesToUpload,
  async function (req, res) {
    const files = JSON.parse(JSON.stringify(req.files));
    await testimony.findByIdAndUpdate(
      req.params.id,
      req.body.Testimony,
      async function (err, testimonyFound) {
        if (err) {
          console.log(err);
        }
        try {
          if (Object.keys(files).length > 0) {
            const imgCoverPath = Object.values(files)[0].map(
              (path) => path["path"]
            );
            const imagesPath = Object.values(files)[1].map(
              (path) => path["path"]
            );

            await cloudinary.v2.uploader.destroy(testimonyFound.imageCoverId);
            await cloudinary.v2.uploader.destroy(testimonyFound.imagesIds[0]);
            await cloudinary.v2.uploader.destroy(testimonyFound.imagesIds[1]);
            await cloudinary.v2.uploader.destroy(testimonyFound.imagesIds[2]);
            await cloudinary.v2.uploader.destroy(testimonyFound.imagesIds[3]);

            const imgCoverSecureUrl = await cloudinary.v2.uploader.upload(
              imgCoverPath.toString(),
              { folder: "Voluntarios-Taize-Ielco/" },
              function (err, result) {
                return result;
              }
            );

            testimonyFound.imageCover = imgCoverSecureUrl.secure_url;
            testimonyFound.imageCoverId = imgCoverSecureUrl.public_id;

            const imageSecureUrl1 = cloudinary.v2.uploader.upload(
              imagesPath[0].toString(),
              { folder: "Voluntarios-Taize-Ielco/" },
              function (err, result) {
                return result;
              }
            );

            const imageSecureUrl2 = cloudinary.v2.uploader.upload(
              imagesPath[1].toString(),
              { folder: "Voluntarios-Taize-Ielco/" },
              function (err, result) {
                return result;
              }
            );

            const imageSecureUrl3 = cloudinary.v2.uploader.upload(
              imagesPath[2].toString(),
              { folder: "Voluntarios-Taize-Ielco/" },
              function (err, result) {
                return result;
              }
            );

            const imageSecureUrl4 = cloudinary.v2.uploader.upload(
              imagesPath[3].toString(),
              { folder: "Voluntarios-Taize-Ielco/" },
              function (err, result) {
                return result;
              }
            );

            const all = await Promise.all([
              imageSecureUrl1,
              imageSecureUrl2,
              imageSecureUrl3,
              imageSecureUrl4,
            ]);

            testimonyFound.images = all.map((el) => el.secure_url);
            testimonyFound.imagesIds = all.map((el) => el.public_id);
          }
          testimonyFound.name = req.body.Testimony.name;
          testimonyFound.description = req.body.Testimony.description;
          testimonyFound.save();
          req.flash("success", "Editado exitosamente");
          res.redirect("/inicio/" + testimonyFound._id);
        } catch (err) {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
        }
      }
    );
  }
);

//DESTROY testimony ROUTE
router.delete("/:id", middleware.checkTestimonyOwnership, function (req, res) {
  testimony.findById(req.params.id, async function (err, testimonyToDelete) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
      await cloudinary.v2.uploader.destroy(testimonyToDelete.imageCoverId);
      await cloudinary.v2.uploader.destroy(testimonyToDelete.imagesIds[0]);
      await cloudinary.v2.uploader.destroy(testimonyToDelete.imagesIds[1]);
      await cloudinary.v2.uploader.destroy(testimonyToDelete.imagesIds[2]);
      await cloudinary.v2.uploader.destroy(testimonyToDelete.imagesIds[3]);
      testimonyToDelete.remove();
      req.flash("success", "Eliminado exitosamente");
      res.redirect("/");
    } catch (err) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
    }
  });
});

module.exports = router;
