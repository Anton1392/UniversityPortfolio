var app = new Vue({
	el: '#app',
	data: {
		username : "undefined",
		messageList : [],
		friendList : []
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
		// Get user data through AJAX
		var userID = getCookie("userID");

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				setUpVisuals(this.responseText);
			}
			else if(this.readyState == 4)
			{
				alert("Bad userID, this shouldn't happen");
			}
		}

		// Remove quotes around userID, unsure why it saves that way.
		var params = "userID=" + userID.slice(1, -1);

		xhttp.open("GET", "http://localhost:3000/getUser?"+params, true); // bool = to use async or not
		xhttp.send();
	}

	// Makes enter work on the message form
	document.getElementById("messageForm").addEventListener("submit", function(event){
		event.preventDefault();
		postMessage();
	});
}

function setUpVisuals(userJSON)
{
	var user = JSON.parse(userJSON);
	app.username = user.username;

	var msgs = user.messages;
	for(var i = 0; i < msgs.length; i++)
	{
		msg = msgs[i];
		// Get the user who posted the message.
		// Quite an ugly solution, but you need to translate userID to username somehow.
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				var msgUser = JSON.parse(this.responseText);
				app.messageList.push({message : msg.message, user : msgUser.username});
			}
			else if(this.readyState == 4)
			{
				alert("Wierd shit happened");
			}
		}

		// Remove quotes around userID, unsure why it saves that way.
		var params = "userID=" + msg.user;
		xhttp.open("GET", "http://localhost:3000/getUser?"+params, false); // bool = to use async or not
		xhttp.send();
	}

	app.friendList = user.friends;
}

function logOut()
{
	// Reset cookie
	setCookie("userID", "");
	// Redirect to login page
	window.location.replace("index.html");
}

function postMessage()
{
	var msg = document.getElementById("messageInput").value;
	if(msg == "")
	{
		return;
	}
	else if(msg.length > 140)
	{
		alert("Message too long (max 140 characters)");
		return;
	}

	var userID = getCookie("userID").slice(1, -1);
	var username = app.username;

	if(msg != undefined && msg != "")
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				document.getElementById("messageInput").value = "";
				app.messageList.push({message : msg, user : username});
			}
			else if(this.readyState == 4)
			{
				alert("Wierd shit happened");
			}
		}

		var params = "userID=" + userID + "&friendName=" + app.username + "&msg=" + msg;
		xhttp.open("GET", "http://localhost:3000/addMessage?"+params, true); // bool = to use async or not
		xhttp.send();
	}
	else
	{
		alert("No message written");
	}
}
