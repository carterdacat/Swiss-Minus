import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { swiss_blue } from "../../config";
import { getRandom } from "../../utils";

export let name = "tableflip";
export let description = "Flipping table";
export let cooldown = 5;
export let aliases = ["tableflip", "table"];


export async function execute(
    client: SwissClient,
    message: Message,
    _args: string[]
) {
    const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle("")
        .setDescription('╯°□°）╯︵ ┻━┻')
        .setColor(swiss_blue)
        .setFooter(client.version)
        .setTimestamp();
    message.channel.send(embed);
}
