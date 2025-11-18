require('dotenv').config();
const users = require('../data/users');
const badges = require('../data/badges');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../api/models/user.model');
const Badge = require('../api/models/badge.model');

async function runSeed() {
  try {
    await mongoose.connect(process.env.DB_URL);

    // Drop collections if they exist
    const allUsers = await User.find();
    if (allUsers.length) {
      await User.collection.drop();
    }
    const allBadges = await Badge.find();
    if (allBadges.length) {
      await Badge.collection.drop();
    }

    // Prepare and insert badges
    const badgesData = badges.map((b) => ({
      ...b,
      _id: new mongoose.Types.ObjectId(b._id),
    }));
    await mongoose.connection.collection('badges').insertMany(badgesData);
    console.log(`Inserted badges: `, badges);

    // Prepare users: hash passwords and convert badge ids to ObjectId
    // also set role to "user" to override any admin in seed data
    const usersData = users.map((u) => {
      const hashed = bcrypt.hashSync(u.password, 10);
      return {
        ...u,
        _id: new mongoose.Types.ObjectId(),
        password: hashed,
        role: "user",
        badges: (u.badges || []).map((id) => new mongoose.Types.ObjectId(id)),
      };
    });

    await mongoose.connection.collection('users').insertMany(usersData);
    console.log(`Inserted users: `, usersData);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

runSeed();
