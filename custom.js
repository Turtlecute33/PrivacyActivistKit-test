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

document.addEventListener('DOMContentLoaded', function() {
    var sidebarToggle = document.querySelector('.sidebar-toggle');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            // This stops docsify's script from interfering.
            e.preventDefault();
            e.stopPropagation();

            var body = document.body;
            // Manually toggle the 'close' class on the body
            body.classList.toggle('close');
            
            // Also toggle an 'open' class on the button itself for CSS to use
            sidebarToggle.classList.toggle('open');
        });

        // Set initial state on load
        if (!document.body.classList.contains('close')) {
            sidebarToggle.classList.add('open');
        }
    }
});