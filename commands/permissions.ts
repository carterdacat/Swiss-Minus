import SwissClient from "../SwissClient";
import { Message, GuildMember, MessageEmbed } from "discord.js";
import { swiss_blue } from "../config";
import { arrayJoin } from "../utils";

export let name = "permissions";
export let description = "Check the permissions of a user";
export let aliases = ["perms", "p"];
export let usage = "user";
export let cooldown = 5;
export let guildOnly = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const permMentioned =
    message.mentions.members.first() || // First mentioned user
    (message.guild.members.cache.get(args[0]) as GuildMember) || // User ID
    (message.guild.members.cache.find(
      m => m.user.username === args[0]
    ) as GuildMember) || // Username
    (message.guild.members.cache.find(
      m => m.nickname === args[0]
    ) as GuildMember) || // Nickname
    message.member; // Member who sent the message
  const permEmbed = new MessageEmbed();
  permEmbed
    .setAuthor(
      `${permMentioned.user.tag} | Permissions`,
      permMentioned.user.avatarURL()
    )
    .setColor(swiss_blue)
    .setTitle(`Permissions of ${permMentioned.user.tag}`)
    .setDescription(
      `\`${arrayJoin(
        permMentioned.permissions.toArray(),
        "`, `",
        "`",
        "and"
      )}\``
    )
    .setFooter(client.version)
    .setTimestamp();
  await message.channel.send(permEmbed);
}
