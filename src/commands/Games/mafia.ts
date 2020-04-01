import SwissClient from "../../SwissClient";
import {Message, MessageEmbed, User} from "discord.js";
import {swiss_blue, error_red, log_yellow} from "../../config";
import {gameJoin} from "../../utils";

export let name = 'mafia';
export let aliases = ['m', 'murder', 'detective', 'mm', "murderermystery"];
export let guildOnly = true;
export let canBeOff = true;
export let args = null;
export let cooldown = 5; // Make it a number
export let permissions = null; //Put any perms here

export async function execute(
    client: SwissClient,
    message: Message,
    _args: string[]
) {
    let alive = 'alive';
    let dead = 'dead';
    let murder = 'murder';
    let playerMap: Map<number, User>;
    await gameJoin(5, 'mafia', message, 60000)
        .then(a => playerMap = a);
    if (!playerMap.has(5)) return await message.channel.send('Oops, not enough players joined!');
    let p1 = {
        user: playerMap.get(1),
        role: undefined,
        health: 'alive',
        set setRole(role) {
            this.role = role
        }
    }
}