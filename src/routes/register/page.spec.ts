import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';

// Use vi.hoisted for variables used in mocks
const { 
    mockVerifyCaptchaFromCookies,
    mockFindUserByEmail,
    mockFindUserByUsername,
    mockHashPassword,
    mockCreateUser
} = vi.hoisted(() => ({
    mockVerifyCaptchaFromCookies: vi.fn(),
    mockFindUserByEmail: vi.fn(),
    mockFindUserByUsername: vi.fn(),
    mockHashPassword: vi.fn(),
    mockCreateUser: vi.fn()
}));

vi.mock('$lib/server/auth', () => ({
    verifyCaptchaFromCookies: mockVerifyCaptchaFromCookies,
    findUserByEmail: mockFindUserByEmail,
    findUserByUsername: mockFindUserByUsername,
    hashPassword: mockHashPassword,
    createUser: mockCreateUser
}));

describe('/register Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should register a new user and redirect to dashboard', async () => {
        const formData = new FormData();
        formData.append('username', 'testuser');
        formData.append('email', 'test@example.com');
        formData.append('mobile', '1234567890');
        formData.append('password', 'password123');
        formData.append('captcha', 'abcd');

        const mockCookies = { set: vi.fn() };
        
        mockVerifyCaptchaFromCookies.mockResolvedValue(true);
        mockFindUserByEmail.mockResolvedValue(null);
        mockFindUserByUsername.mockResolvedValue(null);
        mockHashPassword.mockResolvedValue('hashed_password');
        mockCreateUser.mockResolvedValue({ _id: 'user-123', username: 'testuser' });

        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: mockCookies
        } as any;

        try {
            await actions.default(event);
            expect.fail('Should have thrown redirect');
        } catch (e: any) {
            if (e.status === 302 && e.location === '/dashboard') {
                expect(e.status).toBe(302);
            } else {
                throw e;
            }
        }

        expect(mockVerifyCaptchaFromCookies).toHaveBeenCalledWith(mockCookies, 'abcd');
        expect(mockFindUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(mockCreateUser).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            mobile: '1234567890',
            passwordHash: 'hashed_password'
        });
        expect(mockCookies.set).toHaveBeenCalledWith('userId', 'user-123', expect.any(Object));
    });

    it('should return error if captcha is wrong', async () => {
        const formData = new FormData();
        formData.append('username', 'testuser');
        formData.append('email', 'test@example.com');
        formData.append('mobile', '1234567890');
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

    it('should return error if email already exists', async () => {
        const formData = new FormData();
        formData.append('username', 'testuser');
        formData.append('email', 'exists@example.com');
        formData.append('mobile', '1234567890');
        formData.append('password', 'password123');
        formData.append('captcha', 'abcd');
        
        mockVerifyCaptchaFromCookies.mockResolvedValue(true);
        mockFindUserByEmail.mockResolvedValue({ email: 'exists@example.com' });

        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('Email already registered');
    });

    it('should return error if username already exists', async () => {
        const formData = new FormData();
        formData.append('username', 'existinguser');
        formData.append('email', 'new@example.com');
        formData.append('mobile', '1234567890');
        formData.append('password', 'password123');
        formData.append('captcha', 'abcd');
        
        mockVerifyCaptchaFromCookies.mockResolvedValue(true);
        mockFindUserByEmail.mockResolvedValue(null);
        mockFindUserByUsername.mockResolvedValue({ username: 'existinguser' });

        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('Username already taken');
    });

    it('should return error if fields are missing', async () => {
        const formData = new FormData();
        // missing fields
        
        const event = {
            request: { formData: () => Promise.resolve(formData) },
            cookies: {}
        } as any;

        const result = await actions.default(event);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('All fields are required');
    });
});
