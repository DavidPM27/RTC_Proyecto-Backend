const User = require("../models/user.model");
const Badge = require("../models/badge.model");

// Obtain all badges of the authenticated user
async function getUserBadges(req, res, _) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("badges");

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Obtain badges with user.badges ObjectIds
    const badgeObjects = await Badge.find({ _id: { $in: user.badges } });
    return res.status(200).json(badgeObjects);
  } catch (error) {
    return res.status(400).json("Error fetching badges");
  }
}

// Create a new badge
async function createBadge(req, res, _) {
  try {
    const badge = new Badge(req.body);
    const badgeDB = await badge.save();
    return res.status(201).json(badgeDB);
  } catch (error) {
    return res.status(400).json("Error creating badge");
  }
}

// Update user badge (add or remove)
async function updateUserBadge(req, res, _) {
  try {
    const userId = req.user._id;
    const { badgeId } = req.params;
    const action = req.body.action || req.query.action;

    if (!badgeId) return res.status(400).json("BadgeId is required");
    if (!action || (action !== "add" && action !== "remove")) {
      return res.status(400).json("Action must be 'add' or 'remove'");
    }

    // Verify badge exists
    const badgeDoc = await Badge.findById(badgeId);
    if (!badgeDoc) return res.status(404).json("Badge not found");

    if (action === "add") {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { badges: badgeId } },
        { new: true }
      ).select("badges");

      if (!updatedUser) return res.status(404).json("User not found");

      // Check if badge was actually added (length changed)
      return res.status(201).json({
        message: "Badge unlocked successfully",
        badges: updatedUser.badges,
      });
    }

    if (action === "remove") {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json("User not found");
      }

      if (!user.badges.includes(badgeId)) {
        return res.status(200).json("Badge was not assigned to user")
      };

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { badges: badgeId } },
        { new: true }
      ).select("badges");

      return res.status(200).json({
        message: "Badge removed successfully",
        badges: updatedUser.badges,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("Error updating badge");
  }
}

async function deleteBadge(req, res, _) {
  try {
    const { badgeId } = req.params;
    // Delete badge references from all users
    await User.updateMany({ badges: badgeId }, { $pull: { badges: badgeId } });

    // Delete badge from Badge collection
    const badgeDeleted = await Badge.findByIdAndDelete(badgeId);
    if (!badgeDeleted) {
      return res.status(404).json("Badge not found");
    }

    return res.status(200).json({
      message: "Badge deleted successfully",
      badge: badgeDeleted,
    });
  } catch (error) {
    return res.status(400).json("Error deleting badge");
  }
}

// Update badge
async function updateBadge(req, res, _) {
  try {
    const { badgeId } = req.params;
    const updateData = { ...req.body };

    // Prevent badgeId change
    if (updateData.badgeId) {
      return res.status(400).json("badgeId cannot be changed");
    }

    const badgeUpdated = await Badge.findByIdAndUpdate(badgeId, updateData, {
      new: true,
    });

    if (!badgeUpdated) {
      return res.status(404).json("Badge not found");
    }

    return res.status(200).json(badgeUpdated);
  } catch (error) {
    return res.status(400).json("Error updating badge");
  }
}

// Get badge
async function getBadge(req, res, _) {
  try {
    const { badgeId } = req.params;
    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(404).json("Badge not found");
    }
    return res.status(200).json(badge);
  } catch (error) {
    return res.status(400).json("Error getting badge");
  }
}

module.exports = {
  getUserBadges,
  createBadge,
  updateUserBadge,
  deleteBadge,
  updateBadge,
  getBadge,
};
