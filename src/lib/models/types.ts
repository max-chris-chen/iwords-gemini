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

export interface User {
    _id?: string;
    username: string;
    email: string;
    mobile: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Captcha {
    _id?: string;
    token: string;
    answer: string;
    createdAt: Date;
}
