const express = require('express');
const { isAuth, isAdmin } = require('../../middlewares/auth');
const { getUserBadges, addBadgeToUser, createBadge, removeBadgeFromUser, deleteBadge } = require('../controllers/badge.controller');

const badgesRouter = express.Router();

badgesRouter.get('/', isAuth, getUserBadges);
badgesRouter.post('/create', isAdmin, createBadge);
badgesRouter.post('/:badgeId', isAuth, addBadgeToUser);
badgesRouter.delete('/:badgeId', isAuth, removeBadgeFromUser);
badgesRouter.delete('/delete/:badgeId', isAdmin, deleteBadge);

module.exports = badgesRouter;
