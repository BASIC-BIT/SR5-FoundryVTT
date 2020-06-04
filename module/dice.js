var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SR5 } from './config.js';
import { Helpers } from './helpers';
export class DiceSR {
    static basicRoll({ count, limit, explode, title, actor }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (count <= 0) {
                // @ts-ignore
                ui.notifications.error(game.i18n.localize('SR5.RollOneDie'));
                return;
            }
            let formula = `${count}d6`;
            if (explode) {
                formula += 'x6';
            }
            if (limit) {
                formula += `kh${limit}`;
            }
            formula += 'cs>=5';
            let roll = new Roll(formula);
            let rollMode = game.settings.get('core', 'rollMode');
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: actor }),
                flavor: title,
                rollMode: rollMode,
            });
            return roll;
        });
    }
    /**
     *
     * @param event {MouseEvent} - mouse event that caused this
     * @param actor {Sr5Actor} - actor this roll is associated with
     * @param parts {Object} - object where keys should be the 'name' that can be translated/is translated and value should be the numerical values to add to dice pool
     * @param limit {Number} - Limit to apply to the roll, leave empty for no limit
     * @param extended {Boolean} - if this is an extended test (automatically sets the dropdown in the dialog)
     * @param dialogOptions {Object} - Options to provide to the dialog window
     * @param dialogOptions.environmental {Number} - value of Environmental Modifiers
     * @param dialogOptions.prompt {Boolean} - if this is prompting the user to enter the dice pool of the roll (enables the Dice Pool box)
     * @param after {Function} - Function to run after each roll. Needed to capture rolls of extended tests, otherwise Promise will work
     * @param base {Number} - base value to use for the dice pool, default to 0 (parts are preferred method)
     * @param title {String} - title to display for the roll
     * @param wounds {Boolean} - if wounds should be applied, defaults to true
     * @returns {Promise<Roll>|Promise<*>}
     */
    static rollTest({ event, actor, parts = {}, limit, extended, dialogOptions, after, base = 0, title = 'Roll', wounds = true, }) {
        // if we aren't for soaking some damage
        if (actor &&
            !(title.includes('Soak') || title.includes('Drain') || title.includes('Fade'))) {
            if (wounds)
                wounds = actor.data.data.wounds.value;
        }
        if (!game.settings.get('shadowrun5e', 'applyLimits')) {
            limit = undefined;
        }
        let dice_pool = base;
        const edgeAttMax = actor ? actor.data.data.attributes.edge.max : 0;
        if (event && event[SR5['kbmod'].EDGE]) {
            parts['SR5.Edge'] = +edgeAttMax;
            actor === null || actor === void 0 ? void 0 : actor.update({
                'data.attributes.edge.value': actor.data.data.attributes.edge.value - 1,
            });
        }
        // add mods to dice pool
        dice_pool += Object.values(parts).reduce((prev, cur) => prev + cur, 0);
        if (event && event[SR5['kbmod'].STANDARD]) {
            const edge = parts['SR5.Edge'] !== undefined || undefined;
            return this.basicRoll({
                count: dice_pool,
                explode: edge,
                limit: edge ? undefined : limit,
                title,
                actor,
            });
        }
        let dialogData = {
            options: dialogOptions,
            extended,
            dice_pool,
            base,
            parts,
            limit,
            wounds,
        };
        let template = 'systems/shadowrun5e/templates/rolls/roll-dialog.html';
        let edge = false;
        let cancel = true;
        return new Promise((resolve) => {
            renderTemplate(template, dialogData).then((dlg) => {
                new Dialog({
                    title: title,
                    content: dlg,
                    buttons: {
                        roll: {
                            label: 'Roll',
                            icon: '<i class="fas fa-dice-six"></i>',
                            callback: () => (cancel = false),
                        },
                        edge: {
                            label: `Push the Limit (+${edgeAttMax})`,
                            icon: '<i class="fas fa-bomb"></i>',
                            callback: () => {
                                edge = true;
                                cancel = false;
                            },
                        },
                    },
                    default: 'roll',
                    close: (html) => {
                        if (cancel)
                            return;
                        // get the actual dice_pool from the difference of initial parts and value in the dialog
                        let dicePool = Helpers.parseInput($(html).find('[name="dice_pool"]').val());
                        +Helpers.parseInput($(html).find('[name="dp_mod"]').val());
                        +Helpers.parseInput($(html).find('[name="wounds"]').val());
                        -Helpers.parseInput($(html).find('[name="options.environmental"]').val());
                        const limit = Helpers.parseInput($(html).find('[name="limit"]').val());
                        const extended = Helpers.parseInput($(html).find('[name="extended"]').val()) !== 0;
                        if (edge && actor) {
                            dicePool += actor.data.data.attributes.edge.max;
                            actor.update({
                                'data.attributes.edge.value': actor.data.data.attributes.edge.value - 1,
                            });
                        }
                        const r = this.basicRoll({
                            count: dicePool,
                            explode: edge,
                            limit: edge ? undefined : limit,
                            title,
                            actor,
                        });
                        if (extended && r) {
                            const currentExtended = parts['SR5.Extended'] || 0;
                            parts['SR5.Extended'] = currentExtended - 1;
                            // add a bit of a delay to roll again
                            setTimeout(() => DiceSR.rollTest({
                                event,
                                base,
                                parts,
                                actor,
                                limit,
                                title,
                                extended,
                                dialogOptions,
                                wounds,
                                after,
                            }), 400);
                        }
                        resolve(r);
                        if (after && r)
                            r.then((roll) => after(roll));
                    },
                }).render(true);
            });
        });
    }
}
