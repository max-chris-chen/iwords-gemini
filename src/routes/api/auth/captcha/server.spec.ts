import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';

// Use vi.hoisted for variables used in mocks
const { mockStoreCaptcha } = vi.hoisted(() => ({
    mockStoreCaptcha: vi.fn()
}));

// Mocks
vi.mock('svg-captcha', () => ({
    create: vi.fn().mockReturnValue({
        data: '<svg>mock</svg>',
        text: 'abcd'
    })
}));

vi.mock('$lib/server/auth', () => ({
    storeCaptcha: mockStoreCaptcha
}));

describe('GET /api/auth/captcha', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should generate a captcha and return SVG data with a token in cookies', async () => {
        const mockCookies = {
            set: vi.fn()
        };
        
        const request = new Request('http://localhost/api/auth/captcha');
        const event = {
            request,
            cookies: mockCookies
        } as any;

        const response = await GET(event);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toHaveProperty('svg');
        expect(body.svg).toBe('<svg>mock</svg>');
        
        expect(mockCookies.set).toHaveBeenCalledWith('captcha-token', expect.any(String), expect.objectContaining({
            path: '/',
            httpOnly: true,
            maxAge: 300
        }));
        
        expect(mockStoreCaptcha).toHaveBeenCalledWith(expect.any(String), 'abcd');
    });
});
