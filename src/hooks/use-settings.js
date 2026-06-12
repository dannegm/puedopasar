import { useEffect, useState } from 'react';
import { settings } from '@/services/settings';

export const useSettings = (key, defaultValue) => {
    const [value, setValue] = useState(() => settings.get(key, defaultValue));

    useEffect(() => {
        return settings.subscribe(key, next => {
            setValue(next !== undefined ? next : defaultValue);
        });
    }, [key, defaultValue]);

    const set = next => {
        const resolved = next instanceof Function ? next(value) : next;
        setValue(resolved);
        settings.set(key, resolved);
    };

    return [value, set];
};
