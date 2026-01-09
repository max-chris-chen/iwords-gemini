import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';

const { 
    mockVerifyCaptchaFromCookies,
    mockFindUserByEmail,
    mockVerifyPassword
} = vi.hoisted(() => ({
    mockVerifyCaptchaFromCookies: vi.fn(),
    mockFindUserByEmail: vi.fn(),
    mockVerifyPassword: vi.fn()
}));

vi.mock('$lib/server/auth', () => ({
    verifyCaptchaFromCookies: mockVerifyCaptchaFromCookies,
    findUserByEmail: mockFindUserByEmail,
    verifyPassword: mockVerifyPassword
}));

describe('/login Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should login successfully with correct credentials', async () => {
        const formData = new FormData();
        formData.append('email', 'test@example.com');
        formData.append('password', 'password123');
        formData.append('captcha', 'abcd');

        mockVerifyCaptchaFromCookies.mockResolvedValue(true);
        mockFindUserByEmail.mockResolvedValue({ 
            email: 'test@example.com', 
            passwordHash: 'hashed' 
        });
        mockVerifyPassword.mockResolvedValue(true);

        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(mockVerifyCaptchaFromCookies).toHaveBeenCalled();
        expect(mockVerifyPassword).toHaveBeenCalledWith('password123', 'hashed');
        expect(result).toEqual({ success: true });
    });

    it('should fail with incorrect password', async () => {
        const formData = new FormData();
        formData.append('email', 'test@example.com');
        formData.append('password', 'wrong');
        formData.append('captcha', 'abcd');

        mockVerifyCaptchaFromCookies.mockResolvedValue(true);
        mockFindUserByEmail.mockResolvedValue({ 
            email: 'test@example.com', 
            passwordHash: 'hashed' 
        });
        mockVerifyPassword.mockResolvedValue(false);

        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('Invalid email or password');
    });

    it('should fail with incorrect captcha', async () => {
        const formData = new FormData();
        formData.append('email', 'test@example.com');
        formData.append('password', 'password123');
        formData.append('captcha', 'wrong');

        mockVerifyCaptchaFromCookies.mockResolvedValue(false);

        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('Incorrect verification code');
    });

    it('should fail if user not found', async () => {
        const formData = new FormData();
        formData.append('email', 'notfound@example.com');
        formData.append('password', 'password123');
        formData.append('captcha', 'abcd');

        mockVerifyCaptchaFromCookies.mockResolvedValue(true);
        mockFindUserByEmail.mockResolvedValue(null);

        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('Invalid email or password');
    });

    it('should fail if fields are missing', async () => {
        const formData = new FormData();
        
        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('All fields are required');
    });
});
