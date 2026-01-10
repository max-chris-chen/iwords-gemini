<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { onMount } from 'svelte';

    let { form } = $props();

    let captchaSvg = $state('');
    let isLoadingCaptcha = $state(false);

    async function refreshCaptcha() {
        isLoadingCaptcha = true;
        try {
            const response = await fetch('/api/auth/captcha');
            const data = await response.json();
            captchaSvg = data.svg;
        } catch (error) {
            console.error('Failed to fetch captcha:', error);
        } finally {
            isLoadingCaptcha = false;
        }
    }

    onMount(() => {
        refreshCaptcha();
    });
</script>

<div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <h1 class="text-3xl font-black text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
        </h1>

        <form method="POST" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'redirect') {
                    await invalidateAll();
                }
                await update();
            };
        }} class="space-y-6">
            <div>
                <label for="email" class="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label for="captcha" class="block text-sm font-bold text-gray-700 mb-1">Verification Code</label>
                <div class="flex gap-4">
                    <input
                        type="text"
                        id="captcha"
                        name="captcha"
                        required
                        class="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="Type code"
                    />
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div 
                        class="bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 overflow-hidden flex items-center justify-center min-w-[120px] h-[50px]"
                        onclick={refreshCaptcha}
                        title="Click to refresh"
                    >
                        {#if isLoadingCaptcha}
                            <div class="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                        {:else}
                            {@html captchaSvg}
                        {/if}
                    </div>
                </div>
            </div>

            {#if form?.error}
                <div class="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {form.error}
                </div>
            {/if}

            {#if form?.success}
                <div class="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100">
                    Login successful! Redirecting...
                </div>
            {/if}

            <button
                type="submit"
                class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
                Log In
            </button>
        </form>

        <p class="text-center mt-6 text-sm text-gray-500">
            Don't have an account? 
            <a href="/register" class="text-indigo-600 font-bold hover:underline">Sign up</a>
        </p>
    </div>
</div>
