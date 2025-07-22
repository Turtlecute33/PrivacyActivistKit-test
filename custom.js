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
    try {
        const savedState = JSON.parse(sessionStorage.getItem(storageKey));
        if (savedState) {
            document.querySelectorAll('.sidebar-nav details').forEach(details => {
                const summary = details.querySelector('summary');
                if (summary && savedState[summary.innerText] !== undefined) {
                    details.toggleAttribute('open', savedState[summary.innerText]);
                }
            });
        }
    } catch (error) {
        console.warn('Could not restore sidebar state:', error);
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
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                setTimeout(saveState, 50); // Reduced timeout
            });
        }
    }, { passive: false }); // Add passive option for better performance
    
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

// Improved hamburger menu handler with better timing
function initializeSidebarToggle() {
    var sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (sidebarToggle && !sidebarToggle.hasAttribute('data-initialized')) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var body = document.body;
            body.classList.toggle('close');
            sidebarToggle.classList.toggle('open');
        });
        
        // Set initial state
        if (!document.body.classList.contains('close')) {
            sidebarToggle.classList.add('open');
        }
        
        sidebarToggle.setAttribute('data-initialized', 'true');
    }
}

// Try to initialize immediately and also on DOM ready
initializeSidebarToggle();
document.addEventListener('DOMContentLoaded', initializeSidebarToggle);