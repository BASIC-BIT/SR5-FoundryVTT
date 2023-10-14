import { DataImporter } from './DataImporter';
import VehicleData = Shadowrun.VehicleData;

export class VehicleImporter extends DataImporter<VehicleData, Shadowrun.VehicleData> {
    CanParse(jsonObject: object): boolean {
        return false;
    }

    ExtractTranslation(fileName: string | undefined) {
    }

    Parse(chummerData: object): Promise<Item> {
        return Promise.resolve(undefined);
    }

    files: string[];

}