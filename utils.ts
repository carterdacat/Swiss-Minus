import { Message, CollectorFilter, MessageCollector } from "discord.js";

export function getRandom(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}
export async function awaitMessage(message: Message, filter: CollectorFilter) {
  let promise = new Promise((resolve, reject) => {
    let x = new MessageCollector(message.channel, filter, { time: 60000 });
    x.on("collect", msg => {
      resolve(msg);
    });
    x.on("end", a => {
      reject(a);
    });
  });
  return await promise
    .then(function(msg: Message) {
      return msg;
    })
    .catch(function(b) {
      message.channel.send("Oops, your time ran out!");
      return null;
    });
}
export function arrayJoin(
  array: Array<any>,
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
