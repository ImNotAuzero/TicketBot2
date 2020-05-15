/* jshint esversion: 8 */

const config = require("../config.json");
const Discord = require("discord.js");

module.exports.generate = {
    ticketID: function(name) {
        let StringID = name.toString();
        let ticketID = StringID.substring(0, 6);
        let tID = parseInt(ticketID);

        return tID;
    },

    ticket: function(message, id, supportRole, author, everyone) {
        message.guild.channels.create(`ticket-${id}`, { type: "text" })
          .then(ticket => {

              ticket.createOverwrite(supportRole, {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true
              });
              
              ticket.createOverwrite(author, {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true
              });

              ticket.createOverwrite(everyone, {
                  SEND_MESSAGES: false,
                  VIEW_CHANNEL: false
              });

              let user = message.guild.member(author); // Gets user from author var

              //message.channel.send(`Ticket: ${ticket} has been created`);
              exports.messages(message, "ticketOpened", author, ticket);
              
              //ticket.send("Thank you for creating a ticket! A member will respond shortly!");
              
              ticket.setParent(config.categories.ids.awaiting);
              ticket.send(exports.messages(message, "welcomeTicket", user));
              return ticket.send(`<@${author}> <@&${supportRole}>`).then(msg => { msg.delete({ time: 0 }); });
          });
    },

    transcript: async function (message) {
        const Discord = require("discord.js");
        const jsdom = require('jsdom');
        const {
            JSDOM
        } = jsdom;
        const dom = new JSDOM();
        const document = dom.window.document;
        const fs = require("fs");

        if (message.author.bot) return;
        var d = Date().toString();
        var date = `${d.substring(0,3)}-${d.substring(4,7)}-${d.substring(8,10)}-${d.substring(11,15)}`;
        var time = `${d.substring(16,18)}-${d.substring(19,21)}-${d.substring(22,24)}`;

        var combined = `${date}-${time}`;

        var transcriptName = `${combined}-${message.channel.name}`;
        let messageCollection = new Discord.Collection();
        let channelMessages = await message.channel.messages.fetch({
            limit: 100
        }).catch(err => console.log(err));

        messageCollection = messageCollection.concat(channelMessages);

        while (channelMessages.size === 100) {
            let lastMessageId = channelMessages.lastKey();
            channelMessages = await message.channel.messages.fetch({
                limit: 100,
                before: lastMessageId
            }).catch(err => console.log(err));
            if (channelMessages)
                messageCollection = messageCollection.concat(channelMessages);
        }
        let msgs = messageCollection.array().reverse();
        fs.readFile('./assets/base.html', 'utf8', async function (err, data) {
            if (data) {
                await fs.writeFile(`./transcripts/${transcriptName}.html`, data, async function (err, result) {
                    //console.log(message.guild);
                    let guildElement = document.createElement('div');
                    let guildText = document.createTextNode(message.guild.name);
                    let guildImg = document.createElement('img');
                    if (message.guild.iconURL === null || message.guild.iconURL() === undefined) {
                        guildImg.setAttribute('src', message.guild.nameAcronym);
                    } else {
                        guildImg.setAttribute('src', message.guild.iconURL());
                    }
                    guildImg.setAttribute('width', '150');
                    guildElement.appendChild(guildImg);
                    guildElement.appendChild(guildText);
                    //console.log(guildElement.outerHTML);
                    await fs.appendFile(`./transcripts/${transcriptName}.html`, guildElement.outerHTML, async function (err, res) {
                        msgs.forEach(async msg => {
                            let parentContainer = document.createElement("div");
                            parentContainer.className = "parent-container";

                            let avatarDiv = document.createElement("div");
                            avatarDiv.className = "avatar-container";
                            let img = document.createElement('img');
                            img.setAttribute('src', msg.author.displayAvatarURL());
                            img.className = "avatar";
                            avatarDiv.appendChild(img);

                            parentContainer.appendChild(avatarDiv);

                            let messageContainer = document.createElement('div');
                            messageContainer.className = "message-container";

                            let nameElement = document.createElement("span");
                            let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString() + " EST");
                            nameElement.appendChild(name);
                            messageContainer.append(nameElement);

                            if (msg.content.startsWith("```")) {
                                let m = msg.content.replace(/```/g, "");
                                let codeNode = document.createElement("code");
                                let textNode = document.createTextNode(m);
                                codeNode.appendChild(textNode);
                                messageContainer.appendChild(codeNode);
                            } else {
                                let msgNode = document.createElement('span');
                                let textNode = document.createTextNode(msg.content);
                                msgNode.append(textNode);
                                messageContainer.appendChild(msgNode);
                            }
                            parentContainer.appendChild(messageContainer);
                            await fs.appendFile(`./transcripts/${transcriptName}.html`, parentContainer.outerHTML, async function (e, r) {
                                if (e) return console.log(e);
                            });
                        });
                    });
                });
            }
        });
        return transcriptName;
    }
};

module.exports.roles = {
    cache_findByName: function(message, roleName) {
        let r = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
        return r;
    },
    
    cache_findByID: function(message, id) {
        let r = message.guild.roles.cache.find(r => r.id === id);
        return r;
    }
};

module.exports.channels = {
    cache_findbyName: function(message, name) {
        let r = message.guild.channels.cache.find(c => c.name.toLowerCase() === name.toLowerCase());
        return r;
    },

    cache_findByID: function(message, id) {
        let r = message.guild.channels.cache.find(c => c.id === id);
        return r;
    },

    // Useless function but it's included anyways.
    delete: function(message, id) {
        message.channel.delete();
    },
    

    addUserToChannel: function(message, channel, user) {
        channel.createOverwrite(user, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        });

        channel.createOverwrite(user, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        });

        channel.createOverwrite(user, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        });

        // Repeat 3 times because it doesn't remove user first time. Might be a bug with djs.

        //channel.send(`${message.author} added ${user} to ticket ${channel}`);
    },

    removeUserFromChannel: function(message, channel, user) {
        channel.createOverwrite(user, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        });

        channel.createOverwrite(user, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        });

        channel.createOverwrite(user, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        });

        // Repeat 3 times because it doesn't remove user first time. Might be a bug with djs.

        //channel.send(`${message.author} removed ${user} from ticket ${channel}`);
    }
};

module.exports.messages = function(message, action, args1, args2, args3, args4) {
    switch(action) {
        case "welcomeTicket":
            let welcomeTicket = new Discord.MessageEmbed()
              .setAuthor(`Hey ${args1.user.username}#${args1.user.discriminator}!`)
              .setColor("RANDOM")
              .setDescription("Thank you for contacting support. While you are waiting. Please describe your issue.")
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return (welcomeTicket);

        case "ticketOpened":
            let ticketOpened = new Discord.MessageEmbed()
              .setAuthor("Ticket opened")
              .setColor("#00FF00")
              .setDescription(`<@${args1}> Your ticket is: ${args2}`)
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return message.channel.send(ticketOpened);

        case "ticketAlreadyOpen":
            let ticketAlreadyOpen = new Discord.MessageEmbed()
              .setAuthor("Error!")
              .setColor("FF0000")
              .setDescription(`<@${args1}> You already have a ticket open! (<#${args2}>).\nPlease respond within that ticket.`)
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return message.channel.send(ticketAlreadyOpen);

        case "notTicketChannel":
            let notTicketChannel = new Discord.MessageEmbed()
              .setAuthor("Error!")
              .setColor("#FF0000")
              .setDescription("Please run this command within a ticket.")
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return message.channel.send(notTicketChannel);

        case "noPermission":
            let noPermission = new Discord.MessageEmbed()
              .setAuthor("Error!")
              .setColor("#FF0000")
              .setDescription("You do not have permission to execute this command.")
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return message.channel.send(noPermission);

        case "noUserMentioned":
            let noUserMentioned = new Discord.MessageEmbed()
              .setAuthor("Error!")
              .setColor("#FF0000")
              .setDescription("You did not mention another user to add to the ticket.")
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return message.channel.send(noUserMentioned);

        case "userAddedToTicket":
            let userAddedToTicket = new Discord.MessageEmbed()
              .setAuthor("Ticket update")
              .setColor("RANDOM")
              .setDescription(`User has been added to the ticket!`)
              .addFields(
                  { name: `User Added:`, value: `<@${args2}>`, inline: true },
                  { name: `Executor:`, value: `<@${args1}>`, inline: true }
              )
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return message.channel.send(userAddedToTicket);

        case "userRemovedFromTicket":
            let userRemovedFromTicket = new Discord.MessageEmbed()
              .setAuthor("Ticket update")
              .setColor("RANDOM")
              .setDescription(`User has been removed from the ticket!`)
              .addFields(
                  { name: `User Removed:`, value: `<@${args2}>`, inline: true },
                  { name: `Executor:`, value: `<@${args1}>`, inline: true }
              )
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
            return message.channel.send(userRemovedFromTicket);

        case "logTicketClose":
            let logTicketClose = new Discord.MessageEmbed()
              .setAuthor("Ticket Closed")
              .setColor("RANDOM")
              .setDescription("A ticket was closed. Here are some of the details.")
              .addFields(
                  { name: "Ticket ID:", value: args1.name, inline: true},
                  { name: "Executor:", value: `${args2.username}#${args2.discriminator}`, inline: true },
                  { name: "Transcript:", value: args3, inline: true }
              )
              .setFooter("TicketBot2 -> v1.1, Developed by Liam#0716");
              return logTicketClose;
    }
};

// In the array, append the user ID along with their roles