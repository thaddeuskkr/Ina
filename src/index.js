require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.js');
const Keyv = require('keyv');
const Spotify = require('kazagumo-spotify');
const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const { Partials, GatewayIntentBits } = Discord;

const client = new Discord.Client({ 
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ], 
    partials: [
        Partials.Channel
    ] 
});
const kazagumo = new Kazagumo({
    defaultSearchEngine: config.defaultSearchEngine,
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    },
    plugins: [
        new Spotify({
            clientId: config.spotify.clientId,
            clientSecret: config.spotify.clientSecret,
            playlistPageLimit: 0,
            albumPageLimit: 0,
            searchLimit: 0,
            searchMarket: config.spotify.searchMarket
        })
    ]
}, new Connectors.DiscordJS(client), config.lavalink_nodes);
const keyv = new Keyv(config.database_url, { namespace: 'kiko' });

client.logger = require('./util/logger.js');
client.util = require('./util/util.js');
client.commands = new Discord.Collection();
client.shoukaku = kazagumo.shoukaku;
client.kazagumo = kazagumo;
client.config = config;
client.db = keyv;

let eventCount = 0;
let commandCount = 0;

const clientEvents = fs.readdirSync('./src/events/client').filter(file => file.endsWith('.js'));
const shoukakuEvents = fs.readdirSync('./src/events/shoukaku').filter(file => file.endsWith('.js'));
const playerEvents = fs.readdirSync('./src/events/player').filter(file => file.endsWith('.js'));

for (const file of clientEvents) {
    const event = require(`./events/client/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
    eventCount++;
}

for (const file of shoukakuEvents) {
    const event = require(`./events/shoukaku/${file}`);
    kazagumo.shoukaku.on(file.split('.')[0], event.bind(null, client));
    eventCount++;
}

for (const file of playerEvents) {
    const event = require(`./events/player/${file}`);
    kazagumo.on(file.split('.')[0], event.bind(null, client));
    eventCount++;
}

const commands = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const command of commands) {
    const cmd = require(`./commands/${command}`);
    if (!cmd.data?.name) {
        client.logger.warn(`Failed to load command ${command.replace('.js', '')}: Command name not found`);
    }
    client.commands.set(cmd.data.name, cmd);
    commandCount++;
}

client.logger.success(`Successfully loaded ${eventCount} events`);
client.logger.success(`Successfully loaded ${commandCount} commands`);

process.on('unhandledRejection', (reason) => {
    client.logger.error(`Unhandled rejection: ${reason.toString()}`);
});

keyv.on('error', (error) => client.logger.error(`Keyv error: ${error.message}`));

client.login(config.token);