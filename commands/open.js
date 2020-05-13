/* jshint esversion: 8 */

const index = require("../index");
const functions = require("../modules/functions");

module.exports.run = async(client, message, args) => {
    let id = functions.generate.ticketID(message.author.id);
    var supportRole = "Support";
    let everyone = message.guild.roles.find(r => r.name.toLowerCase() === "@everyone");

    if(!message.guild.roles.find(r => r.name.toLowerCase() === "Support")) {
        return message.channel.send("Error! Roles.support does not exist within this guild");
    } else {
        supportRole = message.guild.roles.find(r => r.name.toLowerCase === "support")
    }

    if(message.guild.channels.find(c => c.name.toLowerCase() === `ticket-${id}`)) {
        return message.channel.send("You already have a ticket open!\n\nClose the open ticket first.");
    } else {
        functions.generate.ticket(message, id, message.author.id, supportRole, everyone);
    }


}

module.exports.help = {
    name: "open",
    aliases: ["new", "t", "ticket"]
}