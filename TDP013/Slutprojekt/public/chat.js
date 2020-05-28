var socket = io.connect("http://localhost:3000/");

var app = new Vue({
	el: '#app',
	data: {
		username : "undefined",
	}
});

socket.on('new message', function(data){
	var chatBox = document.getElementById("chat");
	chatBox.innerHTML += (data.username + ": " + data.msg + "<br/>");
});

function sendMessage()
{
	var msgBox = document.getElementById("messageInput");
	if(msgBox.value != "")
	{
		var msg = {msg : msgBox.value, username : app.username};
		socket.emit('send message', msg);
		msgBox.value = "";
	}
}

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
	}

	// Makes enter properly submit the message
	document.getElementById("messageForm").addEventListener("submit", function(event){
		event.preventDefault();
		sendMessage();
	});
}

function logOut()
{
	// Reset cookie
	setCookie("userID", "");
	// Redirect to login page
	window.location.replace("index.html");
}
