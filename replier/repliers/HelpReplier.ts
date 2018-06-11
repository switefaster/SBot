import * as ReplierFactory from '../ReplierFactory'
import { Message } from 'discord.js';

export class HelpReplier implements ReplierFactory.Replier {

    reply(message: Message): [boolean, any] {
        return [true, "Just for test, nothing has written yet!"];
    }

}