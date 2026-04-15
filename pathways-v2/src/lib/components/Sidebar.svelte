<script>
    import { fly } from 'svelte/transition';
    import { selectedPathway } from '$lib/stores/pathways.js';

    let { pathways = [], onselect } = $props();
    let mobileOpen = $state(false);

    function select(id) {
        selectedPathway.set(id);
        if (onselect) onselect(id);
        if (window.innerWidth <= 768) {
            mobileOpen = false;
            document.body.classList.remove('sidebar-open');
        }
    }

    function handleKeydown(e, id) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            select(id);
        }
    }

    function toggleMobile() {
        mobileOpen = !mobileOpen;
        document.body.classList.toggle('sidebar-open', mobileOpen);
    }

    let current = $derived($selectedPathway);
</script>

<!-- Mobile toggle button -->
<button
    class="sidebar-toggle"
    aria-label={mobileOpen ? 'Close pathway menu' : 'Open pathway menu'}
    aria-expanded={mobileOpen}
    onclick={toggleMobile}
>
    <span class="toggle-bar" class:open={mobileOpen}></span>
    <span class="toggle-bar" class:open={mobileOpen}></span>
    <span class="toggle-bar" class:open={mobileOpen}></span>
</button>

<!-- Sidebar -->
<aside class="sidebar" class:mobile-open={mobileOpen} role="navigation" aria-label="Pathway selection">
    <div class="sidebar-header">
        <h2>Digital Futures</h2>
    </div>

    <div class="pathway-cards" role="listbox" aria-label="Available pathways">
        {#each pathways as pw (pw.id)}
            <div
                class="pathway-card"
                class:active={current === pw.id}
                role="option"
                tabindex="0"
                aria-selected={current === pw.id}
                onclick={() => select(pw.id)}
                onkeydown={(e) => handleKeydown(e, pw.id)}
            >
                <h3>{pw.title}</h3>
                <p>{pw.description}</p>
            </div>
        {/each}
    </div>

    <div class="sidebar-footer">
        <p class="elective-note">Note: Elective courses are not guaranteed to be offered in any given semester</p>
    </div>
</aside>

<style>
    .sidebar {
        width: var(--sidebar-width);
        background: var(--light-bg);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100vh;
        left: 0;
        top: 0;
        z-index: 100;
        overflow-y: auto;
    }

    .sidebar-header {
        padding: 24px 16px 16px 16px;
        border-bottom: 1px solid var(--border-color);
    }

    .sidebar-header h2 {
        margin-bottom: 8px;
        font-weight: 300;
        font-size: 1.5em;
        letter-spacing: -0.3px;
        color: var(--text-color);
    }

    .pathway-cards {
        padding: 20px;
        flex: 1;
    }

    .pathway-card {
        background: var(--light-bg);
        border: 1px solid var(--border-color);
        padding: 20px;
        margin-bottom: 16px;
        cursor: pointer;
        transition: border-color 0.2s ease, border-left-width 0.2s ease;
    }

    .pathway-card:hover {
        border-color: var(--text-color);
    }

    .pathway-card:focus-visible {
        outline: 2px solid var(--text-color);
        outline-offset: 2px;
    }

    .pathway-card.active {
        border-color: var(--text-color);
        border-left: 4px solid var(--text-color);
        background: var(--card-bg);
    }

    .pathway-card h3 {
        margin-bottom: 12px;
        color: var(--text-color);
        font-size: 1.05em;
        font-weight: 500;
        letter-spacing: -0.2px;
        line-height: 1.3;
    }

    .pathway-card p {
        color: var(--text-light);
        font-size: 0.9em;
        line-height: 1.6;
    }

    .sidebar-footer {
        padding: 24px;
        border-top: 1px solid var(--border-color);
    }

    .elective-note {
        font-size: 0.75em;
        color: var(--text-light);
        line-height: 1.5;
        font-style: italic;
    }

    /* Mobile toggle */
    .sidebar-toggle {
        display: none;
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 200;
        background: var(--light-bg);
        border: 1px solid var(--border-color);
        width: 44px;
        height: 44px;
        cursor: pointer;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 0;
    }

    .toggle-bar {
        display: block;
        width: 20px;
        height: 2px;
        background: var(--text-color);
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .toggle-bar.open:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }
    .toggle-bar.open:nth-child(2) {
        opacity: 0;
    }
    .toggle-bar.open:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }

    @media (max-width: 768px) {
        .sidebar-toggle {
            display: flex;
        }

        .sidebar {
            position: fixed;
            width: 85%;
            max-width: 360px;
            height: 100vh;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            z-index: 150;
            box-shadow: none;
        }

        .sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
        }
    }

    @media (max-width: 480px) {
        .sidebar-header,
        .pathway-cards,
        .sidebar-footer {
            padding: 16px;
        }

        .pathway-card {
            padding: 16px;
            margin-bottom: 12px;
        }
    }

    @media print {
        .sidebar,
        .sidebar-toggle {
            display: none !important;
        }
    }
</style>
