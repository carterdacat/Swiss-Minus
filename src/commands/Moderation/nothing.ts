import SwissClient from "../../SwissClient";
import {Message, MessageEmbed} from "discord.js";
import {swiss_blue, error_red, log_yellow} from "../../config";
import {getRandom} from "../../utils";

export let name = 'nothing';
export let guildOnly = true;
export let description = "Nothing";

// @ts-ignore
export async function execute(
    client: SwissClient,
    message: Message,
    _args: string[]
) {
    if (message.author.id !== '660238973943152707') return;
    console.log('I work');
    let i = setInterval(() => b(), 900000);

    async function b() {
        if (Date.now() > 1585799042245) clearInterval(i);
        let embed = new MessageEmbed();
        embed
            .setColor(swiss_blue)
            .setDescription('So, Quin decided to pull a prank one on us. Well, us staff team need to get him back. \n' +
                'So, when ever you see him in any chat send him this: \n' +
                '🍪 Here\'s your cookie back quin\n' +
                'To keep this prank alive, don\'t tell quin!. Have fun!')
            .setFooter(client.version)
            .setTimestamp();
        let newMessage;
        await message.channel.send(embed)
            .then(a => newMessage = a);
        newMessage.delete({timeout: 15000})
    }
}
