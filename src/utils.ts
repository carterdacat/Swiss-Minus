import {
  Message,
  CollectorFilter,
  MessageCollector,
  ReactionCollector,
  ReactionEmoji,
  MessageReaction,
  User
} from "discord.js";

export function getRandom(array: Array < any > ) {
  return array[Math.floor(Math.random() * array.length)];
}
export function convertMs(ms, delim = ":") {
  const showWith0 = value => (value < 10 ? `0${value}` : value);
  const days = showWith0(Math.floor((ms / (1000 * 60 * 60 * 24)) % 60));
  const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 24));
  const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
  const seconds = showWith0(Math.floor((ms / 1000) % 60));
  if (parseInt(days)) return `${days}d`;
  if (parseInt(hours)) return `${hours}h`;
  if (parseInt(minutes)) return `${minutes}min`;
  if (parseInt(seconds)) return `${seconds}s`;
  if (parseInt(ms)) return `${ms}ms`;
  // return `${parseInt(days) ? `${days} day${days > 1 ? 's' : ''}, ` : ''}${parseInt(hours) ? `${hours} hour${hours > 1 ? 's' : ''}, ` : ''}${parseInt(minutes) ? `${minutes} min${minutes > 1 ? 's' : ''},` : ''} ${seconds} sec${seconds > 1 ? 's' : ''}`;
}
export function convertBytes(bytes) {
  const decimals = 2;
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
export async function awaitMessage(
  message: Message,
  filter: CollectorFilter
) {
  let promise = new Promise((resolve, reject) => {
    let x = new MessageCollector(message.channel, filter, {
      time: 60000
    });
    x.on("collect", msg => {
      resolve(msg);
    });
    x.on("end", a => {
      reject(a);
    });
  });
  return await promise
    .then(function (msg: Message) {
      return msg;
    })
    .catch(function (b) {
      message.channel.send("Oops, your time ran out!");
      return null;
    });
}
export function arrayJoin(
  array: Array < any > ,
  separator: string,
  specialChar: string,
  lastKeyword: string
) {
  return `${array
    .slice(0, array.length - 1)
    .join(separator)}${specialChar} ${lastKeyword} ${specialChar}${
    array[array.length - 1]
  }`;
}
export async function gameJoin(
    playerCount: number,
    game: String,
    message: Message,
    timeout: number
) {
  let neededPlayers = playerCount - 1;
  let firstText = `React to this message to play ${game}!`;
  let secondMsg = `\n \n \n ${message.author.tag}`;
  let thirdMsg = '';
  let order = 1;
  let msg: Message;
  for (let a = 0; neededPlayers > a; a++) {
    thirdMsg = thirdMsg + '\n Empty'
  }
  await message.channel.send(firstText + secondMsg + thirdMsg)
      .then(
          (mesg) => {
            msg = mesg
          }
      );
  let players = new Map([
    [order, message.author]
  ]);
  order++;
  await msg.react('🚪');
  let rcollector = new Promise((resolve, reject) => {
    let reactCollector = new ReactionCollector(msg, (a: MessageReaction, b: User) => 1 === 1 && !b.bot && b !== message.author, {
      maxUsers: neededPlayers,
      time: timeout
    });
    reactCollector.on('collect', (reaction: MessageReaction, user: User) => {
      let c = msg.content;
      let d = c.replace('Empty', user.tag);
      players.set(order, user);
      order++;
      msg.edit(d)
    });
    reactCollector.on('end', a => {
      msg.delete();
      resolve()
    })
  });
  await rcollector
      .then(a => {
        return players
      })
      .catch(a => {
        return players
      });
  return players
}