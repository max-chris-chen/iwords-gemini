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
        
        await createUser({
            username,
            email,
            mobile,
            passwordHash
        });

        return { success: true };
    }
};
