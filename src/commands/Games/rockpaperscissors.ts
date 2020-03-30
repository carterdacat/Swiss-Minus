import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { log_yellow, swiss_blue } from "../../config";
import { getRandom } from "../../utils";

export let name = "rockpaperscissors";
export let description = "Play rock paper scissors with this bot";
export let aliases = ["rps"];
export let cooldown = 2;
export let canBeOff = true;

const choices = ["Rock", "Paper", "Scissors"];
const rock = ["rock", "r"];
const paper = ["paper", "p"];
const scissors = ["scissors", "s"];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  if (!args[0])
    return message.channel.send(
      `Try again but with \`${choices.join("`, `")}\``
    );
  let p1Choice: string = "";
  if (rock.includes(args[0].toLowerCase())) {
    p1Choice = "Rock";
  } else if (paper.includes(args[0].toLowerCase())) {
    p1Choice = "Paper";
  } else if (scissors.includes(args[0].toLowerCase())) {
    p1Choice = "Scissors";
  } else {
    return message.channel.send(
      `\`${
        args[0]
      }\` is not a valid option! Try again but with \`${choices.join("`, `")}\``
    );
  }
  const p2Choice = getRandom(choices);
  if (p1Choice === p2Choice) {
    const draw = new MessageEmbed()
      .setAuthor(
        `${message.author.tag} | Rock Paper Scissors`,
        message.author.displayAvatarURL()
      )
      .setTitle("Its a draw")
      .setColor(log_yellow)
      .setDescription(`Both players drew ${p1Choice} so its a draw! Try again!`)
      .setFooter(`GG | ${client.version}`)
      .setTimestamp();
    return message.channel.send(draw);
  }
  let won = "";
  if (
    (p1Choice === "Paper" && p2Choice === "Rock") ||
    (p1Choice === "Scissors" && p2Choice === "Paper") ||
    (p1Choice === "Rock" && p2Choice === "Scissors")
  ) {
    won = message.author.tag;
  } else if (
    (p2Choice === "Paper" && p1Choice === "Rock") ||
    (p2Choice === "Scissors" && p1Choice === "Paper") ||
    (p2Choice === "Rock" && p1Choice === "Scissors")
  ) {
    won = client.user.tag;
  }
  const embed = new MessageEmbed()
    .setAuthor(
      `${message.author.tag} | Rock Paper Scissors`,
      message.author.displayAvatarURL()
    )
    .setTitle(`${won} won!`)
    .setColor(swiss_blue)
    .setDescription(
      `${message.author.tag} drew ${p1Choice} and ${client.user.tag} drew ${p2Choice}`
    )
    .setTimestamp();
  message.channel.send(embed);
}
