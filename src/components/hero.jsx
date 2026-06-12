import { useTranslation } from 'react-i18next';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/helpers/utils';

const PROXIMITY_COLORS = {
    inside: 'bg-red-500',
    near: 'bg-orange-500',
    close: 'bg-yellow-500',
    safe: 'bg-green-500',
};

const PROXIMITY_BADGE = {
    inside: 'bg-red-500/10 border-red-500/20 text-red-400',
    near: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    close: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    safe: 'bg-green-500/10 border-green-500/20 text-green-400',
};

const formatDistance = km => {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
};

export const Hero = ({ today, upcomingAt, proximity, geoStatus, onRequestGeo }) => {
    const { t } = useTranslation();
    const { level, distanceFromCenterKm } = proximity;

    return (
        <section className='flex flex-col items-center px-6 pt-14 pb-12 text-center'>

            <div className='relative z-10 flex flex-col items-center gap-5'>
                <p className='text-sm font-semibold tracking-widest uppercase text-zinc-500'>
                    {t('hero.question')}
                </p>

                <h1
                    className='font-condensed font-bold uppercase leading-none tracking-tight'
                    style={{
                        fontSize: 'clamp(4.5rem, 25vw, 9rem)',
                        color: today ? '#ef4444' : '#22c55e',
                    }}
                >
                    {today ? t('hero.answer_no') : t('hero.answer_yes')}
                </h1>

                <p className='text-zinc-400 text-base -mt-2'>
                    {today ? t('hero.no') : t('hero.yes')}
                </p>

                {!today && upcomingAt && (
                    <p className='text-sm text-zinc-500 -mt-2'>
                        {t('hero.upcoming', { time: upcomingAt })}
                    </p>
                )}

                {geoStatus === 'idle' && (
                    <button
                        onClick={onRequestGeo}
                        className='flex items-center gap-2 mt-1 px-5 py-2.5 rounded-full bg-surface border border-rim hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium transition-colors cursor-pointer'
                    >
                        <span className='[&>svg]:size-4'>
                            <Navigation />
                        </span>
                        {t('hero.cta')}
                    </button>
                )}

                {geoStatus === 'requesting' && (
                    <p className='text-zinc-600 text-sm mt-1'>{t('hero.cta')}&hellip;</p>
                )}

                {geoStatus === 'denied' && (
                    <p className='text-zinc-600 text-sm mt-1 max-w-xs leading-relaxed'>{t('hero.geo_denied')}</p>
                )}

                {geoStatus === 'unavailable' && (
                    <p className='text-zinc-600 text-sm mt-1'>{t('hero.geo_unavailable')}</p>
                )}

                {geoStatus === 'granted' && level && (
                    <div className='flex flex-col items-center gap-2 mt-1'>
                        <div className={cn(
                            'flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm',
                            PROXIMITY_BADGE[level],
                        )}>
                            <span className={cn('size-2 rounded-full shrink-0', PROXIMITY_COLORS[level])} />
                            {t(`hero.proximity.${level}`)}
                        </div>
                        {distanceFromCenterKm != null && (
                            <p className='text-zinc-500 text-sm'>
                                {t('hero.distance_from_stadium', { distance: formatDistance(distanceFromCenterKm) })}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
