import { findUserById } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const userId = event.cookies.get('userId');

    if (userId) {
        const user = await findUserById(userId);
        if (user) {
            event.locals.user = {
                id: user._id!.toString(),
                username: user.username
            };
        }
    }

    return resolve(event);
};
