import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { Map, MapMarker, MarkerContent, MarkerTooltip, MapControls, useMap } from '@/ui/map';
import { cn } from '@/helpers/utils';
import { StadiumIcon, PersonStandingIcon } from '@/ui/icons';

const PerimeterLayer = ({ perimeter }) => {
    const { map, isLoaded } = useMap();

    useEffect(() => {
        if (!isLoaded || !map || !perimeter?.geometry) return;

        map.addSource('perimeter', { type: 'geojson', data: perimeter });
        map.addLayer({
            id: 'perimeter-fill',
            type: 'fill',
            source: 'perimeter',
            paint: { 'fill-color': '#ef4444', 'fill-opacity': 0.15 },
        });
        map.addLayer({
            id: 'perimeter-line',
            type: 'line',
            source: 'perimeter',
            paint: { 'line-color': '#ef4444', 'line-width': 2, 'line-opacity': 0.8 },
        });

        return () => {
            if (map.getLayer('perimeter-fill')) map.removeLayer('perimeter-fill');
            if (map.getLayer('perimeter-line')) map.removeLayer('perimeter-line');
            if (map.getSource('perimeter')) map.removeSource('perimeter');
        };
    }, [isLoaded, map, perimeter]);

    return null;
};

const DirectionArrow = ({ coords, className, flyToZoom = 14 }) => {
    const { map, isLoaded } = useMap();
    const [arrow, setArrow] = useState(null);

    useEffect(() => {
        if (!isLoaded || !map || !coords) {
            setArrow(null);
            return;
        }

        const update = () => {
            if (map.getBounds().contains([coords.lng, coords.lat])) {
                setArrow(null);
                return;
            }

            const { width, height } = map.getContainer().getBoundingClientRect();
            const projected = map.project([coords.lng, coords.lat]);

            const cx = width / 2;
            const cy = height / 2;
            const dx = projected.x - cx;
            const dy = projected.y - cy;

            const pad = 40;
            const scaleX = dx !== 0 ? (width / 2 - pad) / Math.abs(dx) : Infinity;
            const scaleY = dy !== 0 ? (height / 2 - pad) / Math.abs(dy) : Infinity;
            const scale = Math.min(scaleX, scaleY);

            setArrow({
                x: cx + dx * scale,
                y: cy + dy * scale,
                angle: Math.atan2(dy, dx) * (180 / Math.PI) + 90,
            });
        };

        update();
        map.on('move', update);
        map.on('zoom', update);

        return () => {
            map.off('move', update);
            map.off('zoom', update);
            setArrow(null);
        };
    }, [isLoaded, map, coords]);

    if (!arrow) return null;

    return (
        <div
            className={cn(
                'absolute z-10 flex-center size-8 rounded-full shadow-lg shadow-black/50 text-white [&>svg]:size-4 cursor-pointer transition-colors',
                className,
            )}
            style={{
                left: arrow.x,
                top: arrow.y,
                transform: `translate(-50%, -50%) rotate(${arrow.angle}deg)`,
            }}
            onClick={() => map.flyTo({ center: [coords.lng, coords.lat], zoom: flyToZoom, duration: 800 })}
        >
            <ArrowUp />
        </div>
    );
};

export const MapCard = ({ perimeter, userCoords }) => {
    const { t } = useTranslation();
    const center = perimeter?.properties?.center;

    if (!center) return null;

    return (
        <section className='px-4 sm:px-6 py-8'>
            <h2 className='font-condensed font-bold text-3xl text-white/90 mb-5'>{t('map.title')}</h2>
            <div className='rounded-2xl overflow-hidden h-80 sm:h-96 border border-rim'>
                <Map
                    center={[center.lng, center.lat]}
                    zoom={13}
                    theme='dark'
                    className='size-full'
                >
                    <PerimeterLayer perimeter={perimeter} />

                    <MapMarker longitude={center.lng} latitude={center.lat}>
                        <MarkerContent>
                            <div className='size-16 rounded-full bg-red-500 border-2 border-white shadow-md shadow-black/50 flex-center text-white'>
                                <StadiumIcon size='2.25rem' />
                            </div>
                        </MarkerContent>
                        <MarkerTooltip>{t('map.stadium')}</MarkerTooltip>
                    </MapMarker>

                    {userCoords && (
                        <>
                            <MapMarker longitude={userCoords.lng} latitude={userCoords.lat}>
                                <MarkerContent>
                                    <div className='size-6 rounded-full bg-blue-500 border-2 border-white shadow-md shadow-black/50 flex-center text-white'>
                                        <PersonStandingIcon size='1rem' />
                                    </div>
                                </MarkerContent>
                                <MarkerTooltip>{t('map.you')}</MarkerTooltip>
                            </MapMarker>

                            <DirectionArrow
                                coords={userCoords}
                                className='bg-blue-500 hover:bg-blue-400'
                                flyToZoom={14}
                            />
                        </>
                    )}

                    <DirectionArrow
                        coords={center}
                        className='bg-red-500 hover:bg-red-400'
                        flyToZoom={13}
                    />

                    <MapControls position='bottom-right' showZoom />
                </Map>
            </div>
        </section>
    );
};
