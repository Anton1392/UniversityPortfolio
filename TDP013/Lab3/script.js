window.onload = function()
{
	reloadElements();
}

function flagMessage(id)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState = 4 && this.status == 200)
		{
			reloadElements();
		}
	}

	var params = "id=" + id;

	xhttp.open("GET", "http://localhost:3000/flag?"+params, true); // bool = to use async or not
	xhttp.send(params);
}

function addMessage(msg)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState = 4 && this.status == 200)
		{
			reloadElements();
		}
	}

	var params = "msg=" + msg;

	xhttp.open("GET", "http://localhost:3000/save?"+params, true); // bool = to use async or not
	xhttp.send(params);
}

function reloadElements()
{
	// Do a getall and construct html elements
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState = 4 && this.status == 200)
		{
			var response = this.responseText;
			response = JSON.parse(response); // JSON
			
			// Async call done, nuke and reconstruct visuals.
			// Remove feed children
			var feed = document.getElementById("feed");
			while(feed.hasChildNodes())
			{
				feed.removeChild(feed.lastChild);
			}

			for(var i = 0; i < response.length; i++)
			{
				msg = response[i];

				var messageWrapper = document.createElement("div");
				messageWrapper.setAttribute("class", "messageWrapper");

				var messageBox = document.createElement("div");
				if(msg.flag)
				{
					messageBox.setAttribute("class", "read message");
				}
				else
				{
					messageBox.setAttribute("class", "unread message");
				}
				messageBox.setAttribute("data-id", msg._id);;
				messageBox.appendChild(document.createTextNode(msg.message));
				messageWrapper.appendChild(messageBox);

				if(!msg.flag)
				{
					var readButton = document.createElement("button");
					readButton.setAttribute("data-id", msg._id);;
					readButton.type="button"
					readButton.innerHTML = "&#128065;";
					readButton.setAttribute("class", "readButton");
					messageWrapper.appendChild(readButton);

					readButton.onclick = function(){
						flagMessage(this.getAttribute("data-id"));
					};
				}

				var feed = document.getElementById("feed");
				feed.insertBefore(messageWrapper, feed.firstChild);
			}
		}
	}

	xhttp.open("GET", "http://localhost:3000/getall", true); // bool = to use async or not
	xhttp.send();
}

function Submit()
{
	txtBox = document.getElementById("textIn");
	txt = txtBox.value;

	if(txt.length == 0 || txt.length > 140)
	{
		// Make error visible
		errorBox = document.getElementById("errorBox");
		errorBox.hidden = false;
		if(txt.length == 0)
		{
			errorBox.innerHTML = "ERROR: No message";
		}
		else
		{
			errorBox.innerHTML = "ERROR: Message too long (>140 char)";
		}

		return;
	}
	else
	{
		// Make error invisible
		errorBox.innerHTML = "";
	}

	txtBox.value = "";

	addMessage(txt);
}
