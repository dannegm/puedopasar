import { useEffect, useRef } from 'react';
import { PartyPopper } from 'lucide-react';
import { useReward } from 'partycles';
import { useTranslation } from 'react-i18next';

const GIFS = [
    '/img/relief-001.gif',
    '/img/relief-002.gif',
    '/img/relief-003.gif',
    '/img/relief-004.gif',
    '/img/relief-005.gif',
    '/img/relief-006.gif',
];

const RANDOM_GIF = GIFS[Math.floor(Math.random() * GIFS.length)];

export const ReliefCard = () => {
    const { t } = useTranslation();
    const gif = RANDOM_GIF;

    const anchorRef = useRef(null);
    const { reward } = useReward(anchorRef, 'confetti', {
        particleCount: 120,
        spread: 100,
        startVelocity: 22,
        decay: 0.92,
        lifetime: 220,
        elementSize: 10,
        colors: ['#22c55e', '#4ade80', '#86efac', '#facc15', '#fb923c', '#f87171', '#60a5fa', '#c084fc'],
        physics: { gravity: 0.25, wind: 0, friction: 0.97 },
    });

    useEffect(() => {
        const timer = setTimeout(reward, 400);
        return () => clearTimeout(timer);
    }, [reward]);

    return (
        <>
            <div
                ref={anchorRef}
                className='fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none'
                aria-hidden
            />
            <section className='px-4 sm:px-6 pt-6 pb-2'>
                <div className='relative rounded-2xl overflow-hidden border border-rim h-64'>
                    <img
                        src={gif}
                        alt=''
                        className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent' />
                    <div className='absolute inset-x-0 bottom-0 p-5'>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='[&>svg]:size-4 text-green-400'>
                                <PartyPopper />
                            </span>
                            <span className='text-green-400 text-xs font-bold uppercase tracking-[0.15em]'>
                                {t('relief.label')}
                            </span>
                        </div>
                        <h3 className='font-condensed font-black text-white text-2xl leading-tight mb-1'>
                            {t('relief.title_start')} <em>{t('relief.title_italic')}</em>*
                        </h3>
                        <p className='text-white/60 text-sm'>
                            {t('relief.subtitle')}
                        </p>
                    </div>
                </div>
                <p className='mt-2 px-1 text-xs text-zinc-600'>
                    {t('relief.footnote')}
                </p>
            </section>
        </>
    );
};
