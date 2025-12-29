const express = require("express");
const { isAuth, isAdmin } = require("../../middlewares/auth");
const {
  getUserBadges,
  updateUserBadge,
  createBadge,
  deleteBadge,
  updateBadge,
} = require("../controllers/badge.controller");

const badgesRouter = express.Router();

badgesRouter.get("/", isAuth, getUserBadges);
badgesRouter.post("/create", isAdmin, createBadge);
badgesRouter.post("/:badgeId", isAuth, (req, res, next) => {
  req.body.action = "add";
  return updateUserBadge(req, res, next);
});
badgesRouter.delete("/:badgeId", isAuth, (req, res, next) => {
  req.body.action = "remove";
  return updateUserBadge(req, res, next);
});
badgesRouter.delete("/delete/:badgeId", isAdmin, deleteBadge);
badgesRouter.put("/update/:badgeId", isAdmin, updateBadge);

module.exports = badgesRouter;
