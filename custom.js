if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Plugin to persist sidebar collapse state
function persistSidebar(hook, vm) {
    const storageKey = 'sidebar_collapse_state';

    function saveState() {
        const state = {};
        document.querySelectorAll('.sidebar-nav details').forEach((details) => {
            const summary = details.querySelector('summary');
            if (summary) {
                state[summary.innerText] = details.hasAttribute('open');
            }
        });
        sessionStorage.setItem(storageKey, JSON.stringify(state));
    }

    function restoreState() {
        const savedState = JSON.parse(sessionStorage.getItem(storageKey));
        if (savedState) {
            document.querySelectorAll('.sidebar-nav details').forEach(details => {
                const summary = details.querySelector('summary');
                if (summary && savedState[summary.innerText] !== undefined) {
                    if (savedState[summary.innerText]) {
                        details.setAttribute('open', '');
                    } else {
                        details.removeAttribute('open');
                    }
                }
            });
        }
    }

    hook.doneEach(() => {
        restoreState();
    });

    document.addEventListener('click', function(event) {
        const sidebarNav = event.target.closest('.sidebar-nav');
        if (sidebarNav && event.target.tagName === 'SUMMARY') {
            event.stopPropagation();
            setTimeout(saveState, 100);
        }
    }, true);
}

// Plugin for smooth scrolling the "Get Started" button
function customScrollPlugin(hook, vm) {
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.cover-main a.button[href="#/README"]')) {
            e.preventDefault();
            const mainContent = document.getElementById('main');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// --- THE FINAL, CORRECTED PLUGIN ---
// This single, clean plugin correctly highlights the active link's PARENT section
// AND correctly adds the .active class to the "About" link.
function highlightActiveItems(hook, vm) {
    hook.doneEach(function() {
        // ---- Handle Parent Section Highlighting ----
        // First, reset the state by removing our custom class from all sections
        document.querySelectorAll('.sidebar-nav details.active-section').forEach((el) => {
            el.classList.remove('active-section');
        });

        // Find the currently active link's list item (<li>), which Docsify marks with .active
        const activeListItem = document.querySelector('.sidebar-nav li.active');

        if (activeListItem) {
            // Find the closest parent <details> tag (the collapsible section)
            const parentDetails = activeListItem.closest('details');

            if (parentDetails) {
                // Add our custom class to the parent section.
                // The CSS in `custom.css` will then style the summary.
                parentDetails.classList.add('active-section');
            }
        }

        // ---- Handle "About" Link Highlighting ----
        const aboutLi = document.querySelector('.sidebar-nav > ul > li:first-child');
        if (aboutLi) {
            // This now correctly adds the .active class, which matches the CSS.
            if (vm.route.path === '/' || vm.route.path === '/README.md') {
                aboutLi.classList.add('active');
            } else {
                aboutLi.classList.remove('active');
            }
        }
    });
}


// Add all plugins to Docsify's plugin array
window.$docsify.plugins = [].concat(
    window.$docsify.plugins || [],
    persistSidebar,
    customScrollPlugin,
    highlightActiveItems
);
