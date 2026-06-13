import { useState, useCallback, useEffect, useRef } from 'react';

export const useGeolocation = () => {
    const [coords, setCoords] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | requesting | granted | denied | unavailable
    const watchIdRef = useRef(null);

    const stopWatch = useCallback(() => {
        if (watchIdRef.current != null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    const request = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus('unavailable');
            return;
        }
        stopWatch();
        setStatus('requesting');
        watchIdRef.current = navigator.geolocation.watchPosition(
            pos => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setStatus('granted');
            },
            () => {
                setStatus('denied');
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }, [stopWatch]);

    useEffect(() => {
        request();
        return stopWatch;
    }, []);

    return { coords, status, request };
};
