<script>
    import CourseCell from './CourseCell.svelte';

    let { data = null } = $props();

    const courseTypeLabels = [
        { key: 'core_courses', label: 'Core' },
        { key: 'program_specific_electives', label: 'Program Electives' },
        { key: 'open_electives', label: 'Open Electives' },
        { key: 'breadth_electives', label: 'Breadth Electives' }
    ];

    let years = $derived(data ? Object.keys(data.years).sort((a, b) => Number(a) - Number(b)) : []);
    let requiredCourses = $derived(data?.required_courses ?? []);
</script>

{#if data}
    <div class="grid-wrapper">
        <!-- Column headers -->
        <div class="grid-header">
            <div class="header-spacer"></div>
            <div class="header-spacer"></div>
            {#each courseTypeLabels as ct (ct.key)}
                <div class="column-header">{ct.label}</div>
            {/each}
        </div>

        <!-- Year rows -->
        {#each years as yearNum (yearNum)}
            {@const yearData = data.years[yearNum]}
            <div class="year-group" data-year={yearNum}>
                <!-- Fall row -->
                <div class="semester-row">
                    <div class="year-label year-fall-label" data-year={yearNum}>Year {yearNum}</div>
                    <div class="semester-label">Fall</div>
                    {#each courseTypeLabels as ct (ct.key)}
                        <CourseCell
                            courses={yearData.fall?.[ct.key] ?? []}
                            {requiredCourses}
                            courseType={ct.label}
                        />
                    {/each}
                </div>

                <!-- Winter row -->
                <div class="semester-row">
                    <div class="year-label year-winter-label"></div>
                    <div class="semester-label">Winter</div>
                    {#each courseTypeLabels as ct (ct.key)}
                        <CourseCell
                            courses={yearData.winter?.[ct.key] ?? []}
                            {requiredCourses}
                            courseType={ct.label}
                        />
                    {/each}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="empty-state">
        <p>Select a pathway to view the course plan.</p>
    </div>
{/if}

<style>
    .grid-wrapper {
        padding: 20px 40px 20px 80px;
    }

    /* Column headers */
    .grid-header {
        display: grid;
        grid-template-columns: 48px 80px repeat(4, 1fr);
        gap: 1px;
        margin-bottom: 1px;
    }

    .header-spacer {
        /* empty space for year + semester columns */
    }

    .column-header {
        padding: 12px 8px;
        font-size: 0.75em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-light);
        text-align: center;
        background: var(--light-bg);
        border-bottom: 2px solid var(--text-color);
    }

    /* Year groups */
    .year-group {
        position: relative;
    }

    .semester-row {
        display: grid;
        grid-template-columns: 48px 80px repeat(4, 1fr);
        gap: 1px;
        border-bottom: 1px solid var(--border-color);
    }

    .year-group .semester-row:first-child {
        border-top: 2px solid var(--border-color);
    }

    /* Year label - spans both fall/winter rows via CSS */
    .year-label {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .year-fall-label {
        position: relative;
    }

    .year-fall-label::before {
        content: "Year " attr(data-year);
        position: absolute;
        left: -48px;
        top: 0;
        height: calc(200% + 1px);
        display: flex;
        align-items: center;
        font-size: 0.8em;
        font-weight: 500;
        color: var(--text-light);
        letter-spacing: 0.5px;
        white-space: nowrap;
    }

    .year-winter-label {
        /* empty, year label handled by fall row ::before */
    }

    .semester-label {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8em;
        font-weight: 500;
        color: var(--text-light);
        padding: 8px 4px;
    }

    .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60vh;
        color: var(--text-light);
        font-size: 1.1em;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .grid-wrapper {
            padding: 20px 20px 20px 60px;
        }
    }

    @media (max-width: 768px) {
        .grid-wrapper {
            padding: 60px 12px 20px 12px;
        }

        .grid-header {
            display: none;
        }

        .semester-row {
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        .year-label,
        .year-fall-label::before {
            display: none;
        }

        .semester-label {
            padding: 12px 8px 4px;
            font-weight: 600;
            justify-content: flex-start;
        }

        .year-group .semester-row:first-child .semester-label::before {
            content: "Year " attr(data-year) " - ";
        }
    }

    @media print {
        .grid-wrapper {
            padding: 0;
        }
    }
</style>
