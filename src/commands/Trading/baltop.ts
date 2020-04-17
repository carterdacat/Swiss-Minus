import SwissClient from "../../SwissClient";
import {Message, MessageEmbed} from "discord.js";
import {swiss_blue, error_red, log_yellow} from "../../config";
import {getRandom} from "../../utils";

export let name = 'baltop';
export let aliases = ['bt', 'leader', 'leaderboard'];
export let guildOnly = false;
export let canBeOff = false;
export let args = '';
export let cooldown = undefined; // Make it a number
export let permissions = null; //Put any perms here

export async function execute(
    client: SwissClient,
    message: Message,
    _args: string[]
) {
    let idArray = await client.db.query('SELECT id FROM money order by balance desc fetch first 5 rows only');
    let p1b = await client.db.query('SELECT balance FROM money WHERE id = $1', [idArray.rows[0].id]);
    let p2b = await client.db.query('SELECT balance FROM money WHERE id = $1', [idArray.rows[1].id]);
    let p3b = await client.db.query('SELECT balance FROM money WHERE id = $1', [idArray.rows[2].id]);
    let p4b = await client.db.query('SELECT balance FROM money WHERE id = $1', [idArray.rows[3].id]);
    let p5b = await client.db.query('SELECT balance FROM money WHERE id = $1', [idArray.rows[4].id]);

    let embed = new MessageEmbed as MessageEmbed;
    embed
        .setColor(swiss_blue)
        .setFooter(client.version)
        .setTimestamp()
        .addField(`1st, ${p1b}`, client.users.cache.get(idArray.rows[0].id).tag)
        .addField(`2nd, ${p2b}`, client.users.cache.get(idArray.rows[1].id).tag)
        .addField(`3rd, ${p3b}`, client.users.cache.get(idArray.rows[2].id).tag)
        .addField(`4th, ${p4b}`, client.users.cache.get(idArray.rows[3].id).tag)
        .addField(`5th, ${p5b}`, client.users.cache.get(idArray.rows[4].id).tag);
    return await message.channel.send(embed)
}