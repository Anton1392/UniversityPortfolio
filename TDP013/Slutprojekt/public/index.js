window.onload = function()
{
	updateOnlineStatus();
}

function updateOnlineStatus()
{
	var userID = getCookie("userID");
	if(userID != "")
	{
		document.getElementById("logInStatus").innerHTML = "Welcome: " + userID;
		// Redirect to profile page.
		window.location.replace("myProfile.html");
	}
	else
	{
		document.getElementById("logInStatus").innerHTML = "Please log in";
	}
}

function logIn()
{
	var username = document.getElementById("usr").value;
	var password = document.getElementById("pwd").value;

	if(username == "" || password == "")
	{
		alert("Please enter a username and password");
		return;
	}

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
				setCookie("userID", this.responseText);
				updateOnlineStatus();
		}
		else if(this.readyState == 4)
		{
				alert("Wrong username or password");
		}
	}

	var params = "username=" + username + "&password=" + password;

	xhttp.open("GET", "http://localhost:3000/authenticate?"+params, true); // bool = to use async or not
	xhttp.send();
}

function register()
{
	var username = document.getElementById("usrReg").value;
	var password = document.getElementById("pwdReg").value;

	if(username == "" || password == "")
	{
		alert("Please enter a username and password");
		return;
	}

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			alert("User registered.")
		}
		else if(this.readyState == 4)
		{
			alert("User may already exist, or bad input.")
		}
	}

	var params = "username=" + username + "&password=" + password;

	xhttp.open("GET", "http://localhost:3000/register?"+params, true); // bool = to use async or not
	xhttp.send();
}

function logOut()
{
	// Reset cookie
	setCookie("userID", "");
	updateOnlineStatus();
}

/*
// Sample XHTTP request (AJAX)
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function()
{
	if(this.readyState = 4 && this.status == 200)
	{
		//document.getElementsByTagName("body")[0].innerHTML = this.responseText;
	}
}

xhttp.open("GET", "http://localhost:3000/", true); // bool = to use async or not
xhttp.send();
*/
