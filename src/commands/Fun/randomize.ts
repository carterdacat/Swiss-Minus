import SwissClient from "../../SwissClient";
import {Message} from "discord.js";

export let name = "randomize";
export let aliases = ["r"];
export let canBeOff = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
    if (!args[0]) return;
    let msg: any = args.join(' ');
    await message.delete();
    msg = msg.toLowerCase();
    msg = msg.split('');
    for (let a = 0; msg.length > a; a++) {
        let b = Math.random();
        if (b < 0.5) msg[a] = msg[a].toLowerCase();
        else msg[a] = msg[a].toUpperCase();
    }
    msg = msg.join('');
    await message.channel.send(msg)
}
