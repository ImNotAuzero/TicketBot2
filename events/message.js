/* jshint esversion: 8 */

const config = require("../config.json");
const functions = require("../modules/functions");
const Discord = require("discord.js");

module.exports.commands = {
    finder: async (client, message) => {
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

module.exports.categories = async (client, message) => {

    if(message.channel.type === "dm") return;

    if(config.categories.enabled === false) return;

    if(message.channel.name.includes("ticket-")) {
        // move to awaiting response
        if(!message.member.roles.cache.some(r => r.name === "Support")) {
            if(message.author.bot) return;
            message.channel.setParent(config.categories.ids.awaiting);

            let role = functions.roles.cache_findByName(message, config.roles.support);
            return message.channel.send(`<@&${role.id}>`).then(msg => msg.delete({ time: 0 }));

        } else {
            // Move to responded
            message.channel.setParent(config.categories.ids.responded);

            let notSupport = [];
            let support = [];
            let allUsers = [];
            message.channel.members.forEach(member => {
                allUsers.push(member.id);
            });
            
            let supportRole = functions.roles.cache_findByName(message, "Support");

            for(user in allUsers) {
                let roleNames = [];
                let usersRoles = [];

                let u = message.guild.member(allUsers[user]); // Gets the user


                for(roleID in u._roles) {
                    usersRoles.push(u._roles[roleID]);
                }

                for(role in usersRoles) {
                    let r = functions.roles.cache_findByID(message, usersRoles[role]);
                    roleNames.push(r.name);
                }

                if(!roleNames.includes("Support")) {
                    notSupport.push(allUsers[user]);
                }
            }

            // Removes all bots from the notSupport array
            for(let i = 0; i < notSupport.length; i++) {
                let u = message.guild.member(notSupport[i]);
                
                if(u.user.bot) {
                    notSupport.splice(i, 1);
                }
            }

            // Tags every user in the ticket who isn't support.
            if(notSupport === []) return;

            for(let i = 0; i < notSupport.length; i++) {
                message.channel.send(`<@${notSupport[i]}>`).then(msg => { msg.delete({ time: 0 });});
            }
        }
    }

};