import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { swiss_blue } from "../../config";
import { getRandom } from "../../utils";

export let name = "topic";
export let description = "Gets a random chat topic, if the chat is dying!";
export let aliases = ["Topic", "t", "T"];
export let canBeOff = true;

const quotes = [
  "If you where any animal, what would you be and why?",
  "iPhone or Android?",
  "Swiss001 old format or new?",
  "Look left than right, or right than left?",
  "Is it half full, or half empty",
  "Twix left, or twix right",
  "Is the max safe?",
  "What have you been up to recently?",
  "Whats your favourite plane?",
  "SwissBot or SwissMinus?",
  "Windows or Apple?"
];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const embed = new MessageEmbed()
    .setTitle("")
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setColor(swiss_blue)
    .addField("**Topic:**", getRandom(quotes))
    .setFooter(client.version)
    .setTimestamp();
  await message.channel.send(embed);
}
