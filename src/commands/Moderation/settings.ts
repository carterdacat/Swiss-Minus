import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { Client as PgClient } from "pg";
import { swiss_blue } from "../../config";

export let name = "settings";
export let description = "Shows or changes settings";
export let aliases = ["Settings", "setting", "Setting"];
export let usage = "[settings] <name> <value>";
export let guildOnly = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[],
  db: PgClient
) {
  const mod = message.member.hasPermission("MUTE_MEMBERS");
  if (!args[0]) {
    let result: {
      [key: string]: string;
    } = {};
    const rows = (await db.query("SELECT * FROM settings")).rows;

    const embed = new MessageEmbed()
      .setTitle("Settings")
      .setColor(swiss_blue)
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setFooter(client.version)
      .setTimestamp();
    for (let row of rows) {
      embed.addField(row.name, row.value);
    }
    await message.channel.send(embed);
  } else if (args[1]) {
    if (!mod)
      return await message.channel.send(
        "Sorry, but you don't have permissions to change settings!"
      );
    const setting = args[0];
    const value = args.slice(1).join(" ");
    if (
      setting === "bot" &&
      (!message.member.hasPermission("ADMINISTRATOR") ||
        !(message.author.id === "660238973943152707"))
    )
      return;
    const result = await db.query(
      "UPDATE settings SET value = $2 WHERE name = $1",
      [setting, value]
    );
    if (result.rowCount === 0)
      return await message.channel.send(
        `Hmm, I don't see a setting called ${setting}.`
      );
    await message.channel.send(
      `Yay! Successfully set \`${setting}\` to \`${value}\`.`
    );
  } else {
    await message.channel.send("Oops, this isn't how you use the command!");
  }
}
