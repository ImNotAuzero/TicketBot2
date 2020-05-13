module.exports.generate = {
    ticketID: function(name) {
        let StringID = name.toString();
        let ticketID = StringID.substring(0, 6);
        let tID = parseInt(ticketID);

        return tID;
    },

    ticket: function(message, id, supportRole, author, everyone) {
        message.guild.createChannel(`ticket-${id}`, { type: "text" })
          .then(ticket => {
              ticket.overwritePermissions(supportRole, {
                  SEND_MESSAGES: true,
                  READ_MESSAGES: true
              });
              ticket.overwritePermissions(author, {
                  SEND_MESSAGES: true,
                  READ_MESSAGES: true
              })
              ticket.overwritePermissions(everyone, {
                  SEND_MESSAGES: false,
                  READ_MESSAGES: false
              })

              message.channel.send(`Ticket: ${ticket} has been created`);

              ticket.send("Thank you for creating a ticket! A member will respond shortly!");
              return ticket.send(`<@${author}>`).then(msg => { msg.delete(0) })
          })
    }
}