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
            data: { label: `${word.word} (${word.phonetics})`, word: word },
            position: { x: 150 + wordIndex * 250, y: 200 }
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
                data: { label: example.en },
                position: { x: 100 + wordIndex * 250 + exampleIndex * 50, y: 350 + exampleIndex * 70 }
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
