var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const preloadHandlebarsTemplates = () => __awaiter(void 0, void 0, void 0, function* () {
    const templatePaths = [
        'systems/shadowrun5e/templates/actor/parts/actor-equipment.html',
        'systems/shadowrun5e/templates/actor/parts/actor-spellbook.html',
        'systems/shadowrun5e/templates/actor/parts/actor-skills.html',
        'systems/shadowrun5e/templates/actor/parts/actor-matrix.html',
        'systems/shadowrun5e/templates/actor/parts/actor-actions.html',
        'systems/shadowrun5e/templates/actor/parts/actor-config.html',
        'systems/shadowrun5e/templates/actor/parts/actor-bio.html',
        'systems/shadowrun5e/templates/actor/parts/actor-social.html',
        'systems/shadowrun5e/templates/item/parts/description.html',
        'systems/shadowrun5e/templates/item/parts/technology.html',
        'systems/shadowrun5e/templates/item/parts/header.html',
        'systems/shadowrun5e/templates/item/parts/weapon-ammo-list.html',
        'systems/shadowrun5e/templates/item/parts/weapon-mods-list.html',
        'systems/shadowrun5e/templates/item/parts/action.html',
        'systems/shadowrun5e/templates/item/parts/damage.html',
        'systems/shadowrun5e/templates/item/parts/opposed.html',
        'systems/shadowrun5e/templates/item/parts/spell.html',
        'systems/shadowrun5e/templates/item/parts/complex_form.html',
        'systems/shadowrun5e/templates/item/parts/weapon.html',
        'systems/shadowrun5e/templates/item/parts/armor.html',
        'systems/shadowrun5e/templates/item/parts/matrix.html',
        'systems/shadowrun5e/templates/item/parts/sin.html',
        'systems/shadowrun5e/templates/item/parts/contact.html',
        'systems/shadowrun5e/templates/item/parts/lifestyle.html',
        'systems/shadowrun5e/templates/item/parts/ammo.html',
        'systems/shadowrun5e/templates/item/parts/modification.html',
    ];
    return loadTemplates(templatePaths);
});
