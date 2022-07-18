module.exports = async (client, name, code, reason) => {
    client.logger.warn(`Lavalink closed (${name}) - Code: ${code} | Reason: ${reason || 'No reason provided'}`);
};