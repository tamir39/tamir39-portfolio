// Prepare the first paint only for a fresh homepage visit. The timeout keeps the
// server-rendered page usable if hydration never completes.
export const pageIntroInitScript = `(function(){var r=document.documentElement;if(location.pathname!=='/'||location.hash)return;r.dataset.pageIntro='loading';window.setTimeout(function(){if(r.dataset.pageIntro==='loading')r.dataset.pageIntro='complete';},18000);})();`;
