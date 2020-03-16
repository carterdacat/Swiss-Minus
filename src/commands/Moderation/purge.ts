/* eslint-disable vars-on-top */
import SwissClient from "../../SwissClient";
import { Message, TextChannel, MessageEmbed } from "discord.js";
import { swiss_blue, error_red } from "../../config";

export let name = "purge";
export let description = "Purges certin messages";
export let aliases = ["Purge"];
export let usage = "[Number of messages] <channel>";
export let cooldown = 5;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const mentionedChannel =
    message.mentions.channels.first() ||
    (client.channels.cache.get(args[0]) as TextChannel);
  const messagesDelete = parseInt(args[0]) + 1;
  const mod = message.member.hasPermission("MANAGE_MESSAGES");
  if (!mod) {
    const noPerms = new MessageEmbed();
    noPerms
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTitle("Missing Permisions")
      .setColor(error_red)
      .addField(
        "Missing Perms!",
        `Hey <@${message.author.id}>, you are missing permissions to use this command.`
      )
      .setFooter(client.version)
      .setTimestamp();
    return message.channel.send(noPerms);
  }
  if (!args[1]) {
    if (messagesDelete > 0 && messagesDelete < 100) {
      const success = new MessageEmbed();
      let num = 2000;
      success
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle("Purge")
        .setColor(swiss_blue)
        .addField("Purged Messages", `I purged ${messagesDelete} messages!`)
        .setFooter(client.version)
        .setTimestamp();
      message.channel
        .bulkDelete(messagesDelete)
        .then(async () => {
          await message.channel.send(success).then((msg: Message) => {
            msg
              .delete({ timeout: 2000 })
              .then(() => console.log())
              .catch(console.error);
          });
        })
        .catch(error => {
          const err = new MessageEmbed()
            .setTitle("Error")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setColor(error_red)
            .addField("Error!", `An error occored. ${error}`)
            .setFooter(client.version)
            .setTimestamp();
          return message.channel.send(err);
        });
    } else {
      const oops = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle("Invalid Arguments")
        .setColor(error_red)
        .addField(
          "Arguments!",
          "Either you provided a number below 0, a number above 99, or it wasn't a number at all!"
        )
        .setFooter(client.version)
        .setTimestamp();
      return message.channel.send(oops);
    }
  } else if (args[1]) {
    if (!mentionedChannel) {
      const yikes = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle("What?")
        .setColor(error_red)
        .addField(
          "What is that?",
          "Thats not a channel? Try again with mentioning a channel"
        )
        .setFooter(client.version)
        .setTimestamp();
      return message.channel.send(yikes);
    }
    const sucsess = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTitle("Purge")
      .setColor(swiss_blue)
      .addField("Purged Messages", `I purged ${args[0]} messages!`)
      .setFooter(client.version)
      .setTimestamp();
    message.mentions.channels
      .first()
      .bulkDelete(messagesDelete)
      .then(() => {
        return message.channel
          .send(sucsess)
          .then((msg: Message) => {
            msg
              .delete({ timeout: 2000 })
              .then(() => console.log)
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(async error => {
        const err = new MessageEmbed()
          .setTitle("Error")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setColor(error_red)
          .addField("Error!", `An error occored. ${error}`)
          .setFooter(client.version)
          .setTimestamp();
        await message.channel.send(err);
      });
  }
}
