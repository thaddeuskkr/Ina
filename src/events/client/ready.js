module.exports = async (client) => {
    client.logger.success(`Logged in as ${client.user.tag}`);

    // Replacing variables in configuration
    client.config.footer.text = client.config.footer.text.replace('{version}', require('../../../package.json').version);
    client.config.footer.iconURL = client.config.footer.iconURL.replace('{avatar}', client.user.avatarURL({ size: 4096 }));

    // Set client activity and status
    await client.user.setActivity(client.config.activity.text, { type: client.config.activity.type });
    await client.user.setStatus(client.config.activity.status);

    // Set the client as ready
    client.ready = true;
    client.logger.info('Startup tasks complete.');
};