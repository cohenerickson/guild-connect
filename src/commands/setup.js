const db = require("quick.db");

module.exports = (client, message) => {
  if (message.member.permissions.has("ADMINISTRATOR")) {
    message.channel.fetchWebhooks()
      .then((webhooks) => {
        let w = false;
        webhooks.forEach((webhook) => {
          if (webhook.name == "Guild Connect" && !w) {
            w = true;
            setup(client, message, webhook);
          }
        });
        if (!w) {
          w = true;
          message.channel.createWebhook("Guild Connect")
            .then((webhook) => {
              setup(client, message, webhook);
            });
        }
      });
  } else {
    message.reply({
      content: "This action requires administrator permissions."
    });
  }
}

function setup(client, message, webhook) {
  let server = {
    "guildID": message.guild.id,
    "channelID": message.channel.id,
    "webhook": webhook,
    "mutes": {}
  }

  db.set(`servers.${message.guild.id}`, server);
  message.reply(`Guild Connect setup to use <#${message.channel.id}>.`);
}