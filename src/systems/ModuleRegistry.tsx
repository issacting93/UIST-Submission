import { UnifiedNode } from '@/types/unified';
import { ModuleDefinition } from '@/types/ui';

// Import Modules
import { TextModule } from '@/components/modules/TextModule';
import { LocationModule } from '@/components/modules/LocationModule';
import { TaskModule } from '@/components/modules/TaskModule';

export const MODULE_REGISTRY: ModuleDefinition[] = [
    {
        id: 'module-location',
        name: 'Location Module',
        description: 'Displays GPS and location data',
        match: (node) => node.type === 'Location' || node.source === 'gps_signal',
        component: LocationModule,
        colSpan: () => 1,
        priority: 100
    },
    {
        id: 'module-task',
        name: 'Task Module',
        description: 'Displays actionable items',
        match: (node) => node.type === 'Action' || node.type === 'Task' || node.layer === 'bridge',
        component: TaskModule,
        colSpan: () => 1,
        priority: 90
    },
    {
        id: 'module-text',
        name: 'Text Module',
        description: 'Generic text display for notes/thoughts',
        match: (_node) => true, // Fallback
        component: TextModule,
        colSpan: (node) => node.data?.content?.length > 100 ? 2 : 1,
        priority: 0
    }
];

export const resolveModule = (node: UnifiedNode): ModuleDefinition => {
    // Sort by priority descending
    const candidates = MODULE_REGISTRY.filter(m => m.match(node));
    return candidates.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
};
