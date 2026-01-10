import { findUserById } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const userId = event.cookies.get('userId');
    console.log('[hooks] userId cookie:', userId);

    if (userId) {
        const user = await findUserById(userId);
        console.log('[hooks] user found:', user ? user.username : 'null');
        if (user) {
            event.locals.user = {
                id: user._id!.toString(),
                username: user.username
            };
        }
    } else {
        console.log('[hooks] No userId cookie found.');
    }

    return resolve(event);
};
