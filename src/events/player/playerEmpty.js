const { EmbedBuilder } = require('discord.js');
module.exports = async (client, player) => {
    const embed = new EmbedBuilder()
        .setDescription('*No more tracks in queue.*')
        .setColor(client.config.color)
        .setFooter(client.config.footer);
    if (!player.commandStop) client.channels.cache.get(player.textId)?.send({ embeds: [embed] }).then(msg => { setTimeout(() => { msg.delete(); }, 10000); });
    for (const msg of player.cleanup) {
        if (msg.interaction && msg.interaction.replied) {
            await msg.interaction.deleteReply().catch(() => null);
        } else if (msg.replied && msg.replied == true) {
            await msg.deleteReply().catch(() => null);
        } else {
            await msg.delete().catch(() => null);
        }
    }
    setTimeout(() => {
        const xplayer = client.kazagumo.players.get(player.guildId);
        if (xplayer.queue.length == 0 && !xplayer.queue.current) {
            xplayer.destroy();
        } else {
            return;
        }
    }, client.config.disconnectTimeout);
};