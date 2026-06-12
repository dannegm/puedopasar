import { useTranslation } from 'react-i18next';
import { cn } from '@/helpers/utils';

export const StreetsList = ({ affectedStreets }) => {
    const { t } = useTranslation();

    return (
        <section className='px-4 sm:px-6 py-10'>
            <h2 className='font-condensed font-bold text-3xl text-white/90 mb-6'>
                {t('streets.title')}
            </h2>
            <div className='grid sm:grid-cols-2 gap-8'>
                {[
                    { typeKey: 'total', streets: affectedStreets?.total ?? [], dotColor: 'bg-red-500', labelColor: 'text-red-400' },
                    { typeKey: 'partial', streets: affectedStreets?.partial ?? [], dotColor: 'bg-orange-500', labelColor: 'text-orange-400' },
                ].map(({ typeKey, streets, dotColor, labelColor }) => (
                    <div key={typeKey}>
                        <p className={cn('text-sm font-semibold tracking-widest uppercase mb-4', labelColor)}>
                            {t(`streets.${typeKey}`)}
                        </p>
                        <ul className='flex flex-col gap-3'>
                            {streets.map(street => (
                                <li key={street} className='flex items-start gap-3 text-sm text-zinc-400 leading-snug'>
                                    <span className={cn('mt-1.5 size-1.5 rounded-full shrink-0', dotColor)} />
                                    {street}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};
