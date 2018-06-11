import * as ReplierFactory from '../ReplierFactory'
import { Message } from 'discord.js';
import * as _ from 'lodash';
import { PostDestroy } from '../../index';

let sleeping = false;
let sbblacklist = [];

export class SBReplier implements ReplierFactory.Replier {
    
    reply(message: Message): [boolean, any] {
        let subcommands = _.split(message.content, / +/);
        switch(subcommands.length) {
            case 1:
                return [true, sleeping? "I'm sleeping son, DON'T disturb me!" : "I hear my son calling me!"];
            case 2: {
                if(subcommands[1] === "GOTOBED") {
                    let result = sleeping ? "*snore\n*dream talking\nZzzz.. How could I sleep when I AM sleeping? Zzzz..." : "Ya right son, I should sleep for my handsomeness. Zzzz..";
                    sleeping = true;
                    return [true, result];
                }
                else if(subcommands[1] === "WAKEUP") {
                    let result = sleeping ? "OMG, what time is it now? I think I've to wake up. Thq son." : "Sh1t, son, I'm not sleeping or daydreaming. Maybe you should wake up instead."
                    sleeping = false;
                    return [true, result];
                }
                else if(subcommands[1] === "GETOUTBI*CH") {
                    PostDestroy();
                    return [true, "Sh1t son you motherf\\*cker. I'm angry now, never see u again bi\\*ch!"];
                }
                else if(subcommands[1] === "RANDOMSB") {
                    return [true, "NOPE!"];
                    return [true, "Most of you sons are all silly, but " + message.guild.members.filter((v, k, c) => {
                        let result = true;
                        sbblacklist.forEach((va, i, a)=> {
                            if(v.displayName === va) {
                                result = false;
                            }
                        });
                        return result;
                    }).random().displayName + " is the silliest! Ahhahhahahaha"];
                }
                else if(subcommands[1] === "CHOSENONE") {
                    return [true, "I SEE! " + message.guild.members.random().displayName + " is THE CHOSEN ONE who fight against the dog server master!"];
                }
                else if(subcommands[1] === "SBILITY") {
                    return [true, "Now the SBILITY of this server is: " + (message.guild.members.array().length * 10 - sbblacklist.length * 10) +"!"];
                }
            }
            case 3: {
                if(subcommands[1] === "SBBLACKLIST") {
                    sbblacklist.push(subcommands[2]);
                    return [true, "I was wrong, " + subcommands[2] + " is not silly at all!"];
                }
            }
        }
        return [false, ""];
    }
}