import SwissClient from "../../SwissClient";
import { Message } from "discord.js";
import { convertMs } from "../../utils";

export let name = "ping";
export let description = "Gets the bot's latency";
export let aliases = ["pong"];
export let cooldown = 0;
export let canBeOff = true;

export async function execute(client: SwissClient, message: Message) {
  const m = await message.channel.send("Pinging...");
  m.edit(
    `🏓 Pong! Latency of Discord messages is ${convertMs(
      (m.createdTimestamp - message.createdTimestamp) / 2
    )}. Latency of Discord API is ${convertMs(client.ws.ping)}.`
  );
}
