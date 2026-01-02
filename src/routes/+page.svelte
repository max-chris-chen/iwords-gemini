<!-- src/routes/+page.svelte -->
<script lang="ts">
    export let data;

    const { scenarios } = data;
</script>

<h1>iWords Scenarios</h1>

{#if scenarios.length > 0}
    <ul>
        {#each scenarios as scenario}
            <li>
                <a href="/scenario/{scenario._id}">{scenario.prompt}</a>
                <span>({new Date(scenario.createdAt).toLocaleString()})</span>
            </li>
        {/each}
    </ul>
{:else}
    <p>No scenarios found. Generate one!</p>
{/if}

<style>
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        margin-bottom: 1rem;
    }
    a {
        font-size: 1.2rem;
        text-decoration: none;
        color: #333;
    }
    a:hover {
        text-decoration: underline;
    }
    span {
        margin-left: 1rem;
        font-size: 0.9rem;
        color: #666;
    }
</style>
