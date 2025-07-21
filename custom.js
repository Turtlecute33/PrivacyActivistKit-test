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

    // Add a more intelligent click handler
    document.addEventListener('click', function(event) {
        const sidebarNav = event.target.closest('.sidebar-nav');
        // Check if the click is inside the sidebar
        if (sidebarNav) {
            // Check if the click was specifically on a SUMMARY tag (the expand/collapse button)
            if (event.target.tagName === 'SUMMARY') {
                // Stop the click from bubbling up and triggering Docsify's sidebar close behavior
                event.stopPropagation();
                // Save the open/close state after a tiny delay to ensure the UI has updated
                setTimeout(saveState, 100);
            }
            // For any other click inside the sidebar (e.g., on an <a> link),
            // we do nothing, allowing the event to bubble up and let Docsify close the sidebar as intended.
        }
    }, true); // Use capture phase to catch the event early
}

// --- SIMPLIFIED SCROLL PLUGIN ---
function customScrollPlugin(hook, vm) {
    document.body.addEventListener('click', function(e) {
        const target = e.target;

        // This plugin now ONLY handles the special case for the "Get Started" button.
        // We let Docsify and the browser handle all other navigation links,
        // including the top-left title, to ensure you always go to the correct page.

        if (target.matches('.cover-main a.button[href="#/README"]')) {
            // Prevent the default link click
            e.preventDefault();
            // Find the main content area
            const mainContent = document.getElementById('main');
            // Scroll it into view smoothly
            if (mainContent) {
                mainContent.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Plugin to highlight the active section in the sidebar
function highlightActiveSection(hook, vm) {
    hook.doneEach(function() {
        // First, remove the active-section class from all details elements
        document.querySelectorAll('.sidebar-nav details').forEach(details => {
            details.classList.remove('active-section');
        });

        // Find the active link
        const activeLink = document.querySelector('.sidebar-nav .active');
        if (activeLink) {
            // Find the closest parent 'details' element
            const parentDetails = activeLink.closest('details');
            if (parentDetails) {
                // Add the class to the parent 'details' element
                parentDetails.classList.add('active-section');
            }
        }
    });
}

// Add both plugins to Docsify's plugin array
window.$docsify.plugins = [].concat(
    window.$docsify.plugins || [],
    persistSidebar,
    customScrollPlugin,
    highlightActiveSection
);

