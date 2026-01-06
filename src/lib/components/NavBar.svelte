<script lang="ts">
    import CapsuleInput from './CapsuleInput.svelte';
</script>

<nav class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white flex justify-between items-center shadow-xl mb-8 gap-4">
    <a href="/" class="text-3xl font-black tracking-tighter hover:scale-105 transition-transform duration-200 shrink-0">
        iWords
    </a>
    
    <div class="flex-grow flex justify-center max-w-xl mx-4">
        <CapsuleInput />
    </div>

    <ul class="flex space-x-6 text-lg font-bold shrink-0">
        <li>
            <a href="/" data-testid="home-link" class="hover:text-yellow-300 transition-colors duration-200">Home</a>
        </li>
    </ul>
</nav>
