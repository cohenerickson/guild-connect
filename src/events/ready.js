const config = require("../../config.json");

module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({ activities: [{ name: `${process.env.PREFIX || config.prefix}help` }] });
}