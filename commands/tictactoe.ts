import SwissClient from "../SwissClient";
import { swiss_blue } from "../config";
import {
  Message,
  GuildMember,
  MessageEmbed,
  ReactionCollector
} from "discord.js";
import { awaitMessage, getRandom } from "../utils";

export let name = "tictactoe";
export let description = "Play tictactoe with a friend or with the bot!";
export let aliases = ["ttt"];
export let usage = "[user]";
export let cooldown = 60;

const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[]
) {
  const player1 = message.member;
  const player2 =
    message.mentions.members.first() || // First mention
    (message.guild.members.cache.get(args[0]) as GuildMember) || // User ID
    (message.guild.members.cache.find(
      m => m.user.username === args[0]
    ) as GuildMember) || // Username
    (message.guild.members.cache.find(
      m => m.nickname === args[0]
    ) as GuildMember) || // Nickname
    message.guild.me; // Bot
  if (player2.user.bot && player2.user.id !== client.user.id)
    return message.channel.send(`You can't play with a bot other than me!`);
  if (player1 === player2)
    return message.channel.send(`You can't play with yourself`);
  if (player2 !== message.guild.me) {
    message.channel.send(
      `<@${player2.user.id}>, do you want to play tictactoe with <@${player1.user.id}>? Respond with \`yes\` if you want to continue, otherwise respond with \`no\` to this message.`
    );
    message.channel.startTyping(60000);
    const response = await awaitMessage(
      message,
      m =>
        m.author.id === player2.user.id &&
        ["yes", "no"].includes(m.content.toLowerCase())
    );
    message.channel.stopTyping(true);
    if (response.content.toLowerCase() === "no")
      return message.channel.send(
        `<@${player1.user.id}> won because <@${player2.user.id}> gave up before the game even started!`
      );
  }
  var currentPlayer = player2;
  var embed = new MessageEmbed()
    .setAuthor("Tic Tac Toe", client.user.displayAvatarURL())
    .setColor(swiss_blue);
  var stop = false;
  const gameMsg = await message.channel.send("Preparing the board...");
  const board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  var playable = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const player1Sign = "❌";
  const player2Sign = "⭕";
  await Promise.all(reactions.map(r => gameMsg.react(r)));
  function parseSignFromBoard(index): string {
    const sign = board[index];
    var finalSign = reactions[index];
    if (sign === player1.user.id) finalSign = player1Sign;
    if (sign === player2.user.id) finalSign = player2Sign;
    return finalSign;
  }
  async function delay(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }
  function allAreSame(...args) {
    if (args.every(v => v === args[0])) return args[0];
    return false;
  }
  function updateGameEmbed() {
    embed
      .setTitle(`${currentPlayer.user.tag}'s turn`)
      .setDescription(
        [
          `${parseSignFromBoard(0)}|${parseSignFromBoard(
            1
          )}|${parseSignFromBoard(2)}`,
          `${parseSignFromBoard(3)}|${parseSignFromBoard(
            4
          )}|${parseSignFromBoard(5)}`,
          `${parseSignFromBoard(6)}|${parseSignFromBoard(
            7
          )}|${parseSignFromBoard(8)}`
        ].join("\n")
      );
  }
  function findWinner(): string {
    const possibleWins = [
      // Horizontal
      allAreSame(board[0], board[1], board[2]),
      allAreSame(board[3], board[4], board[5]),
      allAreSame(board[6], board[7], board[8]),
      // Vertical
      allAreSame(board[0], board[3], board[6]),
      allAreSame(board[1], board[4], board[7]),
      allAreSame(board[2], board[5], board[8]),
      // The two diagonals
      allAreSame(board[0], board[4], board[8]),
      allAreSame(board[2], board[4], board[6])
    ];
    return possibleWins.find(w => w !== false && w !== " ") || "";
  }
  function handleUserInput(emoji) {
    board[reactions.indexOf(emoji)] = currentPlayer.id;
    gameMsg.reactions.cache.find(r => r.emoji.name === emoji).remove();
    playable[reactions.indexOf(emoji)] = null;
    const winner = findWinner();
    console.log(winner);
    if (playable.every(p => p === null)) {
      stop = true;
      message.channel.stopTyping(true);
      updateGameEmbed();
      embed
        .setTitle("Its a draw!")
        .setFooter(`GG | ${client.version}`)
        .setTimestamp();
      gameMsg.reactions.cache.forEach(r => r.remove());
      gameMsg.edit(
        `${player1.user.tag} = ${player1Sign}\n${player2.user.tag} = ${player2Sign}`,
        embed
      );
      return;
    }
    if (winner !== "") {
      stop = true;
      message.channel.stopTyping(true);
      updateGameEmbed();
      embed
        .setTitle(`${client.users.cache.get(winner).tag} won!`)
        .setFooter(`GG | ${client.version}`)
        .setTimestamp();
      gameMsg.reactions.cache.forEach(r => r.remove());
      gameMsg.edit(
        `${player1.user.tag} = ${player1Sign}\n${player2.user.tag} = ${player2Sign}`,
        embed
      );
      return;
    }
    if (!stop) {
      loop();
    }
  }
  loop();
  async function loop() {
    if (currentPlayer === player2) currentPlayer = player1;
    else if (currentPlayer === player1) currentPlayer = player2;
    updateGameEmbed();
    await gameMsg.edit(
      `${player1.user.tag} = ${player1Sign}\n${player2.user.tag} = ${player2Sign}`,
      embed
    );

    if (currentPlayer.user.id === client.user.id) {
      const randomDelay = [2, 5]; // Delay of 2 - 5s
      delay(
        (Math.floor(Math.random() * randomDelay[1] - randomDelay[0]) +
          randomDelay[0]) *
          1000
      ).then(() => {
        handleUserInput(reactions[getRandom(playable.filter(p => p !== null))]);
      });
    }
    const collector = new ReactionCollector(
      gameMsg,
      (r, u) =>
        gameMsg.reactions.cache.array().includes(r) &&
        u.id === currentPlayer.id,
      {
        time: 60000
      }
    );

    collector.on("collect", reaction => {
      collector.endReason();
      handleUserInput(reaction.emoji.name);
    });

    collector.on("end", collected => {
      if (collected.size === 0) {
        const timeout = new MessageEmbed()
          .setColor(swiss_blue)
          .setFooter(`Not fair | ${client.version}`)
          .setTimestamp();
        if (currentPlayer === player1) {
          timeout.setTitle(`${player2.user.tag} won!`);
          gameMsg.edit(
            `<@${player2.user.id}> won because <@${player1.user.id}> timed out!`,
            timeout
          );
        } else {
          timeout.setTitle(`${player1.user.tag} won!`);
          gameMsg.edit(
            `<@${player1.user.id}> won because <@${player2.user.id}> timed out!`,
            timeout
          );
        }
        stop = true;
        gameMsg.reactions.cache.forEach(r => r.remove());
        message.channel.stopTyping(true);
      }
    });
  }
}
