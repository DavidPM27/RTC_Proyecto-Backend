const express = require("express");
const { auth } = require("../../middlewares/auth");
const {
  getUserBadges,
  updateUserBadge,
  createBadge,
  deleteBadge,
  updateBadge,
  getBadge,
} = require("../controllers/badge.controller");

const badgesRouter = express.Router();

badgesRouter.get("/", auth(), getUserBadges);
badgesRouter.post("/create", auth('admin'), createBadge);
badgesRouter.post("/:badgeId", auth(), (req, res, next) => {
  req.body.action = "add";
  return updateUserBadge(req, res, next);
});
badgesRouter.delete("/:badgeId", auth(), (req, res, next) => {
  req.body.action = "remove";
  return updateUserBadge(req, res, next);
});
badgesRouter.delete("/delete/:badgeId", auth('admin'), deleteBadge);
badgesRouter.put("/update/:badgeId", auth('admin'), updateBadge);
badgesRouter.get("/:badgeId", getBadge);

module.exports = badgesRouter;
