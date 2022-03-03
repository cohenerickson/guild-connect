const config = require("../../config.json");
const fs = require("fs");
const db = require("quick.db");

module.exports = (client, message) => {
  if (message.author.bot) return;

  // handle commands
  let run = false;
  if (message.content.startsWith(process.env.PREFIX || config.prefix)) {
    let arguments = message.content.split(process.env.PREFIX || config.prefix)[1].split(" ");
    const commands = fs.readdirSync("./src/commands");
    commands.forEach((command) => {
      if (arguments[0].toLowerCase() === command.split(".")[0]) {
        require(`../commands/${command}`)(client, message);
        run = true;
      }
    });
  }

  // handle messages
  if (!run) {
    let servers = db.get("servers");
    if (!Object.values(servers).find(x => x.channelID == message.channel.id)) return;
    Object.values(servers).forEach((server) => {
      if (server.mutes[message.author.id]) {
        if (Date.now() >= server.mutes[message.author.id].end) {
          delete server.mutes[message.author.id];
        } else {
          return;
        }
      };
      if (server.guildID == message.guild.id) return;
      const guild = client.guilds.cache.get(server.guildID);
      const channel = guild.channels.cache.get(server.channelID);
      channel.fetchWebhooks()
        .then((webhooks) => {
          let w = false;
          webhooks.forEach((webhook) => {
            if (webhook.id == server.webhook.id && !w) {
              w = true;
              webhook.send({
                content: message.content,
                username: message.author.tag,
                avatarURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`
              });
            }
          });
        });
    });
  }
}