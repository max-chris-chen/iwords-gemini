import type { Scenario } from './models/types';
import type { Node, Edge } from '@xyflow/svelte';

export function transformScenarioToFlowData(scenario: Scenario): { nodes: Node[], edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const totalWords = scenario.words.length;
    const wordSpacing = 350;
    // Calculate total width of the word row to find the center
    const totalWidth = (totalWords - 1) * wordSpacing; 
    const startX = 150; 
    const centerX = startX + totalWidth / 2;

    // Scenario node (root) - Centered horizontally
    nodes.push({
        id: 'scenario',
        type: 'scenario',
        data: { label: scenario.prompt },
        position: { x: centerX - 64, y: 50 } // x minus half node width (128/2)
    });

    // Word and Example nodes
    scenario.words.forEach((word, wordIndex) => {
        const wordId = `word-${word.word}`;
        const wordX = startX + wordIndex * wordSpacing;
        
        nodes.push({
            id: wordId,
            type: 'word', 
            data: { word: word },
            position: { x: wordX, y: 400 } // Pushed down from 300
        });
        edges.push({
            id: `e-scenario-${wordId}`,
            source: 'scenario',
            target: wordId
        });

        word.examples.forEach((example, exampleIndex) => {
            const exampleId = `example-${word.word}-${exampleIndex}`;
            nodes.push({
                id: exampleId,
                type: 'example', 
                data: { example: example },
                position: { 
                    x: wordX + (exampleIndex % 2 === 0 ? -80 : 80), // Wider horizontal spread
                    y: 750 + exampleIndex * 180 // Pushed down from 550, larger gap (180)
                },
                hidden: true
            });
            edges.push({
                id: `e-${wordId}-${exampleId}`,
                source: wordId,
                target: exampleId,
                hidden: true
            });
        });
    });

    return { nodes, edges };
}
