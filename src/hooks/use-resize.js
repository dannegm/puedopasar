import { useEffect } from 'react';

const useResize = callback => {
    useEffect(() => {
        callback();
        window.addEventListener('resize', callback);
        return () => window.removeEventListener('resize', callback);
    }, [callback]);
};

export default useResize;
