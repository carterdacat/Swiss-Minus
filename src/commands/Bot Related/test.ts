import SwissClient from "../../SwissClient";
import {
    swiss_blue
} from "../../config";
import {
    Message,
    GuildMember,
    MessageEmbed,
    ReactionCollector,
    MessageReaction,
    User
} from "discord.js";
import {
    awaitMessage,
    getRandom
} from "../../utils";

export let name = "test";

export async function execute(
    client: SwissClient,
    message: Message,
    args: string[]
) {
message.channel.send('This is a test command for testing!')
}