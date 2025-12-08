// file to load header and footer from the components/ folder

async function loadPartial(id, file) {
    // get element
    const element = document.getElementById(id);

    // return if it doesn't exist
    if (!element) return;
    
    // fetch from components directory
    const response = await fetch(`components/${file}`);
    const html = await response.text();

    // add header/footer html
    element.innerHTML = html;

}

// call function for both header and footer
// loadPartial('header', 'header.html');
// loadPartial('footer', 'footer.html');