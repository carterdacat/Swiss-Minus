import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { swiss_blue } from "../../config";

export let name = 'epicgamerrate';
export let description = 'See how much of an epic gamer you are';
export let cooldown = 5;
export let aliases = ["epicgamerrate", "rate", "gamer"];

export async function execute(client: SwissClient, message: Message, _args: string[]) {

    let gamerRate = Math.floor((Math.random() * 100) + 1);

    const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle("epic gamer rate machine")
        .setDescription(`You are ${gamerRate}% epic gamer :video_game:`)
        .setColor(swiss_blue)
        .setFooter(client.version)
        .setTimestamp();
    await message.channel.send(embed);
}
