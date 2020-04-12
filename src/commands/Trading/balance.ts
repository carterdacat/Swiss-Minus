import SwissClient from "../../SwissClient";
import {Message, MessageEmbed, TextChannel} from "discord.js";
import {swiss_blue, error_red, log_yellow} from "../../config";
import {getRandom} from "../../utils";
import {Client as PgClient} from "pg";

export let name = 'balance';
export let description = 'Shows your current balance';
export let aliases = ['b', 'B'];
export let usage = `<user> <mod only: <remove> <amount(Can\'t be more than their balance)> <reason> >`;
export let guildOnly = true;
export let cooldown = 0; // Make it a number

export async function execute(
    client: SwissClient,
    message: Message,
    args: string[],
    db: PgClient
) {
    let mentionedUser = message.mentions.users.first() || //Mention
        message.author; //The user
    let bal = await db.query(`SELECT balance FROM money WHERE id = $1`, [mentionedUser.id]);
    console.log(bal);
    let currency;
    if (bal.rowCount === 0) {
        await db.query("INSERT INTO money VALUES ($1,$2)", [mentionedUser, 0]);
        currency = 0
    } else currency = bal.rows[0].balance;
    if (!args[1]) {
        await message.reply(`Balance: ${currency} swiss bux in your account! Chat, or open crates to get more!`)
    } else if (args[3]) {
        let logs = client.channels.cache.get('674624372170031145');
        if (parseInt(args[2], 10) > currency) return await message.reply('Oops, you cant do that. They dont have that much money');
        await db.query('UPDATE money SET balance = balance - $2 WHERE id = $1', [mentionedUser, parseInt(args[2], 10)]);
        let embed = new MessageEmbed();
        embed
            .setTimestamp()
            .setFooter(client.version)
            .setDescription(`${message.author.tag} took ${parseInt(args[2])} from ${mentionedUser.tag}`)
            .setFooter(log_yellow);
        let logchannel = client.channels.cache.get('674624372170031145') as TextChannel;
        await logchannel.send(embed);
        return await message.channel.send("I removed the money")
    } else return await message.channel.send("Hmm something went wrong")
}