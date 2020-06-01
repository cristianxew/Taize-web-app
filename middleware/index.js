//ALL THE MIDDLEWARES GOES HERE
const testimony = require("../models/testimony");
const comment = require("../models/comment");
const middlewareObj = {};

middlewareObj.checkTestimonyOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    testimony.findById(req.params.id, function (err, foundTestimony) {
      if (err || !foundTestimony) {
        req.flash("error", "No se ha encontrado lo que buscas...");
        res.redirect("back");
      } else {
        //does user own the camp?
        if (foundTestimony.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "No tienes permiso para hacer eso");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Nesecitas iniciar sesion");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "No se ha encontrado el comentario");
        res.redirect("back");
      } else {
        //does user own the comment?
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "No tienes permiso para hacer eso");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Necesitas iniciar sesion");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Necesitas iniciar sesion");
  res.redirect("/login");
};

module.exports = middlewareObj;
