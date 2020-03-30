import SwissClient from "../../SwissClient";
import { MessageAttachment, Message } from "discord.js";

export let name = "king";
export let canBeOff = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  await message.channel.send('Congrats <@390939447509778432>');
}
