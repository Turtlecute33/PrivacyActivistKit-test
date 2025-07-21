(
    function () {

        // --- Sidebar Plugin with Correct, Targeted Event Handling ---
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

            // This hook runs after Docsify has finished rendering the page.
            hook.doneEach(() => {
                const sidebarNav = document.querySelector('.sidebar-nav');

                // Restore the state first.
                restoreState();

                // Attach a single, specific event listener to the sidebar navigation.
                // This is more efficient and reliable than a general document listener.
                if (sidebarNav && !sidebarNav.hasAttribute('data-listener-added')) {
                    sidebarNav.addEventListener('click', function(event) {
                        // Check if the click was on a SUMMARY tag (expandable section).
                        const summary = event.target.closest('summary');
                        if (summary) {
                            // **THE RELIABLE FIX**
                            // Stop this specific click from bubbling up to Docsify's general click handlers.
                            event.stopPropagation();
                            
                            // Save the state after a very brief delay to allow the 'open' attribute to update.
                            setTimeout(saveState, 100);
                        }
                    });
                    // Mark the element so we don't add the listener more than once.
                    sidebarNav.setAttribute('data-listener-added', 'true');
                }
                // Original scroll to top functionality
                window.scrollTo(0, 0);
            });
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
                    aboutLi.classList.toggle('active', vm.route.path === '/' || vm.route.path === '/README.md');
                }
            });
        }

        // Register all plugins with Docsify
        window.$docsify = window.$docsify || {};
        window.$docsify.plugins = [].concat(
            window.$docsify.plugins || [],
            persistSidebar,      // Now with the correct, targeted fix
            customScrollPlugin,
            highlightActiveItems
        );

    })();
