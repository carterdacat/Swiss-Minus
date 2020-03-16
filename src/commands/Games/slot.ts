import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { swiss_blue } from "../../config";
import { getRandom } from "../../utils";

export let name = "slot";
export let description = "Play with a slot machine!";
export let aliases = ["slotmachine", "luck"];
export let cooldown = 5;

const emojis = ["✈️", "🛩️", "🚀", "🦟", "🚁", "🏔️"]; // The more emojis the harder for one win
const winner = [
  "Hooray! You have won...nothing.",
  "That took some time didn't it"
];
const good = ["Nice try", "That was close"];
const worst = [
  "Better luck next time",
  "Try again, maybe you'll get something better"
];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const slots = [getRandom(emojis), getRandom(emojis), getRandom(emojis)];
  let msg = "";
  // If all slots have the same emoji
  if (slots[0] === slots[1] && slots[1] === slots[2] && slots[0] === slots[2]) {
    msg = getRandom(winner);
    // If two emojis are the same
  } else if (
    slots[0] === slots[1] ||
    slots[0] === slots[2] ||
    slots[1] === slots[2]
  ) {
    msg = getRandom(good);
    // Worst case, no two slots were the same
  } else {
    msg = getRandom(worst);
  }
  const embed = new MessageEmbed()
    .setAuthor(
      `${message.author.tag} | Slot machine`,
      message.author.displayAvatarURL()
    )
    .setColor(swiss_blue)
    .setTitle(msg)
    .setDescription(`\`▶️\`  ${slots.join(" ")}  \`◀️\``)
    .setFooter(`GG | ${client.version}`)
    .setTimestamp();
  message.channel.send(embed);
}
