let params = new URLSearchParams(window.location.search);
let page = params.get("view") || "home";

pageDiv = document.getElementById("page");

function getPage(page)
{
	ajaxCallBack("pages/"+page+".html", "text", "get", function(data)
		{
			pageDiv.innerHTML = data;
			doPageLogic(page);	
	});
}

if(page == "" || page == "/")
{
	getPage("home");
}
else
{
	getPage(page);
}

function doPageLogic(page)
{
	switch(page)
	{
		case "store":
		{
			if(sessionStorage.getItem("itemsPerPage") == null)
			{
				sessionStorage.setItem("itemsPerPage", 20);
			}
			let jsonFiles = ["genres.json", "publishers.json", "categories.json", "comics.json", "authors.json"];
			getJsonCallbackMore(jsonFiles, renderStore);
		}				
	}
}
