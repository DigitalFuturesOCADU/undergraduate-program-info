<script>
    import CourseItem from './CourseItem.svelte';

    let { courses = [], requiredCourses = [], courseType = '' } = $props();
</script>

<div class="course-cell" data-course-type={courseType}>
    {#if courses.length > 0}
        {#each courses as course (course.code)}
            <CourseItem
                {course}
                required={requiredCourses.includes(course.code)}
            />
        {/each}
    {/if}
</div>

<style>
    .course-cell {
        min-height: 50px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    @media (max-width: 768px) {
        .course-cell {
            padding: 6px;
        }

        .course-cell:empty {
            display: none;
        }

        .course-cell::before {
            content: attr(data-course-type);
            font-size: 0.7em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-light);
            font-weight: 500;
            margin-bottom: 4px;
        }
    }
</style>
