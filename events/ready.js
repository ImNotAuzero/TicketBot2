/* jshint esversion: 8 */

const config = require("../config.json");

module.exports = async () => {
    console.log(`\nTicketBot v${config.version} -> Launched Successfully`);
};