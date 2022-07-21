const { EmbedBuilder } = require('discord.js');
module.exports = async (client, player) => {
    const embed = new EmbedBuilder()
        .setDescription('*No more tracks in queue.*')
        .setColor(client.config.color)
        .setFooter(client.config.footer);
    if (!player.commandStop) client.channels.cache.get(player.textId)?.send({ embeds: [embed] });
    for (const msg of player.cleanup) {
        if (msg.interaction) {
            await msg.interaction.deleteReply().catch(() => null);
        } else if (msg.replied && msg.replied == true) {
            await msg.deleteReply().catch(() => null);
        } else {
            await msg.delete().catch(() => null);
        }
    }
    setTimeout(() => {
        if (player.queue.length == 0 && !player.queue.current) {
            player.destroy();
        } else {
            return;
        }
    }, client.config.disconnectTimeout);
};