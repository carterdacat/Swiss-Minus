import SwissClient from "../../SwissClient";
import { Message, GuildMember, MessageEmbed } from "discord.js";
import { swiss_blue } from "../../config";

export let name = "whois";
export let description = "Gets info about a user";
export let aliases = ["Whois", "userinfo"];
export let usage = "[user]";
export let cooldown = 5;
export let canBeOff = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const whoisUser =
      message.mentions.members.first() || // First mention
      (message.guild.members.cache.get(args[0]) as GuildMember) || // User ID
      (message.guild.members.cache.find(
          m => m.user.username === args[0]
      ) as GuildMember) || // Username
      message.member; // Member who sent the message
  console.log(whoisUser);
  const roles1 = whoisUser.roles.cache.map(r => r).join(",");
  const highestRole1 = whoisUser.roles.highest;
  const whois1 = new MessageEmbed();
  console.log(whoisUser);
  whois1
      .setThumbnail(whoisUser.user.avatarURL())
      .setTitle(whoisUser.user.tag)
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setColor(swiss_blue)
      .addField("ID:", whoisUser.id)
      .addField("Username:", whoisUser.user.username)
      .addField("Roles:", roles1) // Says undefined
      .addField("Highest Role:", highestRole1) // says undefined
      .addField("Account Created On:", whoisUser.user.createdAt)
      .addField("Joined The Server on:", whoisUser.joinedAt) // says undefined
      .addField("Pressence:", whoisUser.user.presence.status) // says [object Object]
      .setFooter(client.version)
      .setTimestamp();
    await message.channel.send(whois1);
  }
