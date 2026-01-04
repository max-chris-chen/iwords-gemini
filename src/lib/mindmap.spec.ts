import { describe, it, expect } from 'vitest';
import type { Scenario } from './models/types';
import { transformScenarioToFlowData } from './mindmap';

describe('Mind map data transformation', () => {
    it('should transform a scenario object into Svelte Flow nodes and edges', () => {
        const scenario: Scenario = {
            prompt: 'Test Scenario',
            createdAt: new Date(),
            words: [
                {
                    word: 'word1',
                    phonetics: '/w1/',
                    definition: 'def1',
                    examples: [
                        { en: 'ex1.1', cn: 'cn1.1' },
                        { en: 'ex1.2', cn: 'cn1.2' },
                    ]
                },
                {
                    word: 'word2',
                    phonetics: '/w2/',
                    definition: 'def2',
                    examples: [
                        { en: 'ex2.1', cn: 'cn2.1' },
                    ]
                }
            ]
        };

        const { nodes, edges } = transformScenarioToFlowData(scenario);

        // Assertions for nodes
        expect(nodes).toHaveLength(6); // 1 scenario + 2 words + 3 examples
        expect(nodes.find(n => n.id === 'scenario')).toBeDefined();
        expect(nodes.find(n => n.id === 'word-word1')).toBeDefined();
        expect(nodes.find(n => n.id === 'word-word2')).toBeDefined();
        expect(nodes.find(n => n.id === 'example-word1-0')).toBeDefined();
        expect(nodes.find(n => n.id === 'example-word1-1')).toBeDefined();
        expect(nodes.find(n => n.id === 'example-word2-0')).toBeDefined();
        
        // Assertions for edges
        expect(edges).toHaveLength(5); // 2 scenario->word + 3 word->example
        expect(edges.find(e => e.source === 'scenario' && e.target === 'word-word1')).toBeDefined();
        expect(edges.find(e => e.source === 'scenario' && e.target === 'word-word2')).toBeDefined();
        expect(edges.find(e => e.source === 'word-word1' && e.target === 'example-word1-0')).toBeDefined();
        expect(edges.find(e => e.source === 'word-word1' && e.target === 'example-word1-1')).toBeDefined();
        expect(edges.find(e => e.source === 'word-word2' && e.target === 'example-word2-0')).toBeDefined();

        // Check hidden state
        const exampleNode = nodes.find(n => n.id === 'example-word1-0');
        expect(exampleNode?.hidden).toBe(true);

        const exampleEdge = edges.find(e => e.source === 'word-word1' && e.target === 'example-word1-0');
        expect(exampleEdge?.hidden).toBe(true);
    });
});
