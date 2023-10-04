//navigation.js

// Function to generate and insert the header content
function generateHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light fixed-top text-center" id="mainNav">
            <div class="container">
                <a class="navbar-brand" href="index.html">Retirement Homes Overview</a>
                <strong class="navbar-brand">|</strong>
                <a class="navbar-brand" href="homes.html">Retirement Homes In Maps</a>
            </div>
        </nav>
    `;
}

// Call the function to generate and insert the header
generateHeader();





