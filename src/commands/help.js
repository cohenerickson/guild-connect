const config = require("../../config.json");

module.exports = (client, message) => {
  message.reply({
    content: `\`\`\`${process.env.PREFIX || config.prefix}help\n${process.env.PREFIX || config.prefix}mute <User#Tag> (<Time>) (-g)\n${process.env.PREFIX || config.prefix}setup\n${process.env.PREFIX || config.prefix}unmute <User#Tag> (-g)\`\`\``
  });
}