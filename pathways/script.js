// New layout JavaScript - Sidebar + Grid functionality

class PathwayViewer {
    constructor() {
        this.currentPathway = null;
        this.pathwayData = {};
        this.comparisonData = {};
        this.searchIndex = {};

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadData() {
        try {
            // Load pathway data
            const pathways = ['creative-technologist', 'physical-interface-designer', 'games-playable-media-maker'];

            for (const pathway of pathways) {
                const response = await fetch(`${pathway}.json`);
                this.pathwayData[pathway] = await response.json();
            }

            // Load comparison and search data
            const comparisonResponse = await fetch('pathway-comparison.json');
            this.comparisonData = await comparisonResponse.json();

            const searchResponse = await fetch('searchable-index.json');
            this.searchIndex = await searchResponse.json();

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load course data. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Pathway card clicks
        document.querySelectorAll('.pathway-card').forEach(card => {
            card.addEventListener('click', () => {
                const pathway = card.dataset.pathway;
                this.selectPathway(pathway);
            });
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('courseModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    selectPathway(pathway) {
        this.currentPathway = pathway;

        // Update active card
        document.querySelectorAll('.pathway-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-pathway="${pathway}"]`).classList.add('active');

        // Update header info
        const pathwayName = this.pathwayData[pathway].name;
        document.querySelector('.pathway-info').textContent = `Viewing ${pathwayName} pathway`;

        // Populate course grid
        this.populateCourseGrid(pathway);
    }

    populateCourseGrid(pathway) {
        const container = document.getElementById('courseGridContainer');
        const data = this.pathwayData[pathway];

        // Clear existing content
        container.innerHTML = '';

        // Create grid with headers
        const grid = document.createElement('div');
        grid.className = 'grid-with-headers';

        // Top-left corner (empty)
        const cornerCell = document.createElement('div');
        cornerCell.className = 'grid-header corner-cell';
        grid.appendChild(cornerCell);

        // Course type headers
        const courseTypes = [
            { key: 'core_courses', label: 'Core Courses' },
            { key: 'program_specific_electives', label: 'Program Specific Electives' },
            { key: 'open_electives', label: 'Open Electives' },
            { key: 'breadth_electives', label: 'Breadth Electives' }
        ];

        courseTypes.forEach(type => {
            const header = document.createElement('div');
            header.className = 'grid-header course-type-label';
            header.textContent = type.label;
            grid.appendChild(header);
        });

        // Year rows with data (Fall and Winter semesters)
        for (let year = 1; year <= 4; year++) {
            const yearData = data.years[year.toString()];
            if (!yearData) continue;

            // Fall semester
            if (yearData.fall) {
                // Year/Semester label
                const fallLabel = document.createElement('div');
                fallLabel.className = 'grid-header year-label';
                fallLabel.textContent = `Year ${year} - Fall`;
                grid.appendChild(fallLabel);

                // Course cells for each type in Fall
                courseTypes.forEach(type => {
                    const courses = yearData.fall[type.key] || [];
                    const cell = this.createGridCell(courses);
                    grid.appendChild(cell);
                });
            }

            // Winter semester
            if (yearData.winter) {
                // Year/Semester label
                const winterLabel = document.createElement('div');
                winterLabel.className = 'grid-header year-label';
                winterLabel.textContent = `Year ${year} - Winter`;
                grid.appendChild(winterLabel);

                // Course cells for each type in Winter
                courseTypes.forEach(type => {
                    const courses = yearData.winter[type.key] || [];
                    const cell = this.createGridCell(courses);
                    grid.appendChild(cell);
                });
            }
        }

        container.appendChild(grid);
    }

    createGridCell(courses) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';

        if (courses.length === 0) {
            cell.classList.add('empty');
            return cell;
        }

        courses.forEach(course => {
            const courseItem = document.createElement('div');
            // Add class based on credit value
            const creditClass = course.credits === 1.0 ? 'course-item-full' : 'course-item-half';
            courseItem.className = `course-item ${creditClass}`;
            courseItem.innerHTML = `
                <div class="course-title">${course.title}</div>
                <div class="course-code">${course.code || 'TBD'}</div>
                <div class="course-credits">${course.credits} Credits</div>
            `;

            courseItem.addEventListener('click', () => {
                this.showCourseModal(course);
            });

            cell.appendChild(courseItem);
        });

        return cell;
    }

    showCourseModal(course) {
        const modal = document.getElementById('courseModal');
        const title = document.getElementById('modalTitle');
        const code = document.getElementById('modalCode');
        const credits = document.getElementById('modalCredits');
        const description = document.getElementById('modalDescription');

        title.textContent = course.title;
        code.textContent = course.code || 'TBD';
        credits.textContent = `${course.credits} Credits`;
        description.textContent = course.description || 'No description available.';

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('courseModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateUI() {
        // Add loading state initially
        const container = document.getElementById('courseGridContainer');
        container.innerHTML = `
            <div class="grid-placeholder">
                <h3>Select a pathway to view courses</h3>
                <p>Choose from the sidebar to explore 4-year course structures</p>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('courseGridContainer');
        container.innerHTML = `
            <div class="grid-placeholder">
                <h3>Unable to load courses</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PathwayViewer();
});

// Handle mobile sidebar toggle (for future enhancement)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Utility function for responsive design
function isMobile() {
    return window.innerWidth <= 768;
}

// Handle window resize
window.addEventListener('resize', () => {
    // Add any responsive adjustments here
    const sidebar = document.querySelector('.sidebar');
    if (isMobile()) {
        sidebar.classList.remove('mobile-open');
    }
});
