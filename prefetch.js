console.log("prefetch enabled");

const links = document.querySelectorAll('.prefetch');

links.forEach(anchor => {
  const href = anchor.getAttribute('href');

  if (href && !href.startsWith("mailto") && !href.startsWith("http")) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'prefetch';
    linkElement.href = href;

    document.head.appendChild(linkElement);
  }
});
