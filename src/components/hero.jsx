import { useTranslation } from 'react-i18next';
import { Navigation } from 'lucide-react';
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
        <section className='px-6 pt-8 pb-7'>
            <p className='text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-4'>
                {t('hero.question')}
            </p>

            <div className='flex items-center gap-4 sm:gap-8'>
                <h1
                    className='font-condensed font-black uppercase leading-none tracking-tight shrink-0'
                    style={{
                        fontSize: 'clamp(5.5rem, 26vw, 6rem)',
                        color: today ? '#ef4444' : '#22c55e',
                    }}
                >
                    {today ? t('hero.answer_no') : t('hero.answer_yes')}
                </h1>

                <div className='w-px self-stretch bg-white/8 shrink-0' />

                <div className='flex flex-col justify-center gap-2 min-w-0'>
                    <p className='text-lg font-semibold text-white/90 leading-tight'>
                        {today ? t('hero.no') : t('hero.yes')}
                    </p>

                    {!today && upcomingAt && (
                        <p className='text-sm text-zinc-500'>
                            {t('hero.upcoming', { time: upcomingAt })}
                        </p>
                    )}

                    {geoStatus === 'idle' && (
                        <button
                            onClick={onRequestGeo}
                            className='self-start flex items-center gap-2 px-4 py-2 rounded-md bg-surface border border-rim hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium transition-colors cursor-pointer'
                        >
                            <span className='[&>svg]:size-3.5'>
                                <Navigation />
                            </span>
                            {t('hero.cta')}
                        </button>
                    )}

                    {geoStatus === 'requesting' && (
                        <p className='text-zinc-600 text-sm'>{t('hero.cta')}&hellip;</p>
                    )}

                    {geoStatus === 'denied' && (
                        <p className='text-zinc-600 text-sm leading-relaxed'>
                            {t('hero.geo_denied')}
                        </p>
                    )}

                    {geoStatus === 'unavailable' && (
                        <p className='text-zinc-600 text-sm'>{t('hero.geo_unavailable')}</p>
                    )}

                    {geoStatus === 'granted' && level && (
                        <div className='flex flex-col gap-2'>
                            <div
                                className={cn(
                                    'self-start flex items-center gap-2 px-3 py-1 rounded-md border text-xs',
                                    PROXIMITY_BADGE[level],
                                )}
                            >
                                <span
                                    className={cn(
                                        'size-1.5 rounded-full shrink-0',
                                        PROXIMITY_COLORS[level],
                                    )}
                                />
                                {t(`hero.proximity.${level}`)}
                            </div>
                            {distanceFromCenterKm != null && (
                                <p className='text-zinc-500 text-xs'>
                                    {t('hero.distance_from_stadium', {
                                        distance: formatDistance(distanceFromCenterKm),
                                    })}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
