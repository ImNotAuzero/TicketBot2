/* jshint esversion: 8 */

const config = require("../config.json");

module.exports.commands = {
    finder: async (message) => {
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
    }
};

module.exports.categories = async (message) => {
    if(message.channel.type === "dm") return;

    if(config.categories.enabled === false) return;

    if(message.channel.name.includes("ticket-")) {
        // move to awaiting response
        if(!message.member.roles.cache.some(r => r.name === "Support")) {
            message.channel.setParent(config.categories.ids.awaiting);
        } else {
            // Move to responded
            message.channel.setParent(config.categories.ids.responded);
        }
    }

};