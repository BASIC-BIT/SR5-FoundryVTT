import { SR5 } from '../config';
import { FLAGS, SYSTEM_NAME } from '../constants';
import * as _ from 'lodash';

export class FullDefenseMenu extends FormApplication<FormApplicationOptions, { attribute: Record<keyof typeof SR5.attributes, boolean>, skill: Record<keyof typeof SR5.activeSkills, boolean> }> {
  constructor() {
    super(FullDefenseMenu.getAttributes());
  }

  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['form'],
      template: 'systems/shadowrun5e/dist/templates/menus/FullDefenseMenu.html',
      id: 'full-defense-menu',
    })
  }

  static getAttributes(): Array<string> {
    return game.settings.get(SYSTEM_NAME, FLAGS.FullDefenseAttributes) as Array<string>;
  }

  static getSkills(): Array<string> {
    return game.settings.get(SYSTEM_NAME, FLAGS.FullDefenseSkills) as Array<string>;
  }

  static async setAttributes(newAttributes: Array<string>): Promise<Array<string>> {
    return await game.settings.set(SYSTEM_NAME, FLAGS.FullDefenseAttributes, newAttributes);
  }

  static async setSkills(newSkills: Array<string>): Promise<Array<string>> {
    return await game.settings.set(SYSTEM_NAME, FLAGS.FullDefenseSkills, newSkills);
  }

  override getData() {
    return {
      attribute: _.mapValues(SR5.attributes, (_, attribute) => FullDefenseMenu.getAttributes().includes(attribute)),
      skill: _.mapValues(SR5.activeSkills, (_, skill) => FullDefenseMenu.getSkills().includes(skill)),
      config: SR5,
    }
  }

  protected override async _updateObject(event, formData): Promise<void> {
    const data: {
      attribute: Record<keyof typeof SR5.attributes, boolean>,
      skill: Record<keyof typeof SR5.activeSkills, boolean>,
    } = expandObject(formData);

    const selectedAttributes = _.entries(data.attribute).filter((([_, selected]) => selected)).map(([attribute]) => attribute);
    const selectedSkills = _.entries(data.skill).filter((([_, selected]) => selected)).map(([skill]) => skill);

    await FullDefenseMenu.setAttributes(selectedAttributes);
    await FullDefenseMenu.setSkills(selectedSkills);
  }
}
