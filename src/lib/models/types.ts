import type { ObjectId } from 'mongodb';

export interface ExampleSentence {
    en: string;
    cn?: string;
    audioUrl?: string;
}

export interface Word {
    word: string;
    phonetics?: string;
    definition: string;
    examples: ExampleSentence[];
    audioUrl?: string;
}

export interface Scenario {
    _id?: ObjectId;
    prompt: string;
    createdAt: Date;
    words: Word[];
    mindMapData?: any; // To store Svelte Flow data structure
}
