import { json } from '@sveltejs/kit';
import svgCaptcha from 'svg-captcha';
import { storeCaptcha } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
    const captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 2,
        color: true,
        background: '#f0f0f0'
    });

    const token = crypto.randomUUID();
    
    await storeCaptcha(token, captcha.text.toLowerCase());

    cookies.set('captcha-token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 300 // 5 minutes
    });

    return json({
        svg: captcha.data
    });
};
