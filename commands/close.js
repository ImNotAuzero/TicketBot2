/* jshint esversion: 8 */

const index = require("../index");
const functions = require("../modules/functions");

module.exports.run = async(client, message, args) => {

    if(!message.channel.name.includes(`ticket-`)) {
        return functions.messages(message, "notTicketChannel");
    }

    if(!message.member.roles.cache.some(r => r.name === client.config.roles.support)) {
        return functions.messages(message, "noPermission");
    }

    // generate transcript
    let transcript = await functions.generate.transcript(message);


    if(client.config.logging.onTicketClose === true) {
        let logChannel = functions.channels.cache_findByID(message, client.config.logging.channel);

        logChannel.send(await functions.messages(message, "logTicketClose", message.channel, message.author, transcript));
    }

    setTimeout(function(){
        message.channel.delete();
    }, 5000);

};

module.exports.help = {
    name: "close",
    aliases: ["end"]
};