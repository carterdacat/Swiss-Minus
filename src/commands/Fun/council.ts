import SwissClient from "../../SwissClient";
import { Message, MessageAttachment, GuildMember } from "discord.js";
import { Client as PgClient } from "pg";

export let name = "council";
export let description = "The council will decide your fate";
export let canBeOff = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[],
  db: PgClient
) {
  let mentioned =
    message.mentions.members.first() ||
    (message.guild.members.cache.get(args[0]) as GuildMember);
  if (!mentioned) {
    return message.channel.send(
      new MessageAttachment(
        "https://media.discordapp.net/attachments/592463507124125706/677704599884529685/council.jpg",
        "council.jpg"
      )
    );
  }
  message.delete();
  message.channel.send(`<@${mentioned.id}>, Your time has come...`);
  setTimeout(function() {
    return message.channel.send(
      new MessageAttachment(
        "https://media.discordapp.net/attachments/592463507124125706/677702569908371498/council.jpg",
        "council.jpg"
      )
    );
  }, 2000);
}
