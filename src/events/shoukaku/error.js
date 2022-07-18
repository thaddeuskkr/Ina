module.exports = async (client, name, error) => {
    client.logger.error(`Error in Lavalink (${name}) - ${error.toString()}`);
};