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
	/*txt = txt.replaceAll("\n", "\r\n");*/
    
    var messageWrapper = document.createElement("div");
    messageWrapper.setAttribute("class", "messageWrapper");
    
	var messageBox = document.createElement("div");
	messageBox.setAttribute("class", "unread message");
	messageBox.appendChild(document.createTextNode(txt));
    messageWrapper.appendChild(messageBox);
	
	var readButton = document.createElement("button");
	readButton.type="button"
    readButton.setAttribute("class", "readButton");
	readButton.onclick = function(){
		messageBox.setAttribute("class", "read message");
        readButton.remove();
	};
    readButton.innerHTML = "&#128065;";
	messageWrapper.appendChild(readButton);
	
	var feed = document.getElementById("feed");
	feed.insertBefore(messageWrapper, feed.firstChild);
}
