import { useEffect } from 'react';
import { useUnifiedContext } from '@/stores/unifiedContextStore';

/**
 * Hook to manage the lifecycle of the context graph
 * - Runs the decay loop
 * - Can be extended for other periodic tasks (pruning, auto-save)
 */
export const useContextLifecycle = (decayIntervalMs: number = 60000) => {
    const { applyDecay } = useUnifiedContext();

    useEffect(() => {
        const interval = setInterval(() => {
            applyDecay();
        }, decayIntervalMs);

        return () => clearInterval(interval);
    }, [applyDecay, decayIntervalMs]);
};
