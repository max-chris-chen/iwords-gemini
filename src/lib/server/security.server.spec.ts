import { describe, it, expect } from 'vitest';
import { sanitizeScenarioData, validatePrompt } from './security';

describe('Security Utilities', () => {
    describe('Input Validation', () => {
        it('should accept valid prompt', () => {
            expect(() => validatePrompt('valid prompt')).not.toThrow();
        });

        it('should reject non-string input', () => {
             // @ts-ignore
            expect(() => validatePrompt(123)).toThrow();
             // @ts-ignore
            expect(() => validatePrompt({ $gt: '' })).toThrow();
        });
        
        it('should reject too long prompt', () => {
            expect(() => validatePrompt('a'.repeat(201))).toThrow();
        });
    });

    describe('Sanitization', () => {
        it('should remove script tags from word object', () => {
            const dirty = {
                word: '<script>alert(1)</script>apple',
                definition: '<b>fruit</b>', // keep basic html? usually no for definitions unless specified
                phonetics: '/aaa/',
                examples: [{ en: '<img src=x onerror=alert(1)>hello', cn: 'nihao' }]
            };
            // Expect strict text only
            const clean = sanitizeScenarioData(dirty);
            expect(clean.word).toBe('apple');
            expect(clean.definition).toBe('fruit');
            expect(clean.examples[0].en).toBe('hello');
        });
    });
});
