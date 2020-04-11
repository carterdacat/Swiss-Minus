import SwissClient from "../../SwissClient";
import {Message, MessageEmbed} from "discord.js";
import {swiss_blue, error_red, log_yellow} from "../../config";
import {getRandom} from "../../utils";
import wiki from 'wikijs';
import badwords from "../../badwords.json";

export let name = 'wiki';
export let aliases = ['wikipedia', 'w'];
export let guildOnly = false;
export let canBeOff = false;
export let args = '<Search term>';
export let cooldown = 3; // Make it a number

export async function execute(
    client: SwissClient,
    message: Message,
    _args: string[]
) {
    let word = _args.join(" ") || "swiss001";
    const vowels = /[aeiou]/gi;
    const filter = /[^a-z]/gi;
    if (
        badwords.includes(
            word
                .toLowerCase()
                .replace(filter, " ")
                .trim()
                .replace(vowels, " ")
        ) ||
        word
            .toLowerCase()
            .replace(filter, " ")
            .trim()
            .replace(vowels, " ") === ""
    ) {
        return message.channel.send('Hey, that\'s a nono word :eyes:')
    }
    let result;
    let msg;
    let url;
    let image;
    await wiki()
        .search(word)
        .then(a => {
            result = a.results[0];
        });
    await wiki()
        .page(result)
        .then(async a => {
            await a.summary().then(value => {
                if (value.length > 2048) {
                    msg = 'The summary seems to be above 2048 charters, please us the link to review it.'
                } else msg = value;
            });
            await a.mainImage().then(value => {
                image = value;
            });
            url = await a.url();
        });
    let embed = new MessageEmbed;
    embed
        .setColor(swiss_blue)
        .setDescription(msg)
        .setTitle(result)
        .setURL(url)
        .setImage(image);

    return message.channel.send(embed);
}