const db = require("quick.db");
const moment = require("moment");
const ms = require("ms");

module.exports = (client, message) => {
  if (message.member.permissions.has("MUTE_MEMBERS")) {
    let arguments = message.content.split("mute ")[1].split(" ");
    if (arguments[0]) {
      let global = false;
      if (arguments.find(x => x === "-g")) {
        arguments = arguments.filter(x => x !== "-g");
        global = true;
      }
      if (arguments[0].includes("#")) {
        const user = client.users.cache.find(user => user.tag === arguments[0]);
        if (user) {
          let end;
          if (arguments[1]) {
            end = Date.now() + ms(arguments[1]);
            if (!end) {
              return message.reply({
                content: "Invalid time"
              });
            }
          } else {
            end = Date.now() + (1000 * 999 * 365 * 24 * 60 * 60);
          }
          const mute = {
            end: end
          }
          if (global) {
            let servers = db.get("servers");
            Object.values(servers).forEach((server) => {
              db.set(`servers.${server.guildID}.mutes.${user.id}`, mute);
            });
            message.reply({
              content: `${user.tag} has been muted globaly for \`${moment(end).fromNow(true)}\``
            });
          } else {
            db.set(`servers.${message.guild.id}.mutes.${user.id}`, mute);
            message.reply({
              content: `${user.tag} has been muted for \`${moment(end).fromNow(true)}\``
            });
          }
        } else {
          message.reply({
            content: "Could not find `" + arguments[0] + "`."
          });
        }
      } else {
        message.reply({
          content: "Please provide a tag."
        });
      }
    } else {
      message.reply({
        content: "Please provide a user."
      });
    }
  } else {
    message.reply({
      content: "This action requires mute permissions."
    });
  }
}