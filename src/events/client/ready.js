module.exports = async (client) => {
    client.logger.success(`Logged in as ${client.user.tag}`);

    // Replacing variables in configuration
    client.config.footer.text = client.config.footer.text.replace('{version}', require('../../../package.json').version);
    client.config.footer.iconURL = client.config.footer.iconURL.replace('{avatar}', client.user.avatarURL({ size: 4096 }));

    // Set client activity and status
    await client.user.setPresence(client.config.presence);

    // Set the client as ready
    client.ready = true;
    client.logger.info('Startup tasks complete.');
};