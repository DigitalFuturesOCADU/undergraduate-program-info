// Pathway Viewer — Sidebar + Grid application

class PathwayViewer {
    constructor() {
        this.currentPathway = null;
        this.pathwayData = {};
        this.courseMap = new WeakMap();
        this.lastFocusedElement = null;
        this.init();
    }

    async init() {
        this.cacheDOM();
        if (!this.container) return;
        this.showLoading();
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
    }

    cacheDOM() {
        this.container = document.getElementById('courseGridContainer');
        this.modal = document.getElementById('courseModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalCode = document.getElementById('modalCode');
        this.modalCredits = document.getElementById('modalCredits');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalRequired = document.getElementById('modalRequired');
        this.modalClose = document.querySelector('.modal-close');
        this.pathwayInfo = document.querySelector('.pathway-info');
        this.sidebar = document.querySelector('.sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
    }

    async loadData() {
        const pathways = [
            'creative-technologist',
            'physical-interface-designer',
            'games-playable-media-maker'
        ];

        const results = await Promise.allSettled(
            pathways.map(async (id) => {
                const response = await fetch(`${id}.json`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return { id, data: await response.json() };
            })
        );

        let failures = 0;
        for (const result of results) {
            if (result.status === 'fulfilled') {
                this.pathwayData[result.value.id] = result.value.data;
            } else {
                failures++;
            }
        }

        if (failures === pathways.length) {
            this.showError('Failed to load course data. Please refresh the page.');
        } else if (failures > 0) {
            console.warn(`${failures} pathway file(s) failed to load.`);
        }
    }

    setupEventListeners() {
        // Pathway card clicks + keyboard
        document.querySelectorAll('.pathway-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectPathway(card.dataset.pathway);
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectPathway(card.dataset.pathway);
                }
            });
        });

        // Event delegation for course item clicks on the grid
        if (this.container) {
            this.container.addEventListener('click', (e) => {
                const courseItem = e.target.closest('.course-item');
                if (!courseItem) return;
                const course = this.courseMap.get(courseItem);
                if (course) this.showCourseModal(course, courseItem);
            });
        }

