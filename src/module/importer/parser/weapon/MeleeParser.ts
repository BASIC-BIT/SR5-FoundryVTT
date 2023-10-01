import { ImportHelper } from '../../helper/ImportHelper';
import { WeaponParserBase } from './WeaponParserBase';
import DamageData = Shadowrun.DamageData;
import DamageType = Shadowrun.DamageType;
import {DataDefaults} from "../../../data/DataDefaults";
import WeaponItemData = Shadowrun.WeaponItemData;
import DamageElement = Shadowrun.DamageElement;
import PhysicalAttribute = Shadowrun.PhysicalAttribute;

export class MeleeParser extends WeaponParserBase {
    override Parse(jsonData: object, item: WeaponItemData, jsonTranslation?: object): WeaponItemData {
        item = super.Parse(jsonData, item, jsonTranslation);

        item.system.melee.reach = ImportHelper.IntValue(jsonData, 'reach');

        return item;
    }
}
