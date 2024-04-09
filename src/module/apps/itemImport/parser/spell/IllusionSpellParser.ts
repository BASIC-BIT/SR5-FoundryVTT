import { SpellParserBase } from './SpellParserBase';
import { ImportHelper } from '../../helper/ImportHelper';
import SpellItemData = Shadowrun.SpellItemData;

export class IllusionSpellParser extends SpellParserBase {
    override Parse(jsonData: object, item: SpellItemData, jsonTranslation?: object): SpellItemData {
        item = super.Parse(jsonData, item, jsonTranslation);

        let descriptor = ImportHelper.StringValue(jsonData, 'descriptor');
        // A few spells have a missing descriptor instead of an empty string.
        // The field is <descriptor /> rather than <descriptor></descriptor>
        // which gets imported as undefined rather than empty string (sigh)
        // Rather than refactor our ImportHelper we'll handle it in here.
        if (descriptor === undefined) {
            descriptor = '';
        }

        if(descriptor.includes('Obvious')) {
            item.system.illusion.type = "obvious";
        } else if(descriptor.includes('Realistic')) {
            item.system.illusion.type = "realistic";
        }

        if(descriptor.includes('Single-Sense')) {
            item.system.illusion.sense = "single-sense";
        } else if(descriptor.includes('Multi-Sense')) {
            item.system.illusion.sense = "multi-sense";
        }

        if (item.system.type === 'mana') {
            item.system.action.opposed.type = 'custom';
            item.system.action.opposed.attribute = 'logic';
            item.system.action.opposed.attribute2 = 'willpower';
        } else if (item.system.type === 'physical') {
            item.system.action.opposed.type = 'custom';
            item.system.action.opposed.attribute = 'intuition';
            item.system.action.opposed.attribute2 = 'logic';
        }

        return item;
    }
}
