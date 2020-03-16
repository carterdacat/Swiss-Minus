import SwissClient from "../../SwissClient";
import { Message, MessageEmbed, TextChannel, GuildMember } from "discord.js";
import { Client as PgClient } from "pg";
import { swiss_blue, error_red, log_yellow } from "../../config";

export const name = "givecrate";
export const description = "Gives a user a crate";
export const usage = `[user] [chest type] <reason>`;
export const guildOnly = true;
export const permissions = ["MANAGE_ROLES"];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[],
  db: PgClient
) {
  const id = await db.query("SELECT id FROM cards WHERE id = $1", [
    message.author.id
  ]);
  if (id.rowCount === 0)
    await db.query(
      "INSERT INTO cards (id, common, rare, jumbo, ultra, ledgendary) VALUES($1, 0, 0, 0, 0, 0)",
      [message.author.id]
    );
  const whoisUser =
    message.mentions.members.first() ||
    (message.guild.members.cache.get(args[0]) as GuildMember);
  const mod =
    message.member.hasPermission("MANAGE_ROLES") ||
    message.author.id === "660238973943152707";
  if (
    mod &&
    whoisUser.id === message.author.id &&
    message.author.id !== "660238973943152707"
  ) {
    return message.channel.send("Don't cheat, thats not fair");
  }
  let type = args[1];
  let chestTypes = ["common", "rare", "jumbo", "ultra", "ledgendary"];
  if (!chestTypes.includes(type)) {
    let embed = new MessageEmbed()
      .setColor(error_red)
      .setDescription("Hey! Thats not a chest type.")
      .setFooter(client.version)
      .setTimestamp();
    return message.channel.send(embed);
  }
  if (type === "common")
    await db.query("UPDATE cards SET common = common + 1 WHERE id = $1", [
      whoisUser.id
    ]);
  if (type === "rare")
    await db.query("UPDATE cards SET rare = rare + 1 WHERE id = $1", [
      whoisUser.id
    ]);
  if (type === "jumbo")
    await db.query("UPDATE cards SET jumbo = jumbo + 1 WHERE id = $1", [
      whoisUser.id
    ]);
  if (type === "ultra")
    await db.query("UPDATE cards SET ultra = ultra + 1 WHERE id = $1", [
      whoisUser.id
    ]);
  if (type === "ledgendary")
    await db.query(
      "UPDATE cards SET ledgendary = ledgendary + 1 WHERE id = $1",
      [whoisUser.id]
    );
  let embed1 = new MessageEmbed()
    .setDescription("I added the crate!")
    .setColor(swiss_blue)
    .setFooter(client.version)
    .setTimestamp();
  message.channel.send(embed1);
  let embed2 = new MessageEmbed()
    .setColor(swiss_blue)
    .setDescription(`Hey, <@${message.author.id}> gave you a ${type} crate!`)
    .setFooter(client.version)
    .setTimestamp();
  whoisUser.send(embed2);
  let log = new MessageEmbed()
    .setColor(log_yellow)
    .setTitle("!givecrate")
    .setDescription(
      `<@${message.author.id}> gave <@${whoisUser.id}> a ${type} chest`
    )
    .setFooter(client.version)
    .setTimestamp();
  const log1 = client.channels.cache.get("674624372170031145") as TextChannel;
  const log2 = client.channels.cache.get("592805129003073570") as TextChannel;
  log1.send(log);
  return log2.send(log);
}
