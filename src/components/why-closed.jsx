import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';

const SOURCES = [
    { key: 'source_ssc', url: 'https://ssc.cdmx.gob.mx' },
    { key: 'source_semovi', url: 'https://semovi.cdmx.gob.mx' },
    { key: 'source_coyoacan', url: 'https://alcaldiacoyoacan.cdmx.gob.mx' },
];

export const WhyClosed = () => {
    const { t } = useTranslation();

    return (
        <section className='px-4 sm:px-6 py-10'>
            <h2 className='font-condensed font-bold text-3xl text-white/90 mb-5'>
                {t('why_closed.title')}
            </h2>
            <p className='text-zinc-400 leading-relaxed text-base mb-8'>{t('why_closed.body')}</p>
            <div className='flex flex-col gap-0.5'>
                <p className='text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-3'>
                    {t('why_closed.sources')}
                </p>
                {SOURCES.map(({ key, url }) => (
                    <a
                        key={key}
                        href={url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2.5 py-2 text-sm text-zinc-400 hover:text-white transition-colors group'
                    >
                        <span className='[&>svg]:size-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors'>
                            <ExternalLink />
                        </span>
                        {t(`why_closed.${key}`)}
                    </a>
                ))}
            </div>
        </section>
    );
};
