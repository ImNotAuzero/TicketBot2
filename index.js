/* jshint esversion: 8 */

// Imports
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const handler = require("./modules/handler");

// Sets
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Startup
handler.commands.loadAll(client)

client.on("ready", async () => {
    console.log("TicketBot ready to go.");
});

client.on("message", async message => {
    let prefix = "-";
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let commandfile = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    let Command = `${prefix}${command}`;
    if (!commandfile) {
        return message.channel.send("error! cmd not found");
      }
    if (commandfile) commandfile.run(client, message, args);
  });

// Message Events

client.login(config.token);
