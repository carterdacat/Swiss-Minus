import SwissClient from "../../SwissClient";
import { Message, MessageAttachment } from "discord.js";
import { Client as PgClient } from "pg";

export let name = "bernie";
export let description = "I am no longer asking";
export let canBeOff = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[],
  db: PgClient
) {
  return message.channel.send(
    new MessageAttachment(
      "https://cdn.discordapp.com/attachments/592768337407115264/678386879653085198/image0.png",
      "bernie.jpg"
    )
  );
}
