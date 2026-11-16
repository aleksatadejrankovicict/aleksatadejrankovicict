
function resetStoreFilters()
{
    sessionStorage.setItem("filterBooks", "");

    getById("genre_select").value = "all_genres";
    getById("publisher_select").value = "all_publishers";

    document.querySelectorAll('input[name="categories_radio"]')
        .forEach(radio => radio.checked = false);

    let priceInputs = document.querySelectorAll("#price_filter input");

    priceInputs[0].value = "";
    priceInputs[1].value = "";

    currentPage = 1;
}

function doStoreLogic()
{
	let radios = document.querySelectorAll('input[name="categories_radio"]');
	let resetText = getById("reset_radio_categories");

	radios.forEach(radio =>
	{
		radio.addEventListener("change", function()
		{
			resetText.classList.remove("d-none");
		});
	});

	resetText.addEventListener("click", function()
	{
		radios.forEach(radio => radio.checked = false);
		resetText.classList.add("d-none");
	});

	$("#reset_sort_button").on("click", function()
	{
		sessionStorage.removeItem("sortBooks");
		renderStoreBooks(dataRem);
	});

	$("#reset_filter_button").on("click", function ()
	{
		resetStoreFilters();
		sessionStorage.setItem("fitlerBooks", "");
		renderStoreBooks(dataRem);
	});
}
