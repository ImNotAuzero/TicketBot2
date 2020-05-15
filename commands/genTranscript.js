/* jshint esversion: 8 */
const Discord = require("discord.js");
const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const fs = require("fs");

exports.run = async (client, message, args) => {
    if (message.author.bot) return;
    var d = Date().toString()
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
                console.log(message.guild);
                let guildElement = document.createElement('div');
                let guildText = document.createTextNode(message.guild.name);
                let guildImg = document.createElement('img');
                if(message.guild.iconURL === null || message.guild.iconURL() === undefined) {
                    guildImg.setAttribute('src', message.guild.nameAcronym);
                } else {
                    guildImg.setAttribute('src', message.guild.iconURL());
                }
                guildImg.setAttribute('width', '150');
                guildElement.appendChild(guildImg);
                guildElement.appendChild(guildText);
                console.log(guildElement.outerHTML);
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
};

exports.help = {
    name: "transcript",
    aliases: []
};