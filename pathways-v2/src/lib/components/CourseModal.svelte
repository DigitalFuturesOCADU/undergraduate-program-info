<script>
    import { fade, fly } from 'svelte/transition';
    import { modalCourse } from '$lib/stores/pathways.js';

    let course = $derived($modalCourse);
    let dialogEl = $state(null);

    $effect(() => {
        if (course && dialogEl) {
            document.body.classList.add('modal-open');
            dialogEl.focus();
        } else {
            document.body.classList.remove('modal-open');
        }
    });

    function close() {
        modalCourse.set(null);
    }

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            close();
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') {
            close();
        }
        // Focus trap
        if (e.key === 'Tab' && dialogEl) {
            const focusable = dialogEl.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
</script>

{#if course}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="modal-backdrop"
        transition:fade={{ duration: 150 }}
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
    >
        <div
            class="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="{course.code}: {course.name}"
            tabindex="-1"
            bind:this={dialogEl}
            transition:fly={{ y: 20, duration: 200 }}
        >
            <button class="modal-close" onclick={close} aria-label="Close dialog">&times;</button>

            <div class="modal-header">
                <span class="modal-code">{course.code}</span>
                <h2 class="modal-title">{course.name}</h2>
            </div>

            <div class="modal-body">
                {#if course.credits}
                    <div class="modal-field">
                        <span class="field-label">Credits</span>
                        <span class="field-value">{course.credits}</span>
                    </div>
                {/if}

                {#if course.description}
                    <div class="modal-field">
                        <span class="field-label">Description</span>
                        <p class="field-value">{course.description}</p>
                    </div>
                {/if}

                {#if course.prerequisites}
                    <div class="modal-field">
                        <span class="field-label">Prerequisites</span>
                        <p class="field-value">{course.prerequisites}</p>
                    </div>
                {/if}

                {#if course.notes}
                    <div class="modal-field">
                        <span class="field-label">Notes</span>
                        <p class="field-value">{course.notes}</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 24px;
    }

    .modal-content {
        background: white;
        max-width: 560px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        padding: 40px;
        border: 1px solid var(--border-color);
    }

    .modal-content:focus {
        outline: none;
    }

    .modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 1.8em;
        cursor: pointer;
        color: var(--text-light);
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;
        padding: 0;
        line-height: 1;
    }

    .modal-close:hover {
        color: var(--text-color);
    }

    .modal-close:focus-visible {
        outline: 2px solid var(--text-color);
        outline-offset: 2px;
    }

    .modal-header {
        margin-bottom: 24px;
        padding-right: 40px;
    }

    .modal-code {
        display: block;
        font-size: 0.85em;
        font-weight: 600;
        letter-spacing: 0.5px;
        color: var(--text-light);
        margin-bottom: 8px;
    }

    .modal-title {
        font-size: 1.4em;
        font-weight: 400;
        line-height: 1.3;
        letter-spacing: -0.3px;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .modal-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .field-label {
        font-size: 0.75em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-light);
    }

    .field-value {
        font-size: 0.95em;
        line-height: 1.6;
        color: var(--text-color);
    }

    @media (max-width: 768px) {
        .modal-backdrop {
            padding: 16px;
        }

        .modal-content {
            padding: 24px;
            max-height: 85vh;
        }

        .modal-title {
            font-size: 1.2em;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .modal-backdrop,
        .modal-content {
            transition: none;
        }
    }
</style>
