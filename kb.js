document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey) return;

  switch (e.key) {
    case 'Escape':
      // go home
      window.location.pathname = "/";
      break;
    case 'j':
      window.scrollBy(0, 30);
      break;
    case 'k':
      window.scrollBy(0, -30);
      break;
    case 'h':
      window.scrollBy(-30, 0);
      break;
    case 'l':
      window.scrollBy(30, 0);
      break;
    case 'g':
      if (e.shiftKey) {
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        window.scrollTo(0, 0);
      }
      break;
  }
});
