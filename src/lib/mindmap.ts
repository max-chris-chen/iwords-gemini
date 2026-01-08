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
        
        // Simple level detection
        const getLevel = (w: Word): number => {
            if (!w.parentId || w.parentId === 'scenario') return 1;
            const parent = scenario.words.find(pw => pw.word === w.parentId);
            if (!parent) return 1;
            return 1 + getLevel(parent);
        };

        const level = getLevel(word);
        
        // For children, try to position them near parent
        let wordX = startX + wordIndex * wordSpacing;
        let wordY = 400 + (level - 1) * 450;

        if (word.parentId && word.parentId !== 'scenario') {
            const parentIndex = scenario.words.findIndex(pw => pw.word === word.parentId);
            if (parentIndex !== -1) {
                // Offset from parent
                const siblings = scenario.words.filter(pw => pw.parentId === word.parentId);
                const siblingIndex = siblings.findIndex(sw => sw.word === word.word);
                const parentX = startX + parentIndex * wordSpacing;
                wordX = parentX + (siblingIndex === 0 ? -100 : 100);
            }
        }
        
        nodes.push({
            id: wordId,
            type: 'word', 
            data: { word: word },
            position: { x: wordX, y: wordY }
        });

        const parentId = word.parentId && word.parentId !== 'scenario' 
            ? `word-${word.parentId}` 
            : 'scenario';

        edges.push({
            id: `e-${parentId}-${wordId}`,
            source: parentId,
            target: wordId
        });

        word.examples.forEach((example, exampleIndex) => {
            const exampleId = `example-${word.word}-${exampleIndex}`;
            nodes.push({
                id: exampleId,
                type: 'example', 
                data: { example: example },
                position: { 
                    x: wordX + (exampleIndex % 2 === 0 ? -80 : 80), 
                    y: wordY + 350 + exampleIndex * 180 
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
