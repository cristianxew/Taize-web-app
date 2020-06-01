const express = require("express");
const router = express.Router({ mergeParams: true });
const testimony = require("../models/testimony");
const comment = require("../models/comment");
const middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
  //find the testimony with provided ID
  testimony.findById(req.params.id, function (err, testimonies) {
    if (err) {
      console.log(err);
    } else {
      //render show template with that testimony
      res.render("comments/new", { camp: testimonies });
    }
  });
});

//comments create
router.post("/", middleware.isLoggedIn, function (req, res) {
  //Look testimonies using id
  testimony.findById(req.params.id, function (err, campg) {
    if (err) {
      console.log(err);
      res.redirect("/inicio");
    } else {
      //Create new comment
      comment.create(req.body.comment, function (err, comentario) {
        if (err) {
          req.flash("error", "Algo no salio bien...");
          console.log(err);
        } else {
          //add username and id to comment
          comentario.author.id = req.user._id;
          comentario.author.username = req.user.username;
          //save comment
          comentario.save();
          campg.comments.push(comentario);
          campg.save();
          /* req.flash("success", "Successfully added comment"); */
          res.redirect("/inicio/" + campg._id);
        }
      });
    }
  });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (
  req,
  res
) {
  testimony.findById(req.params.id, function (err, foundTestimony) {
    if (err || !foundTestimony) {
      req.flash("error", "No se ha podido encontrar lo que buscas...");
      return res.redirect("back");
    }
    comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          camp_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id/", middleware.checkCommentOwnership, function (
  req,
  res
) {
  comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/inicio/" + req.params.id);
    }
  });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (
  req,
  res
) {
  comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comentario eliminado");
      res.redirect("/inicio/" + req.params.id);
    }
  });
});

module.exports = router;
