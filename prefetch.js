console.log("Prefetch enabled")

const links = document.querySelectorAll('a');

links.forEach(anchor => {
  const href = anchor.getAttribute('href');
  if (href) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'prefetch';
    linkElement.href = href;

    document.head.appendChild(linkElement);
  }
});
