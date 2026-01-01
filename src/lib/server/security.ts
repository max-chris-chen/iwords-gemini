import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import type { Word } from '../models/types';

const PromptSchema = z.string().min(1).max(200);

export function validatePrompt(prompt: unknown): string {
    try {
        return PromptSchema.parse(prompt);
    } catch (e) {
        throw new Error('Invalid prompt: ' + (e as Error).message);
    }
}

export function sanitizeScenarioData(wordData: Word): Word {
    const clean = (text: string) => sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {}
    });

    return {
        word: clean(wordData.word),
        phonetics: wordData.phonetics ? clean(wordData.phonetics) : undefined,
        definition: clean(wordData.definition),
        examples: wordData.examples.map(ex => ({
            en: clean(ex.en),
            cn: ex.cn ? clean(ex.cn) : undefined,
            audioUrl: ex.audioUrl 
        })),
        audioUrl: wordData.audioUrl
    };
}

// Simple Rate Limiter (Token Bucket / Fixed Window)
const ipMap = new Map<string, { count: number, expiry: number }>();
const LIMIT = 20; // requests
const WINDOW = 60 * 1000; // 1 minute

export function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = ipMap.get(ip);

    if (!record || record.expiry < now) {
        ipMap.set(ip, { count: 1, expiry: now + WINDOW });
        return true;
    }

    if (record.count >= LIMIT) {
        return false;
    }

    record.count++;
    return true;
}
