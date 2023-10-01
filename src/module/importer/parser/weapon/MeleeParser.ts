import { ImportHelper } from '../../helper/ImportHelper';
import { WeaponParserBase } from './WeaponParserBase';
import DamageData = Shadowrun.DamageData;
import DamageType = Shadowrun.DamageType;
import {DataDefaults} from "../../../data/DataDefaults";
import WeaponItemData = Shadowrun.WeaponItemData;
import DamageElement = Shadowrun.DamageElement;
import PhysicalAttribute = Shadowrun.PhysicalAttribute;

export class MeleeParser extends WeaponParserBase {
    GetDamage(jsonData: object): DamageData {
        const jsonDamage = ImportHelper.StringValue(jsonData, 'damage');
        // ex. 15S(e)
        const simpleDamage = /^([0-9]+)([PS])? ?(\([a-zA-Z]+\))?/g.exec(jsonDamage);
        // ex. ({STR}+1)P(fire)
        const strengthDamage = /^\({STR}([+-]?[0-9]*)\)([PS])? ?(\([a-zA-Z]+\))?/g.exec(jsonDamage);

        console.log(`Parsing damage from: ${jsonDamage}`)
        let damageType: DamageType = '';
        let damageAttribute: PhysicalAttribute | '' = '';
        let damageBase: number = 0;
        let damageElement: DamageElement = '';

        if(simpleDamage !== null) {
            damageAttribute = '';
            damageBase = parseInt(simpleDamage[1], 10);
            damageType = this.parseDamageType(simpleDamage[2]);
            damageElement = this.parseDamageElement(simpleDamage[3])
            console.log(`Found simple damage ${damageBase} ${damageType} ${damageElement}`)
            console.log(simpleDamage)
        } else if (strengthDamage !== null) {
            damageAttribute = 'strength';
            damageBase = parseInt(strengthDamage[1], 10) || 0;
            damageType = this.parseDamageType(strengthDamage[2]);
            damageElement = this.parseDamageElement(strengthDamage[3]);
            console.log(`Found strength damage ${damageBase} ${damageType} ${damageElement}`)
            console.log(strengthDamage)
        }

        const damageAp = ImportHelper.IntValue(jsonData, 'ap', 0);

        const partialDamageData: RecursivePartial<DamageData> = {
            type: {
                base: damageType,
                value: damageType,
            },
            base: damageBase,
            value: damageBase,
            ap: {
                base: damageAp,
                value: damageAp,
                mod: [],
            },
            attribute: damageAttribute,
            element: {
                base: damageElement,
                value: damageElement,
            }
        }
        return DataDefaults.damageData(partialDamageData);
    }

    private parseDamageType(parsedType: string | undefined): DamageType {
        switch(parsedType) {
            case 'S':
                return 'stun';
            case 'M':
                return 'matrix';
            case 'P':
                return 'physical';
            default:
                return '';
        }
    }

    private parseDamageElement(parsedElement: string | undefined): DamageElement {
        switch(parsedElement?.toLowerCase()) {
            case '(e)':
                return 'electricity';
            case '(fire)':
                return 'fire';
            default:
                return '';
        }
    }

    override Parse(jsonData: object, item: WeaponItemData, jsonTranslation?: object): WeaponItemData {
        item = super.Parse(jsonData, item, jsonTranslation);

        item.system.melee.reach = ImportHelper.IntValue(jsonData, 'reach');

        return item;
    }
}
