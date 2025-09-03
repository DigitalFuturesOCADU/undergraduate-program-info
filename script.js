// Simple JS for expand/collapse functionality

function toggleSection(sectionId) {
    const content = document.querySelector(`#${sectionId} .content`);
    const icon = document.querySelector(`#${sectionId} .toggle-icon`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.textContent = '-';
    } else {
        content.classList.add('hidden');
        icon.textContent = '+';
    }
}
