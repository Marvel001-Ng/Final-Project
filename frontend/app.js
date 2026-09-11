document.addEventListener("DOMContentLoaded", () => {
	const searchForm = document.getElementById("main-search-form");
	const searchInput = document.getElementById("search-input");
	const categoryFilter = document.getElementById("category-filter");
	const locationFilter = document.getElementById("location-filter");
	const attractionCards = [...document.querySelectorAll(".homepage-attraction-card")];
	const emptyState = document.getElementById("homepage-search-empty");

	if (!searchForm || !searchInput || !categoryFilter || !locationFilter) return;

	function filterAttractions(event) {
		if (event) event.preventDefault();

		const keyword = searchInput.value.trim().toLowerCase();
		const category = categoryFilter.value;
		const location = locationFilter.value;
		let visibleCount = 0;

		attractionCards.forEach((card) => {
			const cardText = card.textContent.toLowerCase();
			const matchesKeyword = !keyword || cardText.includes(keyword);
			const matchesCategory = !category || card.dataset.category === category;
			const matchesLocation = !location || card.dataset.location === location;
			const visible = matchesKeyword && matchesCategory && matchesLocation;

			card.hidden = !visible;
			if (visible) visibleCount += 1;
		});

		if (emptyState) emptyState.hidden = visibleCount !== 0;
		document.getElementById("attractions")?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	searchForm.addEventListener("submit", filterAttractions);
	categoryFilter.addEventListener("change", filterAttractions);
	locationFilter.addEventListener("change", filterAttractions);
});
