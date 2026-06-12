import { useTranslation } from 'react-i18next';
import { Ticket, Home, Briefcase, Bus } from 'lucide-react';

const SECTIONS = [
    { key: 'ticket', Icon: Ticket },
    { key: 'resident', Icon: Home },
    { key: 'work', Icon: Briefcase },
    { key: 'transit', Icon: Bus },
];

export const HowToPass = () => {
    const { t } = useTranslation();

    return (
        <section className='px-4 sm:px-6 py-10'>
            <h2 className='font-condensed font-bold text-3xl text-white/90 mb-6'>
                {t('how_to_pass.title')}
            </h2>
            <div className='flex flex-col gap-3'>
                {SECTIONS.map(({ key, Icon }) => (
                    <div key={key} className='rounded-2xl p-5 bg-surface border border-rim'>
                        <div className='flex items-center gap-3 mb-3'>
                            <div className='size-9 rounded-xl bg-surface-raised border border-rim flex-center [&>svg]:size-4 text-zinc-500 shrink-0'>
                                <Icon />
                            </div>
                            <h3 className='font-condensed font-bold text-lg uppercase tracking-wide text-white/90'>
                                {t(`how_to_pass.${key}.label`)}
                            </h3>
                        </div>
                        <p className='text-sm text-zinc-400 leading-relaxed'>
                            {t(`how_to_pass.${key}.body`)}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
