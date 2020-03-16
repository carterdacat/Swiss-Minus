import { MessageEmbed, TextChannel, Message, Collection } from "discord.js";
import { error_red, log_yellow } from "../config";
import { getSetting } from "..";
import SwissClient from "../SwissClient";
import { convertMs } from "../utils";

export let name = "commandHandler";
export let invoke = "message";

const cooldowns: Collection<
  string,
  Collection<string, number>
> = new Collection();

export async function execute(client: SwissClient, message: Message) {
  const botOn = (await client.db.query("SELECT bot FROM settings AS bot"))
    .rows[0].bot;
  if (botOn === "off") return;
  if ((message.channel as TextChannel).parentID === "606557115758411807")
    return;
  if (message.channel.type === "dm" && message.author.id !== client.user.id) {
    let dmlogs = client.channels.cache.get("680608961019510831") as TextChannel;
    let embed = new MessageEmbed();
    embed
      .setColor(log_yellow)
      .setTitle("New DM!")
      .setDescription(`From <@${message.author.id}>: ${message.content}`)
      .setTimestamp()
      .setFooter(client.version);
    dmlogs.send(embed);
  }
  const prefixes = [
    client.dev ? "?" : await getSetting("prefix"),
    `<@${client.user.id}>`
  ];
  if (
    !prefixes.some(prefix => message.content.startsWith(prefix)) ||
    message.author.bot
  )
    return;
  const prefix = prefixes.find(prefix => message.content.startsWith(prefix));
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd: { aliases: string | string[] }) =>
        cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!args[0] && !commandName) return;
  if (!command)
    return message.channel.send(
      `Try doing ${prefix}help to see what my commands are!`
    );

  if (command.guildOnly && message.channel.type !== "text") {
    client.commandsFailed = client.commandsFailed + 1;
    const embed = new MessageEmbed()
      .setTitle("Error")
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setColor(error_red)
      .setDescription("This command can't be used in direct messages!");
    return await message.channel.send(embed);
  }

  const on =
    (command.canBeOff ? await getSetting(command.name) : "on") === "on";
  if (!on) {
    client.commandsFailed = client.commandsFailed + 1;
    const notOn = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setColor(error_red)
      .addField(
        "I'm Not On!",
        "This command it turned off! Please ask a mod or admin to turn it back on!"
      )
      .setFooter(client.version)
      .setTimestamp();
    return await message.channel.send(notOn);
  }

  if (command.args && !args.length) {
    client.commandsFailed = client.commandsFailed + 1;
    const embed = new MessageEmbed()
      .setAuthor(
        `${message.author.tag} | Not enough arguments`,
        message.author.avatarURL()
      )
      .setColor(error_red)
      .addField("Error", "You didn't provide any arguments!");
    if (command.usage) {
      const pUsage = `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      embed.addField("Usage:", `The proper usage would be ${pUsage} `);
    }
    return await message.channel.send(embed);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      client.commandsFailed = client.commandsFailed + 1;
      const timeOut = new MessageEmbed();
      timeOut
        .setAuthor(
          `${message.author.tag} | Cooldown`,
          message.author.avatarURL()
        )
        .setTitle("Cooldown has Not finished")
        .addField(
          "Error",
          `Please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        )
        .setColor(error_red);
      return message.channel.send(timeOut);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  if (
    !(command.permissions || []).every(perm =>
      message.member.hasPermission(perm)
    )
  ) {
    if (message.author.id === "660238973943152707") return;
    const missingPerms = (command.permissions || []).filter(
      perm => !message.member.hasPermission(perm)
    );
    client.commandsFailed = client.commandsFailed + 1;
    const embed = new MessageEmbed()
      .setAuthor(
        `${message.author.tag} | Missing Permissions`,
        message.author.avatarURL()
      )
      .setColor(error_red)
      .addField(
        "Missing Perms!",
        `Hey <@${message.author.id}>, you need to have \`${missingPerms.join(
          "`, `"
        )}\` permissions to use this command.`
      )
      .setFooter(client.version)
      .setTimestamp();
    return message.channel.send(embed);
  }

  try {
    const startTime = Date.now();
    await command.execute(client, message, args, client.db);
    client.commandsExecuted = client.commandsExecuted + 1;
    let embed = new MessageEmbed()
      .setColor(log_yellow)
      .setDescription(
        `The command ${commandName} was used by <@${message.author.id}>. The whole message was ${message.content}`
      )
      .setTimestamp()
      .setFooter(
        `${convertMs(new Date(startTime - Date.now()).getMilliseconds())} | ${
          client.version
        }`
      );
    let channel = client.channels.cache.get(
      "677356042723524608"
    ) as TextChannel;
    channel.send(embed);
  } catch (error) {
    const userMen = message.author.id;
    client.commandsFailed = client.commandsFailed + 1;
    // eslint-disable-next-line no-console
    console.error(error);
    const err = new MessageEmbed()
      .setAuthor(`${message.author.tag} | Error`, message.author.avatarURL())
      .setTitle("An Error Occurred")
      .setColor(error_red)
      .setDescription(
        `An error occurred. Please report this error to a Swiss Plus developer with the following message \`\`\`${error}\`\`\``
      );
    return await message.channel.send(err);
  }
}
