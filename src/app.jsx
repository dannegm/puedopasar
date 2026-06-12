import './i18n';

import { useEffect } from 'react';

import statusData from '@/data/status.json';

import { getClosureStatus } from '@/helpers/closure';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useProximity } from '@/hooks/use-proximity';

import { Hero } from '@/components/hero';
import { MapCard } from '@/components/map-card';
import { ClosureList } from '@/components/closure-list';
import { WhyClosed } from '@/components/why-closed';
import { HowToPass } from '@/components/how-to-pass';
import { StreetsList } from '@/components/streets-list';
import { Footer } from '@/components/footer';
import { BreakpointIndicator } from '@/components/breakpoint-indicator';

export default function App() {
    const { coords, status: geoStatus, request: requestGeo } = useGeolocation();
    const proximity = useProximity(coords, statusData.perimeter);
    const { active: isClosed, upcomingAt } = getClosureStatus(statusData.dates);

    useEffect(() => {
        const voidColor = getComputedStyle(document.documentElement).getPropertyValue('--color-void').trim();
        if (!voidColor) return;

        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', voidColor);
        }
    }, []);

    useEffect(() => {
        const id = import.meta.env.VITE_UMAMI_ID;
        const host = import.meta.env.VITE_UMAMI_HOST;
        if (!id || !host) return;
        const script = document.createElement('script');
        script.defer = true;
        script.src = `${host}/script.js`;
        script.setAttribute('data-website-id', id);
        document.head.appendChild(script);
    }, []);

    const divider = <hr className='border-rim mx-4 sm:mx-6' />;

    return (
        <div className='relative min-h-screen bg-void text-white font-sans'>
            <div
                className='absolute inset-x-0 top-0 h-96 pointer-events-none'
                style={{
                    background: isClosed
                        ? 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(239,68,68,0.18) 0%, transparent 100%)'
                        : 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(34,197,94,0.18) 0%, transparent 100%)',
                }}
            />
            <div className='relative max-w-2xl mx-auto'>
                <Hero
                    today={isClosed}
                    upcomingAt={upcomingAt}
                    proximity={proximity}
                    geoStatus={geoStatus}
                    onRequestGeo={requestGeo}
                />
                {divider}
                <MapCard perimeter={statusData.perimeter} userCoords={coords} />
                {divider}
                <ClosureList dates={statusData.dates} affected={isClosed} />
                {divider}
                <WhyClosed />
                {divider}
                <HowToPass />
                {divider}
                <StreetsList affectedStreets={statusData.affectedStreets} />
                <Footer
                    lastChecked={statusData.lastChecked}
                    source={statusData.source}
                    confidence={statusData.confidence}
                    fallback={statusData.fallback}
                />
            </div>
            <BreakpointIndicator />
        </div>
    );
}
