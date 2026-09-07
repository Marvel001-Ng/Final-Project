// const searchParams = new URLSearchParams(window.location.search);

// const searchValue = searchParams.get("search");
// const categoryValue = searchParams.get("category");
// const locationValue = searchParams.get("location");

// console.log(searchValue);
// console.log(categoryValue);
// console.log(locationValue);

// // Display search information

// const searchTitle = document.querySelector("#search-title");
// const searchInfo = document.querySelector("#search-info");

// searchTitle.textContent = `Search Results for: ${searchValue}`;

// searchInfo.textContent = `Category: ${categoryValue} | Location: ${locationValue}`;

// const attractions = [
//     {
//         name: "Okomu National Park",
//         category: "national-parks",
//         location: "okomu",
//         description: "A beautiful national park located in Edo State."
//     },

//     {
//         name: "Ogba Zoo",
//         category: "adventure",
//         location: "benin-city",
//         description: "A popular recreational and wildlife attraction in Benin City."
//     },

//     {
//         name: "Ososo Hills",
//         category: "hills",
//         location: "akoko-edo",
//         description: "A beautiful rocky and mountainous destination in Edo State."
//     },

//     {
//         name: "Edo National Museum",
//         category: "cultural-sites",
//         location: "benin-city",
//         description: "A historic destination known for traditional bronze casting."
//     }
// ];

// const matchingAttractions = attractions.filter(function (attraction) {

//     const matchesSearch =
//         attraction.name.toLowerCase().includes(searchValue.toLowerCase());

//     const matchesCategory =
//         !categoryValue || attraction.category === categoryValue;

//     const matchesLocation =
//         !locationValue || attraction.location === locationValue;

//     return matchesSearch && matchesCategory && matchesLocation;

// });
// const resultsContainer = document.querySelector(".results-container");

// matchingAttractions.forEach(function (attraction) {

//     const card = document.createElement("div");

//     card.classList.add("attraction-card");

//     card.innerHTML = `
//         <div class="attraction-info">

//             <h2>${attraction.name}</h2>

//             <p>${attraction.description}</p>

//             <p>Edo State, Nigeria</p>

//             <a href="#">View Details</a>

//         </div>
//     `;

//     resultsContainer.appendChild(card);

// });
const searchParams = new URLSearchParams(window.location.search);

const searchValue = searchParams.get("search");
const categoryValue = searchParams.get("category");
const locationValue = searchParams.get("location");

console.log(searchValue);
console.log(categoryValue);
console.log(locationValue);


// Display search information

const searchTitle = document.querySelector("#search-title");
const searchInfo = document.querySelector("#search-info");

searchTitle.textContent = `Search Results for: ${searchValue}`;

searchInfo.textContent =
    `Category: ${categoryValue} | Location: ${locationValue}`;


// Attractions data

const attractions = [

    {
        name: "Okomu National Park",
        category: "national-parks",
        location: "okomu",
        description: "A beautiful national park located in Edo State.",
        image: "../asset/images/okomu-national-park/okomu-images 2.jpg"
    },

    {
        name: "Ogba Zoo",
        category: "adventure",
        location: "benin-city",
        description: "A popular recreational and wildlife destination in Benin City.",
        image: "../asset/images/ogba zoo/ogba zoo-images-1.jpg"
    },

    {
        name: "Ososo Hills",
        category: "hills",
        location: "akoko-edo",
        description: "A beautiful rocky and mountainous destination in Edo State.",
        image: "../asset/images/ososo Hills/ososo hills-images-3.jpg"
    },

    {
        name: "Edo National Museum",
        category: "historical-sites",
        location: "benin-city",
        description: "A museum showcasing important cultural and historical heritage from Edo State.",
        image: "../asset/images/Edo National Museum/entrance-with-wall-mural.jpg"
    }

];


// Find matching attractions

const matchingAttractions = attractions.filter(function (attraction) {

    const matchesSearch =
        !searchValue ||
        attraction.name.toLowerCase().includes(searchValue.toLowerCase());

    const matchesCategory =
        !categoryValue ||
        attraction.category === categoryValue;

    const matchesLocation =
        !locationValue ||
        attraction.location === locationValue;

    return matchesSearch && matchesCategory && matchesLocation;

});


// Results container

const resultsContainer =
    document.querySelector(".results-container");

resultsContainer.innerHTML = "";


// Display results

matchingAttractions.forEach(function (attraction) {

    const card = document.createElement("div");

    card.classList.add("attraction-card");

    card.innerHTML = `
        <img src="${attraction.image}" alt="${attraction.name}">

        <div class="attraction-info">

            <h2>${attraction.name}</h2>

            <p>${attraction.description}</p>

            <p>Edo State, Nigeria</p>

            <a href="#">View Details</a>

        </div>
    `;

    resultsContainer.appendChild(card);

});


// No results

if (matchingAttractions.length === 0) {

    resultsContainer.innerHTML = `
        <p class="no-results">
            No attractions found. Try another search.
        </p>
    `;

}