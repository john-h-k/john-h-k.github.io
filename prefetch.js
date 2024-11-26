console.log("prefetch enabled");

const links = document.querySelectorAll('a');

links.forEach(anchor => {
  const href = anchor.getAttribute('href');
  if (href && !href.startsWith("mailto") && !href.startsWith("http")) {
    console.log(`prefetching '${href}'`);

    const linkElement = document.createElement('link');
    linkElement.rel = 'prefetch';
    linkElement.href = href;

    document.head.appendChild(linkElement);
  }
});
