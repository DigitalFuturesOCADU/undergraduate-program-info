<script>
    import { fly } from 'svelte/transition';
    import { modalCourse } from '$lib/stores/pathways.js';

    let { course, required = false } = $props();

    let credits = $derived(course.credits ?? 3);
    let sizeClass = $derived(credits <= 1.5 ? 'half' : 'full');

    function showDetails() {
        modalCourse.set(course);
    }

    function handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showDetails();
        }
    }
</script>

<div
    class="course-item {sizeClass}"
    class:required
    role="button"
    tabindex="0"
    aria-label="{course.code}: {course.name}{required ? ' (required)' : ''}"
    onclick={showDetails}
    onkeydown={handleKeydown}
    transition:fly={{ y: 8, duration: 200 }}
>
    <span class="course-code">{course.code}</span>
    <span class="course-name">{course.name}</span>
    {#if credits !== 3}
        <span class="course-credits">{credits} cr</span>
    {/if}
</div>

<style>
    .course-item {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        padding: 8px 10px;
        font-size: 0.82em;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-height: 48px;
        justify-content: center;
    }

    .course-item:hover {
        border-color: var(--text-color);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }

    .course-item:focus-visible {
        outline: 2px solid var(--text-color);
        outline-offset: 2px;
    }

    .course-item.required {
        border-left: 3px solid var(--text-color);
    }

    .course-item.half {
        padding: 4px 10px;
        min-height: 36px;
    }

    .course-code {
        font-weight: 600;
        font-size: 0.9em;
        letter-spacing: 0.3px;
    }

    .course-name {
        color: var(--text-light);
        font-size: 0.85em;
        line-height: 1.3;
    }

    .course-credits {
        font-size: 0.75em;
        color: var(--text-light);
        margin-top: 2px;
    }

    @media (max-width: 768px) {
        .course-item {
            min-height: 44px;
        }
    }
</style>
