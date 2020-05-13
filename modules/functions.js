/* jshint esversion: 8 */

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

              message.channel.send(`Ticket: ${ticket} has been created`);
              
              ticket.send("Thank you for creating a ticket! A member will respond shortly!");
              return ticket.send(`<@${author}> <@&${supportRole}>`).then(msg => { msg.delete({ time: 0 }); });
          });
    },

    transcript: function() {

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

        channel.send(`${message.author} added ${user} to ticket ${channel}`);
    },

    removeUserFromChannel: function(message, channel, user) {
        channel.createOverwrite(user, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        });

        channel.send(`${message.author} removed ${user} from ticket ${channel}`);
    }
};