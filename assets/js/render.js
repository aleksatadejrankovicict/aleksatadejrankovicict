
ajaxCallBack("assets/data/nav.json", "json", "get", function(data)
{
	renderNav(data);
});

function renderNav(data)
{
	let navDiv = getById("nav_div");

	let write = ``;

	for(let i = 0; i < data.length; i++)
	{
		write += `<li class="nav-item"><a class="nav-link" href="`+data[i].href+`">`+data[i].name+`</a>`;
	}

	navDiv.innerHTML = write;
}

function renderStoreFilter(data)
{
	let genres = data[0];	
	let publishers = data[1];
	let categories = data[2];

	genres.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
	publishers.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
	
	let genreSelect = getById("genre_select");
	let publisherSelect = getById("publisher_select");
	let categoryChecks = getById("category_checks");

	for(let i = 0; i < genres.length; i++)
	{
		genreSelect.innerHTML += `<option value="`+genres[i].id+`">`+genres[i].name+`</option>`;
	}
	
	for(let i = 0; i < publishers.length; i++)
	{
		publisherSelect.innerHTML += `<option value="`+publishers[i].id+`">`+publishers[i].name+`</option>`;
	}
	
	for(let i = 0; i < categories.length; i++)
	{
		categoryChecks.innerHTML += `<div class="form-check"><input class="form-check-input" type="radio" name="categories_radio" 
										value="" id="`+categories[i].id+`">
									 <label class="form-check-label" for="`+categories[i].id+`">`+categories[i].name+`</label></div>`;
	}
}

let currentPage = 1;

function renderPagination(length)
{
	let itemsPerPage = parseInt(sessionStorage.getItem("itemsPerPage"), 10) || 20;

	let storePagination = getById("store_pagination");
	storePagination.innerHTML = "";

	let last = 	Math.ceil(length / itemsPerPage);

	sessionStorage.setItem("lastPage", last);

	let prev = `<li class="page-item"><a class="page-link" href="?view=store">First</a></li>
				<li class="page-item"><a class="page-link" href="?view=store&page=`+(currentPage - 1)+`">Previous</a></li>`;
	let next = `<li class="page-item"><a class="page-link" href="?view=store&page=`+(currentPage + 1)+`">Next</a></li>
				<li class="page-item"><a class="page-link" href="?view=store&page=`+last+`">Last</a></li>`;

	let start = -1;
	let end = 2;

	if(currentPage == 1)
	{
		start = 0;
		end = 3;
		prev = "";	
	}	

	if(currentPage == last)
	{
		end = 1;
		next = "";
	}	

	storePagination.innerHTML += prev;	
	
	for(let i = start; i < end; i++)
	{
		let crr = currentPage + i;

		if(crr == currentPage)
		{
			storePagination.innerHTML += 
			`<li class="page-item active"><a class="page-link" href="?view=store&page=`+crr+`">`+crr+`</a></li>`;
		}
		else
			storePagination.innerHTML += 
			`<li class="page-item"><a class="page-link" href="?view=store&page=`+crr+`">`+crr+`</a></li>`;
	}

	storePagination.innerHTML += next;
}

function renderStoreBooks(data)
{
	comics = [...originalComics];
	let authors = data[4];
	let genres = data[0];
	currentPage = getCurrentStorePage();
	let itemsPerPage = parseInt(sessionStorage.getItem("itemsPerPage"));

	let start = (currentPage - 1) * itemsPerPage;
	let end = start + itemsPerPage;

	let sortBooks = sessionStorage.getItem("sortBooks");
	let filterBooks = sessionStorage.getItem("filterBooks");

	if(filterBooks)
	{
		comics = applyStoreFilters(comics, filterBooks);
	}

	if(sortBooks != "")
	{
		applyStoreSort(comics, sortBooks);
	}

	let books = comics.slice(start, end);

	let booksHolder = getById("books_holder");
	booksHolder.innerHTML = "";

	if(books.length <= 0)
	{
		booksHolder.innerHTML = `<div style="width: 356px;" class="w-fit mx-auto d-inline-block alert alert-info">There are no books that match these criteria.</div>`;
		return;
	}

	for(let i = 0; i < books.length; i++)
	{
		let fullTitle = books[i].title;
		let bookTitleParts = books[i].title.includes(":") ? books[i].title.split(":") : books[i].title;
		let subtitle = "";		
		let genre = genres.find(g => g.id == books[i].genre_ids[0])?.name;
		let author = authors.find(a => a.id == books[i].author_ids[0])?.name;

		if(fullTitle.includes(":"))
		{
			fullTitle = bookTitleParts[0];
			subtitle = bookTitleParts[1];
		}

		let newPrice = 0;
		let pricePart = "";
		let price = books[i].price;
		price = price.toFixed(2);	

		if(books[i].discount_percent != 0)
		{
			newPrice = price * (1 - books[i].discount_percent / 100);
			newPrice = newPrice.toFixed(2);
			
			pricePart += `<p class="border_right">-${books[i].discount_percent}%</p>
						  <div class="original_price">
							<p>${newPrice}&euro;</p>
						  	<span>${price}&euro;</span>
						  </div>`;
		}
		else
		{
			newPrice = books[i].price;
			newPrice = newPrice.toFixed(2);
			pricePart += `<p>${price}&euro;</p>`;
		}

		booksHolder.innerHTML += `
						<div class="col">
							<div class="book_card card h-100">
								<img loading="lazy" src="${books[i].cover_url}" class="card-img-top">
								<div class="card-body">
									<h6 class="card-text book_title">${fullTitle}</h6>
									<p class="book_subtitle">${subtitle}</p>										
									<p class="book_genre">Genre: ${genre}</p>
									<p class="book_author">Author: ${author}</p>
								</div>
								<div class="price_holder d-flex">
									${pricePart}
								</div>
								<div class="card_overlay">
									<div class="price_holder price_holder_hover d-flex">
										${pricePart}
									</div>
									<div class="book_button_holder">
										<button class="btn btn-secondary">View Book</button>
									</div>
									<div class="book_button_holder">
										<button class="btn btn-secondary">
											<i class="bi bi-cart"></i> Add to cart
										</button>
									</div>
								</div>
							</div>
						</div>`;
	}

	let storePagination = getById("store_pagination");
	storePagination.innerHTML = "";

	if(itemsPerPage < comics.length)
	{
		renderPagination(comics.length);
	}
}

let originalComics = [];

function renderStore(data)
{
	originalComics = [...data[3]];

	renderStoreFilter(data);
	renderStoreBooks(data);
	doStoreLogic();

	dataRem = data;
	
	$("#books_sort").on("click", ".dropdown-item", function()
	{
		let value = $(this).text();
		sessionStorage.setItem("sortBooks", value);

		renderStoreBooks(dataRem);
	});

	$("#apply_filter_button").on("click", function()
	{
		let genre = parseInt(getById("genre_select").value);
		let publisher = parseInt(getById("publisher_select").value);
		let category = document.querySelector('input[name="categories_radio"]:checked')?.id;

		let priceInputs = document.querySelectorAll("#price_filter input");

		let priceMin = parseFloat(priceInputs[0].value) || 0;
		let priceMax = parseFloat(priceInputs[1].value) || Infinity;

		let filters = [genre, publisher, category, priceMin, priceMax];
		sessionStorage.setItem("filterBooks", JSON.stringify(filters));

		renderStoreBooks(dataRem);
	});
}
