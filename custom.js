(
    function () {

        // --- Sidebar Plugin with definitive Mobile Fix ---
        function persistSidebar(hook, vm) {
            const storageKey = 'sidebar_collapse_state';

            function saveState() {
                const state = {};
                // Use a slight delay to ensure the DOM has updated before we read it.
                setTimeout(() => {
                    document.querySelectorAll('.sidebar-nav details').forEach((details) => {
                        const summary = details.querySelector('summary');
                        if (summary) {
                            state[summary.innerText] = details.hasAttribute('open');
                        }
                    });
                    sessionStorage.setItem(storageKey, JSON.stringify(state));
                }, 50); // A small delay is sufficient
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

            // Listen during the capture phase to intercept the click before Docsify does.
            document.addEventListener('click', function(event) {
                const summary = event.target.closest('.sidebar-nav summary');

                if (summary) {
                    // *** THE DEFINITIVE FIX ***
                    // 1. Stop the browser's default action and prevent the event from reaching other listeners.
                    event.preventDefault();
                    event.stopPropagation();

                    // 2. Manually replicate the default behavior: toggle the parent <details> element.
                    const details = summary.parentElement;
                    if (details.hasAttribute('open')) {
                        details.removeAttribute('open');
                    } else {
                        details.setAttribute('open', '');
                    }

                    // 3. Save the new state.
                    saveState();
                }
            }, true); // `true` for capture phase is critical here.
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
            persistSidebar,      // Now includes the definitive mobile fix
            customScrollPlugin,
            highlightActiveItems
        );

    })();
