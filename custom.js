(
    function () {

        // --- Sidebar Plugin with Mobile Fix ---
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
                window.scrollTo(0, 0);
            });

            // The original, broader event listener is necessary for state to be saved correctly.
            document.addEventListener('click', function(event) {
                const sidebarNav = event.target.closest('.sidebar-nav');
                if (sidebarNav && event.target.tagName === 'SUMMARY') {
                    // *** THIS IS THE FIX ***
                    // Prevents the click from bubbling up and closing the mobile sidebar.
                    event.stopPropagation();

                    // Using a short timeout ensures the 'open' attribute has been updated before we save the state.
                    setTimeout(saveState, 100);
                }
            }, true);
        }

        // --- Optimized Scroll Plugin (No Changes Needed) ---
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

        // --- Optimized Active Link Highlighter (No Changes Needed) ---
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
                    if (vm.route.path === '/' || vm.route.path === '/README.md') {
                        aboutLi.classList.add('active');
                    } else {
                        aboutLi.classList.remove('active');
                    }
                }
            });
        }

        // Register all plugins with Docsify
        window.$docsify = window.$docsify || {};
        window.$docsify.plugins = [].concat(
            window.$docsify.plugins || [],
            persistSidebar,      // Now includes the mobile fix
            customScrollPlugin,
            highlightActiveItems
        );

    })();
