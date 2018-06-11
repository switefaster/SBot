import { Message } from "discord.js";

import * as HelpReplier from './repliers/HelpReplier';
import * as SBReplier from './repliers/SBReplier'

export interface Replier {
    reply(message: Message): [boolean, any];
}

export function getReplierFromCommand(command: string): Replier {
    let result = null;
    switch(command) {
        case '$SB':
            result = new SBReplier.SBReplier();
            break;
        case '$HELP':
            result = new HelpReplier.HelpReplier();
            break;
    }
    return result;
}