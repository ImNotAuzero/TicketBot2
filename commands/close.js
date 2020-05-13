/* jshint esversion: 8 */

const index = require("../index");
const functions = require("../modules/functions");

module.exports.run = async(client, message, args) => {
    let supportRole = functions.roles.cache_findByName(message, client.config.roles.support);

    if(!message.channel.name.includes(`ticket-`)) {
        return message.channel.send("This is not a ticket channel");
    }

    if(!message.member.roles.cache.some(r => r.name === client.config.roles.support)) {
        return message.channel.send("You do not have permission to close tickets!");
    }

    // generate transcript
    functions.generate.transcript();

    message.channel.delete();


};

module.exports.help = {
    name: "close",
    aliases: ["end"]
};