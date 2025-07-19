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
        if (event.target.tagName === 'SUMMARY') {
            setTimeout(saveState, 100);
        }
    });
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

// Add both plugins to Docsify's plugin array
window.$docsify.plugins = [].concat(
    window.$docsify.plugins || [],
    persistSidebar,
    customScrollPlugin
);
