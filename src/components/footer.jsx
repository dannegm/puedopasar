import { useTranslation } from 'react-i18next';
import { cn } from '@/helpers/utils';

const LANGS = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ja', label: 'JA' },
];

const CONFIDENCE_BADGE = {
    high: 'bg-green-500/10 text-green-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-red-500/10 text-red-500',
};

const LOCALE_MAP = { ja: 'ja-JP', fr: 'fr-FR', en: 'en-US', es: 'es-MX' };

export const Footer = ({ lastChecked, source, confidence, fallback }) => {
    const { t, i18n } = useTranslation();

    const formattedDate = lastChecked
        ? new Date(lastChecked).toLocaleString(LOCALE_MAP[i18n.language] ?? 'es-MX', {
              dateStyle: 'medium',
              timeStyle: 'short',
          })
        : '—';

    return (
        <footer className='px-4 sm:px-6 py-10 border-t border-rim'>
            {fallback && (
                <p className='text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-6'>
                    {t('footer.fallback_warning')}
                </p>
            )}

            <div className='flex items-center gap-1 mb-6'>
                {LANGS.map(({ code, label }) => (
                    <button
                        key={code}
                        onClick={() => i18n.changeLanguage(code)}
                        className={cn(
                            'text-sm font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
                            i18n.language === code
                                ? 'bg-surface text-white border border-rim'
                                : 'text-zinc-600 hover:text-zinc-300',
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className='flex flex-col gap-3 text-sm text-zinc-500'>
                <span>
                    {t('footer.updated')}: <span className='text-zinc-300'>{formattedDate}</span>
                </span>
                {source && (
                    <span>
                        {t('footer.source')}:{' '}
                        <a
                            href={source}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-zinc-300 hover:text-white underline underline-offset-2 transition-colors'
                        >
                            {new URL(source).hostname}
                        </a>
                    </span>
                )}
                <span className='flex items-center gap-2'>
                    {t('footer.confidence.label')}:{' '}
                    <span className={cn(
                        'font-semibold px-2.5 py-0.5 rounded-full text-sm',
                        CONFIDENCE_BADGE[confidence] ?? CONFIDENCE_BADGE.low,
                    )}>
                        {t(`footer.confidence.${confidence}`)}
                    </span>
                </span>
            </div>
        </footer>
    );
};
