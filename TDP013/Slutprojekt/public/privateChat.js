var url_string = window.location.href
var url = new URL(url_string);
var friend = url.searchParams.get("friendName");
var userID = getCookie("userID");
userID = userID.slice(1, -1)
var params = "userID=" + userID;
console.log("userID: " + userID);
console.log("friend: " + friend);

var app = new Vue({
	el: '#app',
	data: {
		username : "",
        friendname : friend,
        status : "offline"
	}
});

// Connect to chat
var socket = io.connect("http://localhost:3000/", { query: { userID: userID, friendName: friend } });

socket.on('message:private:recieve', function(msg){
    var chatBox = document.getElementById("chat");
    chatBox.innerHTML += (friend + ": " + msg + "<br/>");
    console.log("Recieved DM");
});

socket.on('status', function(status){
    console.log("Status: " + status);
    app.status = status;
    if (status == "offline")
    {
        var msgBox = document.getElementById("messageInput");
        var label = msgBox.labels[0];
        label.innerHTML = "Friend offline";
    }
    else if (status == "online")
    {
        var msgBox = document.getElementById("messageInput");
        var label = msgBox.labels[0];
        label.innerHTML = "Chat!";
    }
});

function sendMessage()
{
	var msgBox = document.getElementById("messageInput");
	if(msgBox.value != "" && app.status == "online")
	{
		var msg = msgBox.value;
		socket.emit('message:private:send', msg);
		msgBox.value = "";
        var chatBox = document.getElementById("chat");
        chatBox.innerHTML += ("You: " + msg + "<br/>");
        console.log("Sent DM");
	}
    else {
        console.log("DM failed to send");
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
				var r = JSON.parse(this.responseText);
				app.username = r.username;
                //app.friendname = r.friendname;
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
