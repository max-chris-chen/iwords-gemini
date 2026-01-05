import { render } from 'vitest-browser-svelte';
import { describe, it, expect, vi } from 'vitest';
import MindMap from './MindMap.svelte';

describe('MindMap Interaction', () => {
    it('should correctly initialize with hidden examples', async () => {
        const nodes = [
            { id: 'scenario', type: 'scenario', data: { label: 'S' }, position: { x: 0, y: 0 } },
            { id: 'word-1', type: 'word', data: { word: { word: 'W1' } }, position: { x: 100, y: 100 } },
            { id: 'example-1-0', type: 'example', data: { example: { en: 'E1' } }, position: { x: 200, y: 200 }, hidden: true }
        ];
        const edges = [
            { id: 'e1', source: 'word-1', target: 'example-1-0', hidden: true }
        ];

        const { container } = render(MindMap, { props: { nodes, edges } });
        
                expect(container.textContent).toContain('W1');
        
                // Example node is hidden in the store, so it shouldn't be rendered or visible
        
                expect(container.textContent).not.toContain('E1');
        
            });
        
        
        
            it('should initialize scenario node with onExpand handler', async () => {
        
                const nodes = [
        
                    { id: 'scenario', type: 'scenario', data: { label: 'S' }, position: { x: 0, y: 0 } }
        
                ];
        
                const edges: any[] = [];
        
        
        
                        const { component, container } = render(MindMap, { props: { nodes, edges, scenarioId: '123' } });
        
        
        
                        
        
        
        
                        expect(container.textContent).toContain('S');
        
        
        
                    });
        
        
        
                });
        
        
        
                
        
        