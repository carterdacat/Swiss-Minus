import SwissClient from "../../SwissClient";
import { Message, MessageEmbed } from "discord.js";
import { Client as PgClient } from "pg";
import { swiss_blue, error_red } from "../../config";
import planes from "../../planes";

export let name = "cards";
export let description = "Card info";
export let usage = "<card name>";
export let aliases = ["card"];

const aplanes = Object.values(planes);
class Plane {
  name: string;
  rarity: string;
  url: string;
  constructor(name: string) {
    this.name = name;
    this.rarity = aplanes.find(p => p.name === name).rarity;
    this.url = aplanes.find(p => p.name === name).url;
  }
}
const crate: string[] = ["common", "rare", "epic", "ultra", "ledgendary"];
let commonss = aplanes
  .filter(planes => planes.rarity === "common")
  .map(m => m.name);
let raress = aplanes
  .filter(planes => planes.rarity === "rare")
  .map(m => m.name);
let epicss = aplanes
  .filter(planes => planes.rarity === "epic")
  .map(m => m.name);
let ultrass = aplanes
  .filter(planes => planes.rarity === "ultra")
  .map(m => m.name);
let legendaryss = aplanes
  .filter(planes => planes.rarity === "ledgendary")
  .map(m => m.name);

export async function execute(
  client: SwissClient,
  message: Message,
  args: string[],
  db: PgClient
) {
  let carda = [args[0]];
  if (args[1]) carda.push(args[1]);
  const id = await db.query("SELECT id FROM cards WHERE id = $1", [
    message.author.id
  ]);
  if (id.rowCount === 0)
    await db.query(
      "INSERT INTO cards (id, common, rare, jumbo, ultra, ledgendary) VALUES($1, 0, 0, 0, 0, 0)",
      [message.author.id]
    );
  let lengthe = aplanes.length;
  for (
    let count = 1;
    lengthe * 2 ===
      (((
        await db.query(
          "SELECT count(*) FROM information_schema.columns WHERE table_name = 'cards'"
        )
      ).rows[0].count - 8) as number) && lengthe >= count;
    count++
  ) {
    let testm = `UPDATE cards SET ${planes[count].name}count = 0 WHERE ${planes[count].name}count IS NULL AND id = '${message.author.id}'`;
    let testn = `UPDATE cards SET ${planes[count].name}levels = 0 WHERE ${planes[count].name}levels IS NULL AND id = '${message.author.id}'`;
    await db.query(testm);
    await db.query(testn);
  }
  if (!args[0]) {
    let cards = new MessageEmbed();
    let cs = [];
    let rs = [];
    let es = [];
    let us = [];
    let ls = [];
    let amtC = commonss.length;
    let amtR = raress.length;
    let amtE = epicss.length;
    let amtU = ultrass.length;
    let amtL = legendaryss.length;
    for (let a = 0; amtC > a; a++) {
      let card = commonss[a];
      let name = new Plane(card).name.split("_").join(" ");
      let countT = `SELECT ${new Plane(card).name
        .split(" ")
        .join("_")}count AS counte FROM cards WHERE id = '${
        message.author.id
      }'`;
      let countS = (await db.query(countT)).rows[0].counte;
      cs.push(`${countS} ${name}s`);
    }
    for (let a = 0; amtR > a; a++) {
      let card = raress[a];
      let name = new Plane(card).name.split("_").join(" ");
      let countT = `SELECT ${new Plane(card).name
        .split(" ")
        .join("_")}count AS counte FROM cards WHERE id = '${
        message.author.id
      }'`;
      let countS = (await db.query(countT)).rows[0].counte;
      rs.push(`${countS} ${name}s`);
    }
    for (let a = 0; amtE > a; a++) {
      let card = epicss[a];
      let name = new Plane(card).name.split("_").join(" ");
      let countT = `SELECT ${new Plane(card).name
        .split(" ")
        .join("_")}count AS counte FROM cards WHERE id = '${
        message.author.id
      }'`;
      let countS = (await db.query(countT)).rows[0].counte;
      es.push(`${countS} ${name}s`);
    }
    for (let a = 0; amtU > a; a++) {
      let card = ultrass[a];
      let name = new Plane(card).name.split("_").join(" ");
      let countT = `SELECT ${new Plane(card).name
        .split(" ")
        .join("_")}count AS counte FROM cards WHERE id = '${
        message.author.id
      }'`;
      let countS = (await db.query(countT)).rows[0].counte;
      us.push(`${countS} ${name}s`);
    }
    for (let a = 0; amtL > a; a++) {
      let card = legendaryss[a];
      let name = new Plane(card).name.split("_").join(" ");
      let countT = `SELECT ${new Plane(card).name
        .split(" ")
        .join("_")}count AS counte FROM cards WHERE id = '${
        message.author.id
      }'`;
      let countS = (await db.query(countT)).rows[0].counte;
      ls.push(`${countS} ${name}s`);
    }
    cards
      .setColor(swiss_blue)
      .setTitle("Cards")
      .addField("Commons", `You have: ${cs}`)
      .addField("Rares", `You have: ${rs}`)
      .addField("Epics", `You have: ${es}`)
      .addField("Ultras", `You have: ${us}`)
      .addField("Ledgendars", `You have: ${ls}`)
      .setFooter(client.version)
      .setTimestamp();
    return message.author.send(cards);
  }
  if (
    aplanes
      .map(m => m.name)
      .includes(
        carda
          .join("_")
          .charAt(0)
          .toUpperCase() + carda.join("_").slice(1)
      )
  ) {
    let cardP = new MessageEmbed();
    let cardRarity = aplanes
      .filter(
        plane =>
          plane.name ===
          carda
            .join("_")
            .charAt(0)
            .toUpperCase() +
            carda.join("_").slice(1)
      )
      .map(m => m.rarity);
    let namey = aplanes
      .filter(
        plane =>
          plane.name ===
          carda
            .join("_")
            .charAt(0)
            .toUpperCase() +
            carda.join("_").slice(1)
      )
      .map(m => m.name);
    let color;
    switch (cardRarity[0]) {
      case "common":
        color = "#7c7d7c";
        break;
      case "rare":
        color = "#fc6203";
        break;
      case "epic":
        color = "#24fc03";
        break;
      case "ultra":
        color = "#db32ca";
        break;
      case "ledgendary":
        color = "#32c7db";
    }
    let qt = `SELECT ${namey[0]}count AS countsy FROM cards WHERE id = '${message.author.id}'`;
    let lt = `SELECT ${namey[0]}levels AS levely FROM cards WHERE id = '${message.author.id}'`;
    let quanity = (await db.query(qt)).rows[0].countsy;
    let level = (await db.query(lt)).rows[0].levely;
    cardP
      .setColor(color)
      .setTitle(
        carda
          .join("-")
          .charAt(0)
          .toUpperCase() + carda.join("-").slice(1)
      )
      .setFooter(client.version)
      .setTimestamp()
      .addField("Rarity:", cardRarity)
      .addField("Count:", quanity)
      .addField("Level:", level)
      .setImage(new Plane(namey[0]).url);
    return message.author.send(cardP);
  }
  if (args[0].toLowerCase() === "upgrade") {
    let carde = [args[1]];
    if (args[2]) carde.push(args[1]);
    if (
      !aplanes
        .map(m => m.name)
        .includes(
          carde
            .join("_")
            .charAt(0)
            .toUpperCase() + carde.join("_").slice(1)
        )
    ) {
      let no = new MessageEmbed()
        .setColor(error_red)
        .setDescription(
          "Thats a error! Either the card you submitted was incorrect, or something happened. When typing in a card, please use this format: For all planes with two words in it do this: `!cards <thing 1> <thing2>` for example: `!card boeing 747`. If the plane is the max, please do `!card boeing 737max` instead. If the plane is the Boeing 747, do `!plane boeing747`. Thank you for your help!"
        )
        .setTimestamp()
        .setFooter(client.version);
      return message.channel.send(no);
    }
    let namey = aplanes
      .filter(
        plane =>
          plane.name ===
          carde
            .join("_")
            .charAt(0)
            .toUpperCase() +
            carde.join("_").slice(1)
      )
      .map(m => m.name);
    let qt = `SELECT ${namey[0]}count AS countsy FROM cards WHERE id = '${message.author.id}'`;
    let lt = `SELECT ${namey[0]}levels AS levely FROM cards WHERE id = '${message.author.id}'`;
    let quanity = (await db.query(qt)).rows[0].countsy;
    let level = (await db.query(lt)).rows[0].levely;
    let upgradeable = false;
    let minus;
    let max;
    if (level === 0 && quanity >= 3) {
      upgradeable = true;
      minus = 3;
    }
    if (level === 1 && quanity >= 7) {
      upgradeable = true;
      minus = 7;
    }
    if (level === 2 && quanity >= 10) {
      upgradeable = true;
      minus = 10;
    }
    if (level === 2 && quanity >= 15) {
      upgradeable = true;
      minus = 15;
    }
    if (level === 3 && quanity >= 20) {
      upgradeable = true;
      minus = 20;
    }
    if (level === 4 && quanity >= 30) {
      upgradeable = true;
      minus = 30;
    }
    if (level === 5 && quanity >= 50) {
      upgradeable = true;
      minus = 50;
    }
    if (level === 6) {
      max = true;
    }
    if (max === true) {
      return message.channel.send("That card is maxiumn level!");
    }
    if (upgradeable === true) {
      let ut = `UPDATE cards SET ${namey[0]}levels = ${namey[0]}levels + 1 WHERE id = '${message.author.id}'`;
      let mt = `UPDATE cards SET ${namey[0]}count = ${namey[0]}count - ${minus} WHERE id = '${message.author.id}'`;
      await db.query(ut);
      await db.query(mt);
      return message.author.send(`I upgraded the card to level ${level + 1}`);
    }
    return message.channel.send(
      "You appear not to have enough to upgrade sorry!"
    );
  }
  let no = new MessageEmbed()
    .setColor(error_red)
    .setDescription(
      "There was an error! Either the card you submitted was incorrect, or something happened. When typing in a card, please use this format: For all planes with two words in it do this: `!cards <thing 1> <thing2>` for example: `!card boeing 747`. If the plane is the max, please do `!card boeing 737max` instead. If the plane is the Boeing 747, do `!plane boeing747`. Thank you for your help!"
    )
    .setTimestamp()
    .setFooter(client.version);
  message.channel.send(no);
}
