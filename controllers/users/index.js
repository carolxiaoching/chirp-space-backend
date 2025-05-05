const auth = require("./auth");
const profile = require("./profile");
const follow = require("./follow");
const activity = require("./activity");

module.exports = {
  ...auth,
  ...profile,
  ...follow,
  ...activity,
};
