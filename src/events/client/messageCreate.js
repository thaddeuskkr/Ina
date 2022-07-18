const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
module.exports = async (client, message) => {
    if (!client.config.owners.includes(message.author.id)) return;
    if (!message.content.startsWith('ina ')) return;
    const commands = [];

    for (const command of client.commands) {
        commands.push(command[1].data.toJSON());
    }
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const cmd = message.content.replace('ina ', '');
    if (cmd === 'deploy guild') {
        rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: commands })
            .then(() => client.logger.info(`Registered application commands for server ${message.guild.name} (${message.guild.id})`))
            .catch(err => client.logger.error(`Failed to register application commands for server ${message.guild.name} (${message.guild.id}): ${err.message}`));
        await message.delete();
        return;
    }
    if (cmd === 'deploy' || cmd === 'deploy global') {
        rest.put(Routes.applicationCommands(client.user.id), { body: commands })
            .then(() => client.logger.info('Registered application commands globally'))
            .catch(err => client.logger.error(`Failed to register application commands globally: ${err.message}`));
        await message.delete();
        return;
    }
    if (cmd === 'undeploy guild') {
        rest.get(Routes.applicationGuildCommands(client.user.id, message.guild.id))
            .then(data => {
                const promises = [];
                for (const command of data) {
                    const deleteUrl = `${Routes.applicationGuildCommands(client.user.id, message.guild.id)}/${command.id}`;
                    promises.push(rest.delete(deleteUrl));
                }
                return Promise.all(promises).then(() => client.logger.info(`Unregistered application commands for server ${message.guild.name} (${message.guild.id})`));
            });
        await message.delete();
        return;
    }
    if (cmd === 'undeploy' || cmd === 'undeploy global') {
        rest.get(Routes.applicationCommands(client.user.id))
            .then(data => {
                const promises = [];
                for (const command of data) {
                    const deleteUrl = `${Routes.applicationCommands(client.user.id)}/${command.id}`;
                    promises.push(rest.delete(deleteUrl));
                }
                return Promise.all(promises).then(() => client.logger.info('Unregistered application commands globally'));
            });
        await message.delete();
        return;
    }
};