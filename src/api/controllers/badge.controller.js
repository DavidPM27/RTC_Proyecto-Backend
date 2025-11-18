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

// Add a badge to the authenticated user
async function addBadgeToUser(req, res, _) {
  try {
    const userId = req.user._id;
    const { badgeId } = req.params;
    if (!badgeId) {
      return res.status(400).json("BadgeId is required");
    }

    // Check if the badge exists in the Badge collection
    const badgeDoc = await Badge.findById(badgeId);
    if (!badgeDoc) {
      return res.status(404).json("Badge not found");
    }
    // Obtain user to check if they already have the badge
    const user = await User.findById(userId).select("badges");
    if (!user) {
      return res.status(404).json("User not found");
    }
    const alreadyUnlocked = user.badges.some(
      (b) => b.toString() === badgeDoc._id.toString()
    );
    if (alreadyUnlocked) {
      return res.status(400).json("Badge already unlocked");
    }
    // Add badge ObjectId to user's badges array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { badges: badgeDoc._id } },
      { new: true }
    ).select("badges");
    return res.status(201).json({
      message: "Badge unlocked successfully",
      badges: updatedUser.badges,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Error adding badge");
  }
}

// Remove a badge from the authenticated user
async function removeBadgeFromUser(req, res, _) {
  try {
    const userId = req.user._id;
    const { badgeId } = req.params;

    // Check if the badge exists in the Badge collection
    const badgeDoc = await Badge.findById(badgeId);
    if (!badgeDoc) {
      return res.status(404).json("Badge not found");
    }

    // Check if the user has the badge
    const user = await User.findById(userId).select("badges");
    if (!user) {
      return res.status(404).json("User not found");
    }
    const hasBadge = user.badges.some(
      (b) => b.toString() === badgeDoc._id.toString()
    );
    if (!hasBadge) {
      return res.status(400).json("User does not have this badge");
    }

    // Remove badge ObjectId from user's badges array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { badges: badgeId } },
      { new: true }
    ).select("badges");

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json({
      message: "Badge removed successfully",
      badges: updatedUser.badges,
    });
  } catch (error) {
    return res.status(400).json("Error removing badge");
  }
}

async function deleteBadge(req, res, _) {
  try {
    const { badgeId } = req.params;
    // Delete badge references from all users
    await User.updateMany(
      { badges: badgeId },
      { $pull: { badges: badgeId } }
    );

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

module.exports = {
  getUserBadges,
  createBadge,
  addBadgeToUser,
  deleteBadge,
  removeBadgeFromUser
};
