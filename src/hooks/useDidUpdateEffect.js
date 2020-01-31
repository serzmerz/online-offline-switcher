import { useEffect, useRef } from 'react';

export function useDidUpdateEffect(callback, deps) {
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        return callback();
    }, deps);
}
