const prettyms = require('pretty-ms');
const { ActionRowBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    formatTime: (ms, stream) => {
        if (stream && stream === true) return '[STREAM/LIVE]';
        return prettyms(ms, { colonNotation: true, millisecondsDecimalDigits: 0, secondsDecimalDigits: 0 });
    },
    pagination: async (interaction, pages, buttonList, timeout = 120000, footer) => {
        if (!pages || !buttonList || 
            buttonList[0].data.style === ButtonStyle.Link || buttonList[1].data.style === ButtonStyle.Link || 
            buttonList.length !== 2) return false;
        let page = 0;
        const row = new ActionRowBuilder().addComponents(buttonList);
        if (interaction.deferred == false) await interaction.deferReply();
        const currentPage = await interaction.editReply({
            embeds: [pages[page].setFooter({ text: `${footer} | Page ${page + 1} of ${pages.length}` })],
            components: [row],
            fetchReply: true
        });
        const filter = (i) => i.customId === buttonList[0].data.custom_id || i.customId === buttonList[1].data.custom_id;
        const collector = await currentPage.createMessageComponentCollector({ filter, time: timeout });
        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: 'Only the user who invocated the command can use the buttons.', ephemeral: true });
            switch (i.customId) {
            case buttonList[0].data.custom_id:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[1].data.custom_id:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
            }
            await i.deferUpdate();
            await i.editReply({
                embeds: [pages[page].setFooter({ text: `${footer} | Page ${page + 1} of ${pages.length}` })],
                components: [row]
            });
            collector.resetTimer();
        });
        collector.on('end', (_, reason) => {
            if (reason !== 'messageDelete') {
                const disabledRow = new ActionRowBuilder().addComponents(
                    buttonList[0].setDisabled(true),
                    buttonList[1].setDisabled(true)
                );
                currentPage.edit({
                    embeds: [pages[page].setFooter({ text: `${footer} | Page ${page + 1} of ${pages.length}` })],
                    components: [disabledRow]
                });
            }
        });
        return currentPage;
    },
    createProgressBar: (current, end, size) => {
        if (isNaN(current) || isNaN(end)) return 'Arguments current and end have to be integers.';
        const percentage = current / end;
        const progress = Math.round(size * percentage);
        const emptyProgress = size - progress;

        const progressText = '▇'.repeat(progress);
        const emptyProgressText = '—'.repeat(emptyProgress);

        return `\`[${progressText}${emptyProgressText}]\``;
    }
};