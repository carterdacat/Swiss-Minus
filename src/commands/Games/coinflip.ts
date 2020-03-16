import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { swiss_blue } from "../../config";
import { getRandom } from "../../utils";

export let name = "coinflip";
export let description = "Game: Coin, return head or tails to the user";
export let cooldown = 5;
export let aliases = ["coinflip", "coin", "flip", "headsortails"];

const coinArray = ["Heads", "Tails"];

export async function execute(
  client: SwissClient,
  message: Message,
  _args: string[]
) {
  const answer = Math.random() <= 0.01 ? "Side" : getRandom(coinArray);

  const embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle("Coin")
    .setColor(swiss_blue)
    .addField("And the coin landed on", answer)
    .setFooter(client.version)
    .setTimestamp();
  message.channel.send(embed);
}
