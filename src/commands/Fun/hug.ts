import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { swiss_blue, error_red } from "../../config";


export let name = 'hug';
export let description = "Hugs the mentioned user.";
export let cooldown = 5;

export async function execute(client: SwissClient, message: Message, _args: string[]) {

    let mentioned = message.mentions.members.first();

    if(mentioned){
        await message.channel.send({
            embed: {
                color: swiss_blue,
                description: `🤗 <@${message.author.id}> gave <@${mentioned.id}> a hug`,
                timestamp: new Date(),
                footer: {
                    text: client.version,
                    icon_url: '',
                }
            }
        });
    } else {
        await message.channel.send({
            embed: {
                color: error_red,
                description: `You must mention a member. Usage: \`hug @member\``,
                timestamp: new Date(),
                footer: {
                    text: client.version,
                    icon_url: '',
                }
            }
        });
    }
}