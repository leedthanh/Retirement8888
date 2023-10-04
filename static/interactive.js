
const htown_map = L.map('map-id').setView([29.749907, -95.358421], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(htown_map);

const uniqueStates = [];

fetch('https://leedthanh.github.io/api/all_nursing_homes.geojson') // Updated fetch URL
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            const state = feature.properties["Provider State"];
            if (!uniqueStates.includes(state)) {
                uniqueStates.push(state);
            }
            console.log(data); // for debug
        });

        // create state filter ID  and do a loop for unique state
        const stateFilter = document.getElementById('state-filter');
        uniqueStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });

        // add statefilter event when user selects state and also rating
        stateFilter.addEventListener('change', function () {
            const stateSelected = this.value; // getting select state from user
            const ratingSelected = document.getElementById('rating-filter').value; // rating filter
            updateMap(stateSelected, ratingSelected);
        });

        // add event for rating filter also holding select state
        const ratingFilter = document.getElementById('rating-filter');
        ratingFilter.addEventListener('change', function () {
            const selectedState = document.getElementById('state-filter').value; // get selected state from dropdown
            const selectRating = this.value; // get the rating
            updateMap(selectedState, selectRating);
        });

        updateMap("", "");
    });

// function to update map based on states and rating
function updateMap(selectedState, selectRating) {
    htown_map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            htown_map.removeLayer(layer);
        }
    });

    // getting state name and rating make sure it matches selected state and rating
    fetch('https://leedthanh.github.io/api/all_nursing_homes.geojson') // Updated fetch URL
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                filter: function (feature) {
                    const providerState = feature.properties["Provider State"];
                    const overallRating = parseFloat(feature.properties["Overall Rating"]);
                    // checking both state and rating filters
                    const stateMatch = selectedState === "" || providerState === selectedState;
                    const rateMatch = selectRating === "" || overallRating === parseFloat(selectRating);

                    return stateMatch && rateMatch;
                },
                onEachFeature: function (feature, layer) {
                    const popupContent = `
                        <b>Provider Name:</b> ${feature.properties["Provider Name"]}<br>
                        <b>Phone Number:</b> ${feature.properties["Provider Phone Number"]}<br>
                        <b>Rating:</b> ${feature.properties["Overall Rating"]}<br>
                        <b>Location:</b> ${feature.properties["Location"]}
                    `; // last step get bindpopup for location rating and provider name
                    layer.bindPopup(popupContent);
                }
            }).addTo(htown_map);
        });
}

