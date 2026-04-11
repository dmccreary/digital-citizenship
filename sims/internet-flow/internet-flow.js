// How a Video Gets to Your Tablet — Mermaid MicroSim
// CANVAS_HEIGHT: 380
//
// A horizontal (LR) Mermaid flowchart showing the path video data takes from
// a faraway computer to a Grade 5 student's tablet. Clicking any node updates
// the info box below the diagram with that node's plain-language description.
// No animations — this is a static labeled diagram with click-to-reveal info.

mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
    }
});

const nodeInfo = {
    'Computer': {
        title: 'Faraway Computer',
        body: 'A computer somewhere in the world that stores the video. It might be in another city, another state, or even another country.'
    },
    'Internet': {
        title: 'The Internet',
        body: 'A giant network of cables and signals that connects computers everywhere. The video travels through the internet to get closer to you.'
    },
    'Router': {
        title: 'Router',
        body: 'A small box in your home or school that sends out the wifi signal. The router takes the video off the internet and makes it ready for your wifi.'
    },
    'Wifi': {
        title: 'Wifi',
        body: 'An invisible signal that carries the video the last few feet from the router to your tablet. No cables needed!'
    },
    'Tablet': {
        title: 'Your Tablet',
        body: 'Where you actually see and hear the video. Your tablet turns the video data into pictures on the screen and sound from the speakers.'
    }
};

const infoTitle = document.getElementById('infoTitle');
const infoBody = document.getElementById('infoBody');

function showInfo(nodeKey) {
    const info = nodeInfo[nodeKey];
    if (!info) return;
    infoTitle.textContent = info.title;
    infoBody.textContent = info.body;
    infoBody.classList.remove('info-prompt');
}

function setupNodeClicks() {
    const nodes = document.querySelectorAll('.mermaid .node');
    if (nodes.length === 0) return false;

    nodes.forEach(node => {
        // Mermaid node ids look like "flowchart-Computer-1". Extract the middle part.
        const rawId = node.id || '';
        const match = rawId.match(/^flowchart-([^-]+)-/);
        const nodeKey = match ? match[1] : null;
        if (!nodeKey || !nodeInfo[nodeKey]) return;

        node.addEventListener('click', () => showInfo(nodeKey));
        // Keyboard accessibility
        node.setAttribute('tabindex', '0');
        node.setAttribute('role', 'button');
        node.setAttribute('aria-label', nodeInfo[nodeKey].title);
        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showInfo(nodeKey);
            }
        });
    });
    return true;
}

// Robust polling — wait for Mermaid to finish rendering before binding clicks.
function waitForMermaid() {
    const svg = document.querySelector('.mermaid svg');
    if (svg && document.querySelectorAll('.mermaid .node').length > 0) {
        setupNodeClicks();
    } else {
        setTimeout(waitForMermaid, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
