import { useState, useCallback, useEffect } from 'react';

export const useGeolocation = () => {
    const [coords, setCoords] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | requesting | granted | denied | unavailable

    const request = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus('unavailable');
            return;
        }
        setStatus('requesting');
        navigator.geolocation.getCurrentPosition(
            pos => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setStatus('granted');
            },
            () => {
                setStatus('denied');
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }, []);

    useEffect(() => { request(); }, []);

    return { coords, status, request };
};
