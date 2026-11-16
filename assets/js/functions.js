
var dataRem = null;

function getByClass(element)
{
	return document.getElementsByClassName(element);
}

function getById(element)
{
	return document.getElementById(element);
}

function getCurrentStorePage()
{
	let params = new URLSearchParams(window.location.search);
	let page = parseInt(params.get("page"));
	
	if(page == null || Number.isNaN(page)) page = 1;

	return page;
}

function changePerPage(count)
{
    let currentItemsPerPage = parseInt(sessionStorage.getItem("itemsPerPage"));
    let currentPage = getCurrentStorePage();

    let newPage = Math.ceil((currentItemsPerPage * (currentPage - 1) + 1) / count);

    history.pushState(null, "", "/?view=store&page=" + newPage);

    sessionStorage.setItem("itemsPerPage", count);

	console.log(sessionStorage);

	renderStoreBooks(dataRem);
}

function getJsonCallbackMore(files, callback)
{
	let array = [];
	let completed = 0;

	for(let i = 0; i < files.length; i++)
	{
		ajaxCallBack("assets/data/"+files[i], "json", "GET", function(data)
		{
			array[i] = data;
			completed++;

			if(completed === files.length)
			{
				callback(array);
			}
		});
	}
}

function getJsonCallback(file, callback)
{
	ajaxCallBack("assets/data/"+file, "json", "GET", function(data)
	{
		callback(data);
	});
}

function ajaxCallBack(url, type, method, callback)
{
	$.ajax(
		{
			url: url,
			method: method,
			dataType: type,
			success: callback,
			error: function(jqxhr, exception)
			{
				var msg = "";
				switch(jqxhr.status)
				{
					case 404:
					{
						msg = "ERROR: 404\nPage(file) not found.";
					} break; 
					
					case 500:
					{
						msg = "ERROR: 500\nInternal server error.";
					} break;

					default:
					{
						msg = "ERROR: Unknown error.";
					}
				} 

				alert(msg);
				window.history.back();
			}
		});
}

function calculatePrice(discount, price)
{
	return price - (price * discount / 100);
}

function applyStoreFilters(data, filters)
{
	filters = JSON.parse(filters);
	let filteredComics = data;
	
	if(filters[0] != null)
	{
		filteredComics = filteredComics.filter(comic => comic.genre_ids.includes(filters[0]));
	}

	if(filters[1] != null)
	{
		filteredComics = filteredComics.filter(comic => comic.publisher_id == filters[1]);
	}

	if(filters[2] != null && filters[2] == "on-sale")
	{
		filteredComics = filteredComics.filter(comic => comic.discount_percent != 0);
	}
		
	if(filters[3] != 0)
	{
		filteredComics = filteredComics.filter(comic => calculatePrice(comic.discount_percent, comic.price) > filters[3]);
	}

	if(filters[4] != null)
	{
		filteredComics = filteredComics.filter(comic => calculatePrice(comic.discount_percent, comic.price) < filters[4]);
	}

	return filteredComics;
}

function applyStoreSort(data, sort)
{
	switch(sort)
	{
		case "Lower price first":
		{
			data.sort((a, b) => calculatePrice(a.discount_percent, a.price) - calculatePrice(b.discount_percent, b.price));
		} break;

		case "Higher price first":
		{
			data.sort((a, b) => calculatePrice(b.discount_percent, b.price) - calculatePrice(a.discount_percent, a.price));
		} break;

		case "Older first":
		{
			data.sort((a, b) => parseInt(a.publish_date.year) - parseInt(b.publish_date.year));
		} break;

		case "Newer first":
		{
			data.sort((a, b) => parseInt(b.publish_date.year) - parseInt(a.publish_date.year));
		} break;
	}
}
