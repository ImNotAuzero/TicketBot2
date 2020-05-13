/* jshint esversion: 8 */

const index = require("../index");

module.exports.commands = {
    loadAll: function(client) {
        console.log("System: commands.loadAll -> Loading All Commands");
        const { promisify } = require("util");
        const { join, extname } = require("path");
        const { readdir, lstat } = require("fs");
        const readdirPromise = promisify(readdir);
        const lstatPromise = promisify(lstat);
        const COMMANDS_FOLDER_PATH = join(__dirname, "../commands");

        const readAllCommands = async (startPath = COMMANDS_FOLDER_PATH) => {
            const files = await readdirPromise(startPath);
            for (const f of files) {
                const path = join(startPath, f);
                if (extname(f) === ".js") {
                    let props = require(path);
                    // Commands
                    client.commands.set(props.help.name, props);
                    console.log(`Command: ${f} loaded.`);
                    // Aliases
                    props.help.aliases.forEach(alias => {
                        client.aliases.set(alias, props.help.name);
                    });
                } else {
                    const stats = await lstatPromise(path);
                    if (stats.isDirectory() && !stats.isSymbolicLink()) await readAllCommands(path);
                }
            }
        };
        readAllCommands().then(console.log("System: commands.loadAll -> All commands loaded"));
    }
};