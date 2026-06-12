import { useState, useEffect } from 'react';
import { settings } from '@/services/settings';

export const useSettingsList = defaultSettings => {
    const [state, setState] = useState(() => {
        const stored = { ...defaultSettings };
        Object.keys(defaultSettings).forEach(key => {
            stored[key] = settings.get(key, defaultSettings[key]);
        });
        return stored;
    });

    const update = (key, value) => {
        settings.set(key, value);
        setState(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        const unsubscribers = Object.keys(defaultSettings).map(key =>
            settings.subscribe(key, value => {
                setState(prev => ({
                    ...prev,
                    [key]: value !== undefined ? value : defaultSettings[key],
                }));
            }),
        );
        return () => unsubscribers.forEach(fn => fn());
    }, []); // defaultSettings is a module-level constant, safe to omit

    return { settings: state, update };
};
