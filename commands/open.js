/* jshint esversion: 8 */

const index = require("../index");
const functions = require("../modules/functions");

module.exports.run = async(client, message, args) => {
    let id = functions.generate.ticketID(message.author.id);
    let everyone = functions.roles.cache_findByName(message, "@everyone");
    var supportRole;

    if(functions.roles.cache_findByName(message, client.config.roles.support.toLowerCase()) != null) {
        supportRole = functions.roles.cache_findByName(message, client.config.roles.support.toLowerCase());
    } else {
        return message.channel.send("Error! roles.support does not exist within this guild!");
    }
    
    if(functions.channels.cache_findbyName(message, `ticket-${id}`)) {
        let ticket = functions.channels.cache_findbyName(message, `ticket-${id}`);
        return functions.messages(message, "ticketAlreadyOpen", message.author.id, ticket.id);
    }

    functions.generate.ticket(message, id, supportRole.id , message.author.id, everyone);

};

module.exports.help = {
    name: "open",
    aliases: ["new", "t", "ticket"]
};