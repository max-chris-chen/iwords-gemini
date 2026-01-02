import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import *s from 'node:util';

const execPromise = s.promisify(exec);

describe('diag-fs-env.ts', () => {
    it('should execute without errors', async () => {
        const { stdout, stderr } = await execPromise('ts-node diag-fs-env.ts');
        expect(stderr).toBe('');
    });
});
