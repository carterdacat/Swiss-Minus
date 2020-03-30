import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import urban from "urban-dictionary";
import badwords from "../../badwords.json";
import { swiss_blue, error_red } from "../../config";

export let name = "dictionary";
export let description = "Search for the meaning of words";
export let aliases = ["urban", "whatdoesthismean"];
export let cooldown = 0;
export let canBeOff = true;

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  var word = args.join(" ") || "swiss001";
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
  )
    word = "hell nah";
  urban
    .term(word)
    .then(result => {
      const embed = new MessageEmbed()
        .setAuthor(
          `${message.author.tag} | Dictionary`,
          message.author.displayAvatarURL()
        )
        .setColor(swiss_blue)
        .setTitle(`Meaning of ${result.entries[0].word}`)
        .setDescription(
          `${result.entries[0].definition}\n\n\n${
            result.entries[0].example
              ? `For example: ${result.entries[0].example}`
              : ""
          }`.trim()
        )
        .setFooter(client.version)
        .setTimestamp();
      message.channel.send(embed);
    })
    .catch(error => {
      const embed = new MessageEmbed()
        .setAuthor(
          `${message.author.tag} | Dictionary`,
          message.author.displayAvatarURL()
        )
        .setColor(error_red)
        .setTitle(`That word doesn't exist!`)
        .setDescription(`${error}`)
        .setFooter(client.version)
        .setTimestamp();
      message.channel.send(embed);
    });
}
