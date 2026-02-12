import BloomApp from '@/components/BloomApp'


import { useContextLifecycle } from './hooks/useContextLifecycle';

function App() {
    // Run decay logic every 60s
    useContextLifecycle(60000);

    return (
        <>
            <BloomApp />
        </>
    )
}

export default App
