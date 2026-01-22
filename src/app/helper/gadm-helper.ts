import { Gadm } from "../models/gadm";

export interface GadmHelper {
        provinces : Gadm[] | null;
        regions : Gadm[] | null;
        districts : Gadm[] | null;
        communes : Gadm[] | null;
}
