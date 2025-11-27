export type NavItem = 'DASHBOARD' | 'CAREERS' | 'SPACE_DOMAIN' | 'ORBITAL_NEXUS' | 'TELEMETRY';
export type ObjectType = 'CIVIL' | 'MILITARY' | 'DEBRIS' | 'STATION' | 'TELESCOPE' | 'HAZARD' | 'WILDFIRE' | 'STORM';

export interface SatelliteData {
    id: string;
    name: string;
    type: ObjectType;
    owner: string;
    orbit: string;
    alt: string;
    inclination: number;
    period: number;
    fuel: number;
    status: string;
    color: string;
    description: string;
    supportedTargets: string[];
    apiQueryType: 'EARTH' | 'SPACE';
    isNeo?: boolean;
    isHazard?: boolean;
    visualAlt?: number;
    coordinates?: [number, number];
    imageUrl?: string;
    collisionTarget?: string;
    telemetryKey?: string;
    jammerKey?: string;
    rebootKey?: string;
    realType?: ObjectType;
    patchData?: string;
    completionMessage?: string;
    resetData?: Partial<SatelliteData>;
}

export interface NEOData {
    id: string;
    name: string;
    missDistance: string;
    velocity: string;
    isHazardous: boolean;
    time: string;
    magnitude: number;
}

export interface SpaceWeather {
    id: string;
    type: 'GST' | 'FLR' | 'RBE';
    startTime: string;
    link: string;
    note: string;
}
