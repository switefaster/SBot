import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as _ from 'lodash';
const client = new Discord.Client();

import * as AliasesHelper from './replier/Aliases';
import * as ReplierFactory from './replier/ReplierFactory';

let destroyed = false;

client.on('ready', () => {
    console.log('Ready for SB!');
});
let data = require('./properties/configs.json');
if(data.token) {
    client.login(data.token);
}
else {
    console.log("JSON Error!");
}

client.on('message', (message) => {
    let command = AliasesHelper.getCommandFromAliases(_.split(message.content, ' ')[0]);
    let replier = ReplierFactory.getReplierFromCommand(command);
    if(replier) {
        let reply = replier.reply(message);
        if(reply[0]) {
            message.channel.send(reply[1]);
        }
        if(destroyed) {
            client.destroy();
        }
    }
});

export function PostDestroy() {
    destroyed = true;
}