<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/NavBar.svelte';

    let { data, children } = $props();
    let user = $derived(data.user);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<NavBar {user} />
{@render children()}
