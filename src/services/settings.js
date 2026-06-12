const CHANNEL = 'settings';

const get = (key, defaultValue) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const set = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        const bc = new BroadcastChannel(CHANNEL);
        bc.postMessage({ key, value });
        bc.close();
    } catch {}
};

const subscribe = (key, callback) => {
    const bc = new BroadcastChannel(CHANNEL);

    const onStorage = event => {
        if (event.key === key) {
            try {
                callback(event.newValue ? JSON.parse(event.newValue) : undefined);
            } catch {}
        }
    };

    const onBroadcast = event => {
        if (event.data.key === key) callback(event.data.value);
    };

    window.addEventListener('storage', onStorage);
    bc.addEventListener('message', onBroadcast);

    return () => {
        window.removeEventListener('storage', onStorage);
        bc.removeEventListener('message', onBroadcast);
        bc.close();
    };
};

const registerDevTools = () => {
    window.setting = (key, value) => {
        set(key, value);
        console.log(`setting("${key}",`, value, ')');
    };
};

export const settings = { get, set, subscribe, registerDevTools };
