module.exports = async (client, o, n) => {
    if (o.member.id !== client.user.id || n.member.id !== client.user.id) return;
    if (n.channelId === null && o.channelId !== null) {
        if (client.kazagumo.players.get(o.guild.id)) client.kazagumo.destroyPlayer(o.guild.id);
    }
};