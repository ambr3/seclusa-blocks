import { boot } from './game.js';

function sameWorker(scriptURL) {
    try {
        const got = new URL(scriptURL);
        const own = new URL('./sw.js', window.location.href);
        return got.origin === own.origin && got.pathname === own.pathname;
    } catch (_) {
        return false;
    }
}

boot();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const ctrl = navigator.serviceWorker.controller;
        const hadOwnController = !!(ctrl && sameWorker(ctrl.scriptURL));
        navigator.serviceWorker.register('./sw.js').then((reg) => {
            if (reg) reg.update().catch(() => {});
        }).catch(() => {});
        if (hadOwnController) {
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });
        }
    });
}
