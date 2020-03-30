import SwissClient from "../../SwissClient";
import {Message} from "discord.js";


export let name = "level";
export let aliases = ["levelup", "leveltutorial", "levels"];
export let description = "Creates a poll in whatever channel you would like to";

export async function execute(
    client: SwissClient,
    message: Message,
    args: string[]
  ) {

    message.channel.send("**Level Roles :arrow_double_up::\n**"
     + "These roles are achiveable by gaining random exp points by chatting. Not every message will give you exp so spamming won't help.\n" + 
     "Member: Level 0,\n" + 
     "Active Member: Level 5,\n" +
     "SwissClub: Level 10,\n" +
     "SwissGold: Level 15,\n " + 
     "SwissGold+: Level 20,\n" + 
     "SwissPlatinum: Level 25,\n" + 
     "SwissPlatinum+: Level 35,\n" + 
     "SwissElite: Level 45.\n" + 
     "You can view your level by doing `=r` in <#592770427948892171>");

}
