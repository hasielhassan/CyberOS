/**
 * Cloud IP Generator & IP Info Resolver
 * Generates random IPs from major cloud providers and fetches info from ipinfo.io
 * Includes localStorage caching to minimize API calls
 */

const CLOUD_RANGES = [
    // AWS (Amazon Web Services)
    { provider: 'AWS', cidr: '3.0.0.0/9' },
    { provider: 'AWS', cidr: '35.153.0.0/16' },
    { provider: 'AWS', cidr: '52.0.0.0/10' },
    { provider: 'AWS', cidr: '54.0.0.0/8' },
    // Google Cloud Platform
    { provider: 'Google', cidr: '34.0.0.0/9' },
    { provider: 'Google', cidr: '35.192.0.0/12' },
    { provider: 'Google', cidr: '104.196.0.0/14' },
    // Microsoft Azure
    { provider: 'Microsoft', cidr: '13.64.0.0/11' },
    { provider: 'Microsoft', cidr: '20.0.0.0/11' },
    { provider: 'Microsoft', cidr: '40.76.0.0/14' },
    // Meta (Facebook)
    { provider: 'Meta', cidr: '69.63.176.0/20' },
    { provider: 'Meta', cidr: '157.240.0.0/16' },
    // Oracle Cloud
    { provider: 'Oracle', cidr: '129.213.0.0/16' },
    { provider: 'Oracle', cidr: '140.238.0.0/16' }
];

const CACHE_KEY = 'cyberos_ip_cache';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface IpInfo {
    ip: string;
    hostname?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
    postal?: string;
    timezone?: string;
}

interface CachedIpInfo {
    data: IpInfo;
    timestamp: number;
}

/**
 * Converts an IPv4 string to a 32-bit integer
 */
function ipToInt(ip: string): number {
    return ip.split('.').reduce((acc, octet) => {
        return (acc << 8) + parseInt(octet, 10);
    }, 0) >>> 0;
}

/**
 * Converts a 32-bit integer back to an IPv4 string
 */
function intToIp(int: number): string {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
}

/**
 * Generates a random IP within a CIDR block
 */
function generateRandomIpFromCidr(cidr: string): string {
    const [baseIp, maskLen] = cidr.split('/');
    const maskBitLen = parseInt(maskLen, 10);
    const ipInt = ipToInt(baseIp);
    const hostCount = Math.pow(2, 32 - maskBitLen);
    const randomOffset = Math.floor(Math.random() * hostCount);
    return intToIp(ipInt + randomOffset);
}

/**
 * Get IP cache from localStorage
 */
function getIpCache(): Record<string, CachedIpInfo> {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (error) {
        console.error('Failed to read IP cache:', error);
    }
    return {};
}

/**
 * Save IP cache to localStorage
 */
function setIpCache(cache: Record<string, CachedIpInfo>): void {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Failed to save IP cache:', error);
    }
}

/**
 * Get cached IP info if it exists and hasn't expired
 */
function getCachedIpInfo(ip: string): IpInfo | null {
    const cache = getIpCache();
    const cached = cache[ip];

    if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY_MS) {
        return cached.data;
    }

    return null;
}

/**
 * Cache IP info
 */
function cacheIpInfo(ip: string, data: IpInfo): void {
    const cache = getIpCache();
    cache[ip] = {
        data,
        timestamp: Date.now()
    };
    setIpCache(cache);
}

/**
 * Mock/fallback data generator
 */
function generateMockIpInfo(ip: string): IpInfo {
    const cities = ['San Francisco', 'New York', 'London', 'Tokyo', 'Singapore', 'Sydney'];
    const regions = ['California', 'New York', 'England', 'Tokyo', 'Singapore', 'New South Wales'];
    const countries = ['US', 'US', 'GB', 'JP', 'SG', 'AU'];
    const orgs = ['AS15169 Google LLC', 'AS16509 Amazon.com Inc.', 'AS8075 Microsoft Corporation'];

    const idx = Math.floor(Math.random() * cities.length);
    const orgIdx = Math.floor(Math.random() * orgs.length);

    return {
        ip,
        city: cities[idx],
        region: regions[idx],
        country: countries[idx],
        loc: `${(Math.random() * 180 - 90).toFixed(4)},${(Math.random() * 360 - 180).toFixed(4)}`,
        org: orgs[orgIdx],
        timezone: 'UTC'
    };
}

/**
 * Fetch IP info from ipinfo.io with caching
 */
export async function getIpInfo(ip: string): Promise<IpInfo> {
    // Check cache first
    const cached = getCachedIpInfo(ip);
    if (cached) {
        return cached;
    }

    try {
        const url = `https://ipinfo.io/${ip}/json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data: IpInfo = await response.json();

        // Cache the result
        cacheIpInfo(ip, data);

        return data;
    } catch (error) {
        console.warn(`Failed to fetch IP info for ${ip}, using mock data:`, error);

        // Generate and cache mock data as fallback
        const mockData = generateMockIpInfo(ip);
        cacheIpInfo(ip, mockData);

        return mockData;
    }
}

/**
 * Generate a random cloud IP
 */
export function generateRandomCloudIp(): string {
    const randomRange = CLOUD_RANGES[Math.floor(Math.random() * CLOUD_RANGES.length)];
    return generateRandomIpFromCidr(randomRange.cidr);
}

/**
 * Generate a random cloud IP with its info
 */
export async function getRandomCloudIpInfo(): Promise<IpInfo> {
    const ip = generateRandomCloudIp();
    return await getIpInfo(ip);
}

/**
 * Simulate a traceroute by generating a path of IPs
 */
export async function simulateTraceroute(targetIp: string, hops: number = 8): Promise<IpInfo[]> {
    const route: IpInfo[] = [];

    // Add intermediate hops (random cloud IPs)
    for (let i = 0; i < hops - 1; i++) {
        const hopIp = generateRandomCloudIp();
        const info = await getIpInfo(hopIp);
        route.push(info);
    }

    // Add final destination
    const finalInfo = await getIpInfo(targetIp);
    route.push(finalInfo);

    return route;
}

/**
 * Format IP info for terminal display
 */
export function formatIpInfo(info: IpInfo, verbose: boolean = false): string[] {
    const lines = [
        `IP: ${info.ip}`,
        `Location: ${info.city || 'Unknown'}, ${info.region || 'Unknown'}, ${info.country || 'Unknown'}`
    ];

    if (verbose) {
        if (info.org) lines.push(`Organization: ${info.org}`);
        if (info.loc) lines.push(`Coordinates: ${info.loc}`);
        if (info.timezone) lines.push(`Timezone: ${info.timezone}`);
        if (info.postal) lines.push(`Postal: ${info.postal}`);
    }

    return lines;
}
