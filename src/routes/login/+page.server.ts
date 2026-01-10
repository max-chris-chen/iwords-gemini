import { fail, redirect } from '@sveltejs/kit';
import { 
    verifyCaptchaFromCookies, 
    findUserByEmail, 
    verifyPassword 
} from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const captcha = data.get('captcha') as string;

        if (!email || !password || !captcha) {
            return fail(400, { error: 'All fields are required' });
        }

        const isCaptchaValid = await verifyCaptchaFromCookies(cookies, captcha);
        if (!isCaptchaValid) {
            return fail(400, { error: 'Incorrect verification code' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return fail(400, { error: 'Invalid email or password' });
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            return fail(400, { error: 'Invalid email or password' });
        }

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
