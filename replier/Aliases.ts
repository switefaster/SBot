const ALIASES = require('../properties/settings.json').aliases;

export function getCommandFromAliases(input: string): string {
    let keys = Object.keys(ALIASES) || [];
    let result = "";
    keys.forEach((key) => {
        if(input === key) {
            result = key;
            return;
        }
        let values = ALIASES[key] || [];
        for(let v of values) {
            if(v === input) {
                result = key;
                return;
            }
        }
    });
    return result;
}