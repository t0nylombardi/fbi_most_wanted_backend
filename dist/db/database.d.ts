interface Database {
    ten_most_wanted: any[];
    fugitives: any[];
    capitol_violence: any[];
    terrorism: any[];
    kidnappings_missing_persons: any[];
    parental_kidnappings: any[];
    seeking_info: any[];
    case_of_the_week?: any;
    updatedAt: string;
}
export declare function readDatabase(): Promise<Database>;
export declare function writeDatabase(data: Database): Promise<void>;
export {};
