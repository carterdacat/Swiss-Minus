import SwissClient from "../../SwissClient";
import { Message, TextChannel, MessageEmbed } from "discord.js";
import { error_red, log_yellow } from "../../config";

export let name = "say";
export let description = "Says a message!";
export let usage = "[channel] [message]";
export let guildOnly = true;
export let canBeOff = true;
export let permissions = ["MANAGE_ROLES"];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const mentionedChannel =
    message.mentions.channels.first() || // Mentioned channel
    (client.channels.cache.get(args[0]) as TextChannel) || // Find channel by id
    message.channel; // Current Channel
  const mod =
    message.member.hasPermission("MANAGE_ROLES") ||
    message.author.id === "660238973943152707";
  if (!mentionedChannel) {
    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTitle("Invalid Channel!")
      .setColor("F90B0B")
      .addField("Whats that?", "That's not a channel!")
      .setFooter(client.version)
      .setTimestamp();
    return message.channel.send(embed);
  }
  if (mentionedChannel && !args[1]) {
    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTitle("Error!")
      .setColor(error_red)
      .addField(
        "I think you forgot something",
        "Your forgot what you wanted to say! Think deeper"
      )
      .setFooter(client.version)
      .setTimestamp();
    return message.channel.send(embed);
  }
  const messages1 = args.slice(1).join(" ");
  const embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle("Say Cmd Log")
    .setColor(log_yellow)
    .addField("This person used the command!:", `<@${message.author.id}>`)
    .addField("The message was:", messages1)
    .setFooter(client.version)
    .setTimestamp();
  const chl = client.channels.cache.get("668987003517534259") as TextChannel;
  await chl.send(embed);
  return await mentionedChannel.send(messages1);
}
