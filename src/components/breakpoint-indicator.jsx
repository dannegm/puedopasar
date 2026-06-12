import { useState, useCallback } from 'react';

import { ArrowLeftRight, ArrowUpDown } from 'lucide-react';

import { useSettings } from '@/hooks/use-settings';
import useResize from '@/hooks/use-resize';

import { cn } from '@/helpers/utils';

export const BreakpointIndicator = ({ position = 'bottom-right' }) => {
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [showIndicator] = useSettings('settings:show_breakpoint_indicator', false);

    const positions = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
        'middle-left': 'left-4 top-1/2 transform -translate-y-1/2',
        'middle-right': 'right-4 top-1/2 transform -translate-y-1/2',
    };

    const handleResize = useCallback(() => {
        setSize({ w: window.innerWidth, h: window.innerHeight });
    }, []);

    useResize(handleResize);

    if (!showIndicator) return null;

    return (
        <div
            className={cn(
                'fixed z-500 flex gap-1 bg-black text-white px-4 py-2 rounded-lg shadow-lg shadow-black/30 text-sm font-bold',
                positions?.[position],
            )}
        >
            <span className='block sm:hidden'>XS</span>
            <span className='hidden sm:block md:hidden'>SM</span>
            <span className='hidden md:block lg:hidden'>MD</span>
            <span className='hidden lg:block xl:hidden'>LG</span>
            <span className='hidden xl:block 2xl:hidden'>XL</span>
            <span className='hidden 2xl:block'>2XL</span>
            <span className='block'>{`•`}</span>
            <span className='flex items-center gap-1'>
                <ArrowLeftRight size={14} />
                {size.w}
            </span>
            <span className='flex items-center gap-1'>
                <ArrowUpDown size={14} />
                {size.h}
            </span>
        </div>
    );
};
