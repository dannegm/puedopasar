import { useMemo } from 'react';
import { haversine, pointInPolygon } from '@/helpers/geo';

const STADIUM_CENTER = { lat: 19.3029, lng: -99.1505 };

// Returns: { level, distanceKm }
// level: 'inside' | 'near' | 'close' | 'safe' | null (no coords)
export const useProximity = (coords, perimeter) => {
    return useMemo(() => {
        if (!coords) return { level: null, distanceKm: null };

        const { lat, lng } = coords;
        const radiusKm = perimeter?.properties?.radiusKm ?? 1.6;
        const coordinates = perimeter?.geometry?.coordinates;

        const isInside =
            coordinates
                ? pointInPolygon(lat, lng, coordinates)
                : haversine(lat, lng, STADIUM_CENTER.lat, STADIUM_CENTER.lng) < radiusKm;

        const distFromCenter = haversine(lat, lng, STADIUM_CENTER.lat, STADIUM_CENTER.lng);

        if (isInside) return { level: 'inside', distanceKm: 0, distanceFromCenterKm: distFromCenter };

        const distFromEdge = distFromCenter - radiusKm;

        let level;
        if (distFromEdge < 0.5) level = 'near';
        else if (distFromEdge < 1.5) level = 'close';
        else level = 'safe';

        return { level, distanceKm: distFromEdge, distanceFromCenterKm: distFromCenter };
    }, [coords, perimeter]);
};
