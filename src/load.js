const fs = require("fs");

module.exports = (client) => {
  const events = fs.readdirSync("./src/events");
  events.forEach((event) => {
    client.on(event.split(".")[0], (...arguments) => {
      require(`./events/${event}`)(client, ...arguments);
    });
  });
}