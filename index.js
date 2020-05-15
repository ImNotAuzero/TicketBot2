/* jshint esversion: 8 */

// Imports
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const handler = require("./modules/handler");
const onMessage = require("./events/message");
const onReady = require("./events/ready");

// Sets
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = config;

// Startup
handler.commands.loadAll(client);

client.on("ready", onReady);

// Message Events
client.on("message", async (message) => {
    onMessage.commands.finder(client, message);
});
client.on("message", async (message) => {
    onMessage.categories(client, message);
}); // Sorts tickets in to categories.

client.login(config.token);
