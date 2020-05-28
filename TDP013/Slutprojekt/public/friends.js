var app = new Vue({
	el: '#app',
	data: {
		username : "undefined",
		filteredFriends : [],
		unfilteredFriends : []
	}
});

window.onload = function()
{
	// If not logged in, redirect to login.
	if(getCookie("userID") == "")
	{
		// Redirect to login page
		window.location.replace("index.html");
	}
	else
	{
		// Who am i
		var xhttp = new XMLHttpRequest();
		var userID = getCookie("userID");
		xhttp.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				var me = JSON.parse(this.responseText);
				app.username = me.username;
			}
			else if(this.readyState == 4)
			{
				alert("You do not exist");
			}
		}
		// Remove quotes around userID, unsure why it saves that way.
		var params = "userID=" + userID.slice(1, -1);
		xhttp.open("GET", "http://localhost:3000/getUser?"+params, true);
		xhttp.send();

		setupVisuals();
	}

	// Makes enter not work on the filter form
	document.getElementById("filterForm").addEventListener("submit", function(event){
		event.preventDefault();
	});
}

function setupVisuals()
{
	// Get list of all users
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			var users = JSON.parse(this.responseText);
			for(var i = 0; i < users.length; i++)
			{
				app.unfilteredFriends.push(users[i]);
				app.filteredFriends.push(users[i]);
			}
		}
		else if(this.readyState == 4)
		{
			alert("Wrong username or password");
		}
	}

	xhttp.open("GET", "http://localhost:3000/getAllUsernames", true); // bool = to use async or not
	xhttp.send();
}

function filterFriends()
{
	var filter = document.getElementById("filter").value.toLowerCase();
	if(filter == "")
	{
		app.filteredFriends = app.unfilteredFriends;
	}
	else
	{
		app.filteredFriends = [];
		for(var i = 0; i < app.unfilteredFriends.length; i++)
		{
			if(app.unfilteredFriends[i].toLowerCase().includes(filter))
			{
				app.filteredFriends.push(app.unfilteredFriends[i]);
			}
		}
	}
}

function addFriend(e)
{
	var sender = (e.srcElement||e.target);
	var friendName = sender.dataset.friend;
	var userID = getCookie("userID");

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			alert(xhttp.responseText)
			//alert("Friend added!")
		}
		else if(this.readyState == 4)
		{
			alert("Bad userID, this shouldn't happen");
		}
	}

	// Remove quotes around userID, unsure why it saves that way.
	var params = "userID=" + userID.slice(1, -1) + "&friendName=" + friendName;
	xhttp.open("GET", "http://localhost:3000/addFriend?"+params, true); // bool = to use async or not
	xhttp.send();
}

function logOut()
{
	// Reset cookie
	setCookie("userID", "");
	// Redirect to login page
	window.location.replace("index.html");
}
