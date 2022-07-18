const { EmbedBuilder } = require('discord.js');
const Wait = require('util').promisify(setTimeout);
module.exports = async (client, player) => {
    const embed = new EmbedBuilder()
        .setDescription('*No more tracks in queue.*')
        .setColor(client.config.color)
        .setFooter(client.config.footer);
    client.channels.cache.get(player.textId)?.send({ embeds: [embed] });
    await player.data.get('message')?.delete();
    Wait(client.config.disconnectTimeout);
    if (player.queue.length == 0 && !player.queue.current) {
        player.destroy();
    } else {
        return;
    }
};