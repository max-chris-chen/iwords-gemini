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

    const processedWordIds = new Set<string>();
    
    // 1. Organize words by parentId to build a hierarchy map
    const childrenMap = new Map<string, Word[]>();
    const level1Words: Word[] = [];

    scenario.words.forEach(w => {
        const pId = (!w.parentId || w.parentId === 'scenario') ? 'scenario' : w.parentId;
        if (pId === 'scenario') {
            level1Words.push(w);
        } else {
            if (!childrenMap.has(pId)) childrenMap.set(pId, []);
            childrenMap.get(pId)?.push(w);
        }
    });

    // 2. Recursive function to position nodes
    const positionNodes = (words: Word[], level: number, startX: number, parentX?: number) => {
        words.forEach((word, index) => {
            const wordId = `word-${word.word}`;
            if (processedWordIds.has(wordId)) return;
            processedWordIds.add(wordId);

            // X Positioning
            let x: number;
            if (level === 1) {
                // Level 1: Linear distribution
                x = startX + index * wordSpacing;
            } else {
                // Children: Centered under parent
                const siblings = words;
                // Distribute siblings: -100, +100, or wider if many
                const offset = (index - (siblings.length - 1) / 2) * 200; 
                x = (parentX || startX) + offset;
            }

            // Y Positioning
            // Level 1: 400. Level 2: 950. Level 3: 1500.
            const y = 400 + (level - 1) * 550; 

            nodes.push({
                id: wordId,
                type: 'word', 
                data: { word: word },
                position: { x, y }
            });

            // Edge
            const parentId = (!word.parentId || word.parentId === 'scenario') ? 'scenario' : `word-${word.parentId}`;
            edges.push({
                id: `e-${parentId}-${wordId}`,
                source: parentId,
                target: wordId
            });

            // Examples
            word.examples.forEach((example, exIndex) => {
                const exampleId = `example-${word.word}-${exIndex}`;
                nodes.push({
                    id: exampleId,
                    type: 'example', 
                    data: { example: example },
                    position: { 
                        x: x + (exIndex % 2 === 0 ? -80 : 80), 
                        y: y + 280 + exIndex * 180 
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

            // Recurse for children
            const children = childrenMap.get(word.word);
            if (children) {
                positionNodes(children, level + 1, startX, x);
            }
        });
    };

    // Start positioning from Level 1
    positionNodes(level1Words, 1, startX);

    return { nodes, edges };
}
