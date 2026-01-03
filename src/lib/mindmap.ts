import type { Scenario } from './models/types';
import type { Node, Edge } from '@xyflow/svelte';

export function transformScenarioToFlowData(scenario: Scenario): { nodes: Node[], edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Scenario node (root)
    nodes.push({
        id: 'scenario',
        type: 'input',
        data: { label: scenario.prompt },
        position: { x: 400, y: 50 }
    });

    // Word and Example nodes
    scenario.words.forEach((word, wordIndex) => {
        const wordId = `word-${word.word}`;
        nodes.push({
            id: wordId,
            type: 'word', // Use the custom word node type
            data: { word: word },
            position: { x: 150 + wordIndex * 350, y: 200 }
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
                type: 'example', // Use the custom example node type
                data: { example: example },
                position: { x: 100 + wordIndex * 350 + (exampleIndex % 2 === 0 ? -50 : 50), y: 400 + exampleIndex * 100 }
            });
            edges.push({
                id: `e-${wordId}-${exampleId}`,
                source: wordId,
                target: exampleId
            });
        });
    });

    return { nodes, edges };
}
