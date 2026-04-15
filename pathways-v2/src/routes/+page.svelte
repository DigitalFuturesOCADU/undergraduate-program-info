<script>
    import Sidebar from '$lib/components/Sidebar.svelte';
    import CourseGrid from '$lib/components/CourseGrid.svelte';
    import CourseModal from '$lib/components/CourseModal.svelte';
    import { selectedPathway } from '$lib/stores/pathways.js';

    let { data } = $props();

    let current = $derived($selectedPathway);
    let currentData = $derived(current ? data.pathwayData[current] ?? null : null);

    // Select first pathway on load
    $effect(() => {
        if (!$selectedPathway && data.pathways.length > 0) {
            selectedPathway.set(data.pathways[0].id);
        }
    });
</script>

<svelte:head>
    <title>{currentData ? `${currentData.name} — ` : ''}Digital Futures Pathways</title>
    <meta name="description" content="Explore undergraduate pathway plans for the Digital Futures program at OCAD University." />
</svelte:head>

<div class="app-layout">
    <Sidebar pathways={data.pathways} />

    <main class="main-content">
        {#if currentData}
            <header class="content-header">
                <h1>{currentData.name}</h1>
            </header>
        {/if}

        <CourseGrid data={currentData} />
    </main>
</div>

<CourseModal />

<style>
    .app-layout {
        display: flex;
        min-height: 100vh;
    }

    .main-content {
        flex: 1;
        margin-left: var(--sidebar-width);
        min-height: 100vh;
    }

    .content-header {
        padding: 24px 40px 0 80px;
    }

    .content-header h1 {
        font-weight: 300;
        font-size: 1.8em;
        letter-spacing: -0.5px;
        color: var(--text-color);
    }

    @media (max-width: 1024px) {
        .content-header {
            padding: 24px 20px 0 60px;
        }
    }

    @media (max-width: 768px) {
        .main-content {
            margin-left: 0;
        }

        .content-header {
            padding: 60px 12px 0 12px;
        }

        .content-header h1 {
            font-size: 1.4em;
        }
    }

    @media print {
        .main-content {
            margin-left: 0;
        }
    }
</style>
