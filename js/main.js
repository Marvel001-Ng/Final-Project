const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category-select");
const locationSelect = document.querySelector("#location-select");
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", function () {

    const searchValue = searchInput.value;
    const categoryValue = categorySelect.value;
    const locationValue = locationSelect.value;

    const searchData = {
        search: searchValue,
        category: categoryValue,
        location: locationValue
    };

    const searchParams = new URLSearchParams(searchData);

    window.location.href = `pages/search.html?${searchParams}`;


});