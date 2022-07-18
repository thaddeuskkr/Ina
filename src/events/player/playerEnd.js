module.exports = async (client, player) => {
    await player.data.get('message')?.delete();
};