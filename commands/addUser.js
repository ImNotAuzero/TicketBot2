/* jshint esversion: 8 */

const index = require("../index");
const functions = require("../modules/functions");

module.exports.run = async(client, message, args) => {
    let supportRole = functions.roles.cache_findByName(message, client.config.roles.support);

    if(!message.channel.name.includes(`ticket-`)) {
        return message.channel.send("This is not a ticket channel");
    }

    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if(!user) {
        return message.channel.send("You did not mention a user!");
    }


    functions.channels.addUserToChannel(message, message.channel, user);
};

module.exports.help = {
    name: "add",
    aliases: []
};