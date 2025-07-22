
// --- Docsify Plugins from original user file ---
(function () {
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
                        details.toggleAttribute('open', savedState[summary.innerText]);
                    }
                });
            }
        }
        hook.doneEach(() => {
            const sidebarNav = document.querySelector('.sidebar-nav');
            restoreState();
            if (sidebarNav && !sidebarNav.hasAttribute('data-listener-added')) {
                sidebarNav.addEventListener('click', function(event) {
                    const summary = event.target.closest('summary');
                    if (summary) {
                        event.stopPropagation();
                        setTimeout(saveState, 100);
                    }
                });
                sidebarNav.setAttribute('data-listener-added', 'true');
            }
            window.scrollTo(0, 0);
        });
    }
    function customScrollPlugin(hook, vm) {
        document.body.addEventListener('click', function (e) {
            const getStartedButton = e.target.closest('.cover-main a.button[href="#/README"]');
            if (getStartedButton) {
                e.preventDefault();
                const mainContent = document.getElementById('main');
                if (mainContent) {
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    function highlightActiveItems(hook, vm) {
        hook.doneEach(function () {
            const activeListItem = document.querySelector('.sidebar-nav li.active');
            document.querySelectorAll('.sidebar-nav details.active-section').forEach((el) => {
                el.classList.remove('active-section');
            });
            if (activeListItem) {
                const parentDetails = activeListItem.closest('details');
                if (parentDetails) {
                    parentDetails.classList.add('active-section');
                }
            }
            const aboutLi = document.querySelector('.sidebar-nav > ul > li:first-child');
            if (aboutLi) {
                aboutLi.classList.toggle('active', vm.route.path === '/' || vm.route.path === '/README.md');
            }
        });
    }
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(
        window.$docsify.plugins || [],
        persistSidebar,
        customScrollPlugin,
        highlightActiveItems
    );
})();


// --- THE DEFINITIVE HAMBURGER FIX ---
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver((mutations, obs) => {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            // Disconnect the observer once the button is found to prevent memory leaks.
            obs.disconnect();

            // Check if the fix is already applied.
            if (sidebarToggle.hasAttribute('data-final-fix-applied')) {
                return;
            }
            sidebarToggle.setAttribute('data-final-fix-applied', 'true');

            const fixHamburgerStyles = () => {
                // This is the tactical delay. It waits for the theme's own scripts to finish.
                setTimeout(() => {
                    // Force the background color to be green, no matter what.
                    sidebarToggle.style.setProperty('background-color', '#42b983', 'important');

                    // Check the body class to determine the state and force the rotation.
                    if (document.body.classList.contains('close')) {
                        sidebarToggle.style.setProperty('transform', 'rotate(0deg)', 'important');
                    } else {
                        sidebarToggle.style.setProperty('transform', 'rotate(180deg)', 'important');
                    }
                }, 150); // A 150ms delay is the sweet spot.
            };

            // Attach our fixer directly to the click event.
            sidebarToggle.addEventListener('click', fixHamburgerStyles);

            // Also run the fixer once on page load to set the correct initial state.
            fixHamburgerStyles();
        }
    });

    // Start observing the document to find the hamburger button as soon as it's created.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
