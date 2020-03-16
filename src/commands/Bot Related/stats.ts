import SwissClient from "../../SwissClient";
import Discord, { Message, MessageEmbed } from "discord.js";
import os from "os";
import { convertBytes, convertMs } from "../../utils";
import { swiss_blue } from "../../config";
const { engines } = require("../../../package.json");

export let name = "stats";
export let description = "Look at the bot's stats";
export let aliases = ["botstats", "status"];
export let cooldown = 10;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const embed = new MessageEmbed()
    .setAuthor(`${message.author.tag} | Bot Status`)
    .setColor(swiss_blue)
    .setTitle(`Status of ${client.user.username}:${client.version}`)
    .addField(
      "Server Status",
      `CPU Architecture: **${process.arch}**\nRAM Usage: **${convertBytes(
        process.memoryUsage().heapUsed
      )}/${convertBytes(os.totalmem())}**`
    )
    .addField(
      "Process Status",
      `Node: **v${engines.node}**\nNPM: **v${engines.npm}**\nDiscord.js: **v${
        Discord.version
      }**\nUptime: **${convertMs(client.uptime)}**\nPing: **${convertMs(
        client.ws.ping
      )}**`
    )
    .addField(
      "Bot Status",
      `Users: **${client.users.cache.size}**\nGuilds: **${client.guilds.cache.size}**\nChannels: **${client.channels.cache.size}**\nCommands executed: **${client.commandsExecuted}**\nCommands failed: **${client.commandsFailed}**`
    )
    .setFooter(client.version)
    .setTimestamp();
  message.channel.send(embed);
}
