import SwissClient from "../../SwissClient";
import {
    swiss_blue
} from "../../config";
import {
    Message,
    GuildMember,
    MessageEmbed,
    ReactionCollector,
    MessageReaction,
    User
} from "discord.js";
import {
    gameJoin
} from "../../utils";

export let name = "fight";
export let description = "Fight another user!";
export let aliases = ["f"];
export let cooldown = 5;
export let canBeOff = true;

export async function execute(
    client: SwissClient,
    message: Message,
    args: string[]
) {
    let user1 = message.author;
    let user2;
    await gameJoin(2, 'fight', message, 15000)
        .then(a => user2 = a);
    if (!user2.has(2)) return message.channel.send('Oops, you ran out of time!');
    user2 = user2.get(2);
    let fightMessage;
    const pt1 = user1.tag;
    const pt2 = user2.tag;
    let p1h = {
        hth: 100,
        set heth(h) {
            this.hth = h
        },
        get health() {
            return this.hth
        }
    };
    let p2h = {
        hth: 100,
        set heth(h) {
            this.hth = h
        },
        get health() {
            return this.hth
        }
    };
    let st;
    let ot;
    let rnd = Math.random();
    if (rnd < .5) {
        st = pt1, ot = pt2
    } else {
        st = pt2, ot = pt1
    }
    let activeP = {
        person: st,
        set psn(p) {
            this.person = p
        },
        get pson() {
            return this.person
        }
    };
    let offP = {
        person: ot,
        set psn(p) {
            this.person = p
        },
        get pson() {
            return this.person
        }
    };
    let change = {
        chg: 0,
        set chag(c) {
            this.chg = c
        },
        get change() {
            return this.chg
        }
    };
    let rmessage = {
        msag: 'If you see this, something went wrong.',
        set msg(m) {
            this.msag = m
        },
        get mesg() {
            return this.msag
        }

    };
    let embed = new MessageEmbed;
    embed
        .setTitle('Fight!')
        .setDescription(`Its ${activeP.pson}'s Turn`)
        .addField(`${pt1}'s health:`, p1h.health)
        .addField(`${pt2}'s health:`, p2h.health)
        .addField('\u200B', '\u200B')
        .setColor(swiss_blue)
        .setTimestamp()
        .setFooter(client.version);
    await message.channel.send(embed)
        .then((msg) => {
            fightMessage = msg
        });
    let damage = () => {
        let aT = Math.floor(Math.random() * 10);
        let damage: number = Math.floor(Math.random() * 100);
        let attacks = [
            `${activeP.pson} punches ${offP.pson} for ${damage} damage.`,
            `${activeP.pson} runs over ${offP.pson} for ${damage} damage.`,
            `${activeP.pson} stabs ${offP.pson} for ${damage} damage.`,
            `${activeP.pson} throws ${offP.pson} into a river for ${damage} damage.`,
            `${activeP.pson} knees ${offP.pson} for ${damage} damage.`,
            `${activeP.pson} shoots ${offP.pson} with a pistol for ${damage} damage.`,
            `${activeP.pson} shoots ${offP.pson} with a AK-47 for ${damage} damage.`,
            `${activeP.pson} hurts ${offP.pson} with words for ${damage} damage.`,
            `${activeP.pson} drowns ${offP.pson} for ${damage} damage.`,
            `${activeP.pson} throws a anvil at ${offP.pson} for ${damage} damage.`
        ];
        return change.chag = damage, rmessage.msg = attacks[aT]
    };
    let heal = () => {
        let hT = Math.floor(Math.random());
        let healed: number = Math.floor(Math.random() * 75);
        let heals = [
            `${activeP.pson} throws a potion and heals ${healed} health!`,
            `${activeP.pson} eats a medkid and heals ${healed} health!`,
            `${activeP.pson} shots a addrelain into them self and heals ${healed} health`,
            `${activeP.pson} eats a golden apple and heals ${healed} health.`,
            `${activeP.pson} drinks a glass of GFuel and heals ${healed} health`
        ];
        return change.chag = healed, rmessage.msg = heals[hT]
    };
    let steal = () => {
        let sT = Math.floor(Math.random());
        let stolen: number = Math.floor(Math.random() * 50);
        let steals = [
            `${activeP.pson} steals ${stolen} health from ${offP.pson}`
        ];
        return change.chag = stolen, rmessage.msg = steals[sT]
    };
    let promise = new Promise(res => {
        let a = setInterval(() => {
            if (p1h.health <= 0 || p2h.health <= 0) {
                clearInterval(a);
                res()
            }
            let action = Math.floor(Math.random() * 10);
            if (action > 5) {
                damage();
                if (activeP.pson === pt1) {
                    p2h.heth = (p2h.health - change.change);
                    embed.fields[1].value = p2h.hth.toString();
                    activeP.psn = pt2;
                    offP.psn = pt1
                } else {
                    p1h.heth = (p1h.health - change.change);
                    embed.fields[0].value = p1h.hth.toString();
                    activeP.psn = pt1;
                    offP.psn = pt2
                }
                embed.setTitle(activeP.pson);
                embed.fields[2].value = rmessage.msag;
                return fightMessage.edit(
                    embed
                )
            }
            else if (action >= 5 && action < 8) {
                heal();
                if (activeP.pson === pt2) {
                    p2h.heth = (p2h.health + change.change);
                    embed.fields[1].value = p2h.hth.toString();
                    activeP.psn = pt1;
                    offP.psn = pt2
                } else {
                    p1h.heth = (p1h.health + change.change);
                    embed.fields[0].value = p1h.hth.toString();
                    activeP.psn = pt2;
                    offP.psn = pt1
                }
                embed.setTitle(activeP.pson);
                embed.fields[2].value = rmessage.msag;
                return fightMessage.edit(
                    embed
                )
            } else if (action === 8) {
                steal();
                if (activeP.pson === pt1) {
                    p2h.heth = (p2h.health - change.change);
                    p1h.heth = (p1h.health + change.change);
                    embed.fields[1].value = p2h.hth.toString();
                    embed.fields[0].value = p1h.hth.toString();
                    activeP.psn = pt2;
                    offP.psn = pt1
                } else {
                    p1h.heth = (p1h.health - change.change);
                    p2h.heth = (p2h.health + change.change);
                    embed.fields[0].value = p1h.hth.toString();
                    embed.fields[1].value = p2h.hth.toString();
                    activeP.psn = pt1;
                    offP.psn = pt2
                }
                embed.setTitle(activeP.pson);
                embed.fields[2].value = rmessage.msag;
                return fightMessage.edit(
                    embed
                )
            }
        }, 2500)
    });
    let deadP;
    await promise
        .then(a => {
            fightMessage.delete().then(
                a => {
                    if (p1h.health < 1) deadP = pt1;
                    else if (p2h.health < 1) deadP = pt2;
                    message.channel.send(`${deadP} was send the the hospital. GG`)
                }
            )
        })
}