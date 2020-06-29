import Discord, { TextChannel } from "discord.js"
import dotenv from "dotenv"

const dotenvConfg = dotenv.config();

const client = new Discord.Client();
let banCmdName = "ban"
client.on("message", async message => {
    const chaos = client.channels.cache.get("726860324992581682") as TextChannel
    let timesRan = 0
    if (message.channel.id !== "726860324992581682") return;
    const prefix: any = await getPrefix(message, this.data, this.client);
    if (!prefix) return;
    const args = message.content
        .slice(typeof prefix === "string" ? prefix.length : 0)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "start" && message.author.id === "660238973943152707") {
        const notElimintated = await message.guild.roles.cache.get("726865186081996821")
        console.log(notElimintated)
        chaos.updateOverwrite(notElimintated, {
            "SEND_MESSAGES": true,
        })
        const interval = setInterval(() => {
            timesRan++
            if (timesRan > 5) {
                chaos.updateOverwrite(notElimintated, {
                    "SEND_MESSAGES": false,
                })
                clearInterval(interval)
            }
            chaos.send("Heads up! The command has changed to !" + banCmdName)
            const generateRandomString = function(length=5){
                return Math.random().toString(20).substr(2, length)
            }
            banCmdName = generateRandomString()
        }, 10000)
    }
    else if (command === banCmdName) {
        console.log("tets")
        const mentioned = message.mentions.members.first();
        console.log(mentioned)
        if (!mentioned) return
        if (mentioned.roles.highest.id === "726865186081996821") {
            const notElimintated = await message.guild.roles.cache.get("726865186081996821")
            const elimintaed = await message.guild.roles.cache.get("726865385378414594")
            mentioned.roles.remove(notElimintated)
            mentioned.roles.add(elimintaed)
            const banLogs = client.channels.cache.get("726867278695628871") as TextChannel;
            await banLogs.send(`<@${mentioned.id}> has been banned`);
        }
    }
    else if (command === "setnicknames") {
        message.guild.members.cache.forEach(member => {
            if (member.roles.highest.id !== "726857867826692217" && member.roles.highest.id !== "726867896420008037") {
                member.setNickname("!!!");
            }
       })
   }
})
client.on("rateLimit", e => {
    console.log(e)
})
client.on("ready",() => {
    console.log("Bots online")
})
async function getPrefix(
    message: { channel: { type: string }; client: { user: { id: any } }; content: string },
    data: { guild: any; member?: any; user?: any },
    client: { config: { botname: any } }
) {
    if (message.channel.type !== "dm") {
        const prefixes = ["!"];
        let prefix = null;
        prefixes.forEach((p) => {
            if (message.content.startsWith(p)) {
                prefix = p;
            }
        });
        return prefix;
    } else {
        return true;
    }
}
client.login(process.env.token)