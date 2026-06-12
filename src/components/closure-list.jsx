import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/helpers/utils';

const TODAY = new Date().toISOString().slice(0, 10);

const LOCALE_MAP = { ja: 'ja-JP', fr: 'fr-FR', en: 'en-US', es: 'es-MX' };

const formatDate = (dateStr, lng) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString(LOCALE_MAP[lng] ?? 'es-MX', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
};

const NowSeparator = ({ affected }) => {
    const { t } = useTranslation();
    return (
        <li className='flex items-center' aria-hidden>
            <div className={cn('size-4 rounded-full shrink-0 -ml-2', affected ? 'bg-red-500' : 'bg-green-500')} />
            <div className={cn('h-0.5 flex-1', affected ? 'bg-red-500' : 'bg-green-500')} />
            <span className={cn('text-xs mx-2 font-bold px-2.5 py-0.5 rounded-full shrink-0', affected ? 'bg-red-500 text-white' : 'bg-green-500 text-white')}>
                {t('closure_list.now')}
            </span>
            <div className={cn('h-0.5 flex-1', affected ? 'bg-red-500' : 'bg-green-500')} />
        </li>
    );
};

export const ClosureList = ({ dates, affected }) => {
    const { t, i18n } = useTranslation();
    const separatorIndex = dates.findIndex(entry => entry.date > TODAY);

    return (
        <section className='px-4 sm:px-6 py-10 pt-4'>
            <h2 className='font-condensed font-bold text-3xl text-white/90 mb-6'>
                {t('closure_list.title')}
            </h2>
            <ul className='divide-y divide-white/5'>
                {!affected &&separatorIndex === 0 && <NowSeparator affected={affected} />}
                {dates.map((entry, index) => {
                    const isPast = entry.date < TODAY;
                    const isToday = entry.date === TODAY;

                    return (
                        <Fragment key={entry.date}>
                            <li
                                className={cn(
                                    'flex items-start justify-between gap-4 py-5 pl-4 border-l-4',
                                    isToday
                                        ? 'border-red-500'
                                        : isPast
                                          ? 'border-zinc-800 opacity-40'
                                          : 'border-rim',
                                )}
                            >
                                <div className='flex flex-col gap-1.5 min-w-0'>
                                    <div className='flex items-center gap-2.5 flex-wrap'>
                                        <span className='font-condensed font-bold text-xl uppercase text-white/90'>
                                            {formatDate(entry.date, i18n.language)}
                                        </span>
                                        {isToday && (
                                            <span className='text-sm font-bold px-2.5 py-0.5 rounded-full bg-red-500 text-white'>
                                                {t('closure_list.today')}
                                            </span>
                                        )}
                                        {isPast && !isToday && (
                                            <span className='text-sm font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400'>
                                                {t('closure_list.past')}
                                            </span>
                                        )}
                                    </div>
                                    {entry.prevDay && (
                                        <p className='text-sm text-zinc-500'>{t('closure_list.prev_day')}</p>
                                    )}
                                    <p className='text-sm text-zinc-500'>{t('closure_list.reopen')}</p>
                                </div>

                                <div className='text-right shrink-0 pt-0.5 flex flex-col gap-1'>
                                    <p className='text-sm text-zinc-300 tabular-nums'>
                                        <span className='text-zinc-500 mr-1.5'>{t('closure_list.partial')}</span>
                                        {entry.partialClosure}h
                                    </p>
                                    <p className='text-sm text-zinc-300 tabular-nums'>
                                        <span className='text-zinc-500 mr-1.5'>{t('closure_list.total')}</span>
                                        {entry.totalClosure}h
                                    </p>
                                </div>
                            </li>
                            {!affected &&separatorIndex === index + 1 && <NowSeparator affected={affected} />}
                        </Fragment>
                    );
                })}
                {!affected &&separatorIndex === -1 && <NowSeparator affected={affected} />}
            </ul>
        </section>
    );
};
