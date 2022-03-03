const db = require("quick.db");

module.exports = (client, message) => {
  if (message.member.permissions.has("MUTE_MEMBERS")) {
    let arguments = message.content.split("unmute ")[1].split(" ");
    if (arguments[0]) {
      let global = false;
      if (arguments.find(x => x === "-g")) {
        arguments = arguments.filter(x => x !== "-g");
        global = true;
      }
      if (arguments[0].includes("#")) {
        const user = client.users.cache.find(user => user.tag === arguments[0]);
        if (user) {
          let mute = {
            end: 0
          }
          if (global) {
            let servers = db.get("servers");
            Object.values(servers).forEach((server) => {
              db.set(`servers.${server.guildID}.mutes.${user.id}`, mute);
            });
            message.reply({
              content: `${user.tag} has been unmuted globaly.`
            });
          } else {
            db.set(`servers.${message.guild.id}.mutes.${user.id}`, mute);
            message.reply({
              content: `${user.tag} has been unmuted.`
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