// import type { ObjectId } from 'mongodb';

export interface ExampleSentence {
    en: string;
    cn?: string;
    audioUrl?: string;
}

export interface Word {
    word: string;
    phonetics?: string;
    definition: string;
    definition_cn?: string;
    examples: ExampleSentence[];
    audioUrl?: string;
    parentId?: string; // word or 'scenario'
}

export interface Scenario {
    _id?: string;
    prompt: string;
    createdAt: Date;
    words: Word[];
    mindMapData?: any; // To store Svelte Flow data structure
}