        // Modal close via button
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }

        // Modal close via backdrop
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) this.closeModal();
            });
        }

        // Keyboard: Escape closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('visible')) {
                this.closeModal();
            }
        });

        // Modal focus trap
        if (this.modal) {
            this.modal.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;
                this.trapFocus(e);
            });
        }

        // Mobile sidebar toggle
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
    }

    // -- Pathway selection --

    selectPathway(pathway) {
        const data = this.pathwayData[pathway];
        if (!data) return;

        this.currentPathway = pathway;

        // Update active card + aria
        document.querySelectorAll('.pathway-card').forEach(card => {
            const isActive = card.dataset.pathway === pathway;
            card.classList.toggle('active', isActive);
            card.setAttribute('aria-selected', isActive);
        });

        // Update header
        if (this.pathwayInfo) {
            this.pathwayInfo.textContent = `${data.name} Pathway`;
        }

        // Populate grid
        this.populateCourseGrid(pathway);

        // Mobile: collapse sidebar and scroll to content
        if (window.innerWidth <= 768 && this.sidebar) {
            this.sidebar.classList.remove('mobile-open');
            document.body.classList.remove('sidebar-open');
            if (this.container) {
                this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // -- Grid rendering --

    populateCourseGrid(pathway) {
        if (!this.container) return;
        const data = this.pathwayData[pathway];
        if (!data) return;

        const requiredCourses = data.required_courses || [];

        // Clear
        this.container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'grid-with-headers';

        // Corner cell
        const corner = document.createElement('div');
        corner.className = 'grid-header corner-cell';
        grid.appendChild(corner);

        // Column headers
        const courseTypes = [
            { key: 'core_courses', label: 'Core Courses' },
            { key: 'program_specific_electives', label: 'Program Specific Electives' },
            { key: 'open_electives', label: 'Open Electives' },
            { key: 'breadth_electives', label: 'Breadth' }
        ];

        courseTypes.forEach(type => {
            const header = document.createElement('div');
            header.className = 'grid-header course-type-label';
            header.textContent = type.label;
            grid.appendChild(header);
        });

        // Year rows
        for (let year = 1; year <= 4; year++) {
            const yearData = data.years[year.toString()];
            if (!yearData) continue;

            const semesters = [
                { key: 'fall', labelClass: 'year-fall-label' },
                { key: 'winter', labelClass: 'year-winter-label' }
            ];

            for (const sem of semesters) {
                if (!yearData[sem.key]) continue;

                const label = document.createElement('div');
                label.className = `grid-header year-label ${sem.labelClass}`;
                label.setAttribute('data-year', year);
                label.textContent = `Year ${year} - ${sem.key.charAt(0).toUpperCase() + sem.key.slice(1)}`;
                grid.appendChild(label);

                courseTypes.forEach(type => {
                    const courses = yearData[sem.key][type.key] || [];
                    const cell = this.createGridCell(courses, requiredCourses, type.label);
                    grid.appendChild(cell);
                });
            }
        }

        this.container.appendChild(grid);
    }

    createGridCell(courses, requiredCourses, typeLabel) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        if (typeLabel) {
            cell.setAttribute('data-course-type', typeLabel);
        }

        if (courses.length === 0) {
            cell.classList.add('empty');
            return cell;
        }

        courses.forEach((course, i) => {
            const item = document.createElement('div');

            const creditValue = parseFloat(course.credits) || 0;
            const creditClass = creditValue >= 1.0 ? 'course-item-full' : 'course-item-half';
            const isRequired = requiredCourses.includes(course.code);

            item.className = `course-item ${creditClass}${isRequired ? ' course-required' : ''}`;
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `${course.title} (${course.code || 'TBD'})`);
            item.style.animationDelay = `${i * 0.05}s`;

            // Build content with DOM API (no innerHTML)
            const titleEl = document.createElement('div');
            titleEl.className = 'course-title';
            titleEl.textContent = course.title;

            const codeEl = document.createElement('div');
            codeEl.className = 'course-code';
            codeEl.textContent = course.code || 'TBD';

            item.appendChild(titleEl);
            item.appendChild(codeEl);

            // Keyboard activation
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showCourseModal(course, item);
                }
            });

            // Store course reference for event delegation
            this.courseMap.set(item, course);

            cell.appendChild(item);
        });

        return cell;
    }

    // -- Modal --

    showCourseModal(course, triggerElement) {
        if (!this.modal) return;

        this.lastFocusedElement = triggerElement || document.activeElement;

        if (this.modalTitle) this.modalTitle.textContent = course.title;
        if (this.modalCode) this.modalCode.textContent = course.code || 'TBD';
        if (this.modalCredits) this.modalCredits.textContent = `${course.credits} Credits`;

        if (this.modalDescription) {
            let desc = course.description || 'No description available.';
            if (desc.startsWith('- ')) desc = desc.substring(2);
            this.modalDescription.textContent = desc;
        }

        // Required badge
        const data = this.currentPathway ? this.pathwayData[this.currentPathway] : null;
        const requiredCourses = data ? (data.required_courses || []) : [];
        const isRequired = requiredCourses.includes(course.code);
        if (this.modalRequired) {
            this.modalRequired.style.display = isRequired ? 'inline-block' : 'none';
        }

        this.modal.classList.add('visible');
        document.body.classList.add('modal-open');

        // Move focus into modal
        if (this.modalClose) {
            this.modalClose.focus();
        }
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('visible');
        document.body.classList.remove('modal-open');

        // Return focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }

    trapFocus(e) {
        const modalContent = this.modal.querySelector('.modal-content');
        if (!modalContent) return;

        const focusable = modalContent.querySelectorAll(
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

    // -- Mobile sidebar --

    toggleSidebar() {
        if (!this.sidebar) return;
        const isOpen = this.sidebar.classList.toggle('mobile-open');
        document.body.classList.toggle('sidebar-open', isOpen);
        if (this.sidebarToggle) {
            this.sidebarToggle.setAttribute('aria-expanded', isOpen);
        }
    }

    // -- UI helpers --

    showLoading() {
        if (!this.container) return;
        this.container.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'grid-placeholder';
        const h3 = document.createElement('h3');
        h3.textContent = 'Loading courses...';
        placeholder.appendChild(h3);
        this.container.appendChild(placeholder);
    }

    updateUI() {
        if (!this.container) return;
        this.container.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'grid-placeholder';
        const h3 = document.createElement('h3');
        h3.textContent = 'Select a pathway to view courses';
        const p = document.createElement('p');
        p.textContent = 'Choose from the sidebar to explore 4-year course structures';
        placeholder.appendChild(h3);
        placeholder.appendChild(p);
        this.container.appendChild(placeholder);
    }

    showError(message) {
        if (!this.container) return;
        this.container.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'grid-placeholder';
        const h3 = document.createElement('h3');
        h3.textContent = 'Unable to load courses';
        const p = document.createElement('p');
        p.textContent = message;
        placeholder.appendChild(h3);
        placeholder.appendChild(p);
        this.container.appendChild(placeholder);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PathwayViewer();
});
