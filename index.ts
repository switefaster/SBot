import { Client, Intents, MessageEmbed } from 'discord.js'
import Mirai, { MiraiApiHttpSetting, getAvatarById } from 'mirai-ts'
import * as fs from "fs";
import * as path from "path";
import * as yaml from 'js-yaml'
import { bold, hyperlink, italic, quote } from '@discordjs/builders';
import { Member } from 'mirai-ts/dist/types/contact';
import _ = require('lodash');
import { MessageChain } from 'mirai-ts/dist/types/message-type';

const { token, qq, discord_guild, qq_group, discord_channel } = require('./secrets.json')
const setting = yaml.load(fs.readFileSync(
    path.resolve(
        __dirname,
        "setting.yml"
    ),
    "utf8"
)) as MiraiApiHttpSetting;

const mirai = new Mirai(setting);
const discord = new Client({ intents: [Intents.FLAGS.GUILDS] });

discord.once('ready', () => {
    console.log("Bot is ready!")
})

discord.login(token)

function message_chain_to_embedded_chain(msg: MessageChain, head?: MessageEmbed): MessageEmbed[] {
    let result: MessageEmbed[] = head ? [head] : [new MessageEmbed().addField("Quote", "----\n")];
    let chain = msg.map((msg) => {
        if (msg.type === 'At') {
            return bold(msg.display)
        }
        else if (msg.type === 'AtAll') {
            return bold("@全体成员");
        } else if (msg.type === 'Plain') {
            return msg.text
        } else if (msg.type === 'FlashImage' || msg.type == 'Image') {
            return hyperlink(msg.url, msg.url)
        } else if (msg.type === 'Quote') {
            return message_chain_to_embedded_chain(msg.origin)
        } else {
            return italic(`[unsupported] ${msg.type}`)
        }
    })
    chain.forEach((v, _k, _a) => {
        if (typeof v === 'string') {
            result[result.length - 1].fields[0].value += v;
        } else {
            result.push(...v);
            result.push(new MessageEmbed());
        }
    })
    return result;
}

async function mirai_app() {
    await mirai.link(qq);
    mirai.on('message', (msg) => {
        if (msg.group(qq_group)) {
            let sender = msg.sender as Member
            let embed_head = new MessageEmbed()
                .setAuthor(sender.memberName, getAvatarById(sender.id))
                .setTitle(`From ${sender.group.name}`)
                .addField("Message", "----\n");
            let fwd = message_chain_to_embedded_chain(msg.messageChain, embed_head);
            discord.guilds.fetch().then((guilds) => {
                let guild = guilds.find((v, _k, _c) => v.id === discord_guild)
                guild.fetch().then((guild) => {
                    guild.channels.fetch(discord_channel).then((channel) => {
                        if (channel.type == 'GUILD_TEXT') {
                            channel.send({
                                embeds: fwd,
                            });
                        }
                    })
                })
            })
        }
    });
    mirai.listen()
}

mirai_app();
