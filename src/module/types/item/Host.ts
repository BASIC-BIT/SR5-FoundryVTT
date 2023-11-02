/// <reference path="../Shadowrun.ts" />

declare namespace Shadowrun {
    export interface HostData extends
        DevicePartData,
        ImportFlags,
        DescriptionPartData {
            rating: number,
            marks: MatrixMarks,
            ic: SourceEntityField[],
            type: HostType,
    }

    export type HostType = "data" | "industry" | "destination" | "outdated" | "offline" | "rogue" | "custom";
}