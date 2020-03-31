import SwissClient from "../../SwissClient";
import {Message, MessageEmbed} from "discord.js";
import { swiss_blue } from "../../config";


export let name = "level";
export let aliases = ["levelup", "leveltutorial", "levels"];
export let cooldown = 10;
export let description = "Creates a poll in whatever channel you would like to";

export async function execute(
    client: SwissClient,
    message: Message,
    args: string[]
  ) {

    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle("**Level Roles** :arrow_double_up:")
        .setDescription("These roles are achievable by gaining random exp points by chatting. Not every message will give you exp, so spamming won't help.")
        .addField("Member", "Level 0")
        .addField("Active Member", "Level 5")
        .addField("SwissClub", "Level 10")
        .addField("SwissGold", "Level 15 - 20")
        .addField("SwissPlatinum", "Level 25 -  35")
        .addField("SwissElite", "Level 45")
        .addField("Usage", "You can view your level by doing `=r` in <#592770427948892171>")
        .setColor(swiss_blue)
        .setFooter(client.version)
        .setTimestamp();
      await message.channel.send(embed);
}