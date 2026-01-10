import { fail, redirect } from '@sveltejs/kit';
import { 
    verifyCaptchaFromCookies, 
    findUserByEmail, 
    findUserByUsername, 
    hashPassword, 
    createUser 
} from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get('username') as string;
        const email = data.get('email') as string;
        const mobile = data.get('mobile') as string;
        const password = data.get('password') as string;
        const captcha = data.get('captcha') as string;

        if (!username || !email || !mobile || !password || !captcha) {
            return fail(400, { error: 'All fields are required' });
        }

        const isCaptchaValid = await verifyCaptchaFromCookies(cookies, captcha);
        if (!isCaptchaValid) {
            return fail(400, { error: 'Incorrect verification code' });
        }

        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return fail(400, { error: 'Email already registered' });
        }

        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return fail(400, { error: 'Username already taken' });
        }

        const passwordHash = await hashPassword(password);
        
        const user = await createUser({
            username,
            email,
            mobile,
            passwordHash
        });

        cookies.set('userId', user._id!.toString(), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return { success: true };
    }
};
