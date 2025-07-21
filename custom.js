(
    function () {

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

            // Use event delegation on the sidebar for efficiency
            const sidebar = document.querySelector('.sidebar-nav');
            if (sidebar) {
                sidebar.addEventListener('click', function (event) {
                    if (event.target.tagName === 'SUMMARY') {
                        // No need for stopPropagation or setTimeout unless there are specific issues
                        saveState();
                    }
                });
            }
        }

        function customScrollPlugin(hook, vm) {
            // Use event delegation on the document body
            document.body.addEventListener('click', function (e) {
                const getStartedButton = e.target.closest('.cover-main a.button[href="#/README"]');
                if (getStartedButton) {
                    e.preventDefault();
                    const mainContent = document.getElementById('main');
                    if (mainContent) {
                        // Modern, smooth scroll behavior
                        mainContent.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }


        function highlightActiveItems(hook, vm) {
            hook.doneEach(function () {
                const activeListItem = document.querySelector('.sidebar-nav li.active');

                // Reset previous active section
                document.querySelectorAll('.sidebar-nav details.active-section').forEach((el) => {
                    el.classList.remove('active-section');
                });

                if (activeListItem) {
                    const parentDetails = activeListItem.closest('details');
                    if (parentDetails) {
                        parentDetails.classList.add('active-section');
                    }
                }

                // Handle the main "About" link
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
            persistSidebar,
            customScrollPlugin,
            highlightActiveItems
        );

    })();
