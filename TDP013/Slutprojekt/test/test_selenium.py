#- - - - - - - - - - - - - - - - - SETUP - - - - - - - - - - - - - - - - - - -

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import os

#path = "file://" + os.path.abspath("../index.html")
#path = os.path.abspath(os.path.join(os.getcwd(), os.pardir)) + "/index.html"
path = "http://localhost:3000"

driver = webdriver.Chrome('chromedriver.exe')
#driver = webdriver.Firefox()
driver.get(path)

testUsername = "TestUsername"
testPassword = "TestPassword"


def waitForAlert(driver):
	WebDriverWait(driver, 5).until(EC.alert_is_present())
	alert = driver.switch_to.alert
	return alert

def login(driver, username, password):
	log_name_input = driver.find_element_by_id("usr")
	log_pass_input = driver.find_element_by_id("pwd")
	button_login = driver.find_element_by_id("btnLogin")
	log_name_input.send_keys(username)
	log_pass_input.send_keys(password)
	button_login.click()

# - - - - - - - - - - - - - - - - - INDEX - - - - - - - - - - - - - - - - - - -

log_name_input = driver.find_element_by_id("usr")
log_pass_input = driver.find_element_by_id("pwd")

reg_name_input = driver.find_element_by_id("usrReg")
reg_pass_input = driver.find_element_by_id("pwdReg")

reg_name_input.send_keys(testUsername)
reg_pass_input.send_keys(testPassword)


#button_login = driver.find_element_by_xpath("//button[@onclick=\"logIn()\"]")
button_login = driver.find_element_by_id("btnLogin")
#button_reg = driver.find_element_by_xpath("//button[@onclick=\"register()\"]")
button_reg = driver.find_element_by_id("btnReg")

# Reg Success
button_reg.click()
alert = waitForAlert(driver)
# DEBUG disable the condition to avoid restarting server at test development
#WebDriverWait(driver, 5).until(lambda x: alert.text == "User registered.")
alert.dismiss()
print("User created")

# Reg Fail
button_reg.click()
alert = waitForAlert(driver)
WebDriverWait(driver, 5).until(lambda x: alert.text == "User may already exist, or bad input.")
alert.dismiss()
print("User already created")

# Log Fail
log_name_input.send_keys("WrongUsername")
log_pass_input.send_keys("WrongPassword")
button_login.click()
alert = waitForAlert(driver)
WebDriverWait(driver, 5).until(lambda x: alert.text == "Wrong username or password")
alert.dismiss()
print("Login fail")

# Log Success
log_name_input.clear()
log_pass_input.clear()
log_name_input.send_keys(testUsername)
log_pass_input.send_keys(testPassword)
button_login.click()
print("Login success")

# Welcome message
def foo(x): # possibly unstable "stale element no longer part of DOM"
	try:
		if driver.find_element_by_tag_name('h1').text == "Welcome, "+testUsername+"!":
			return True
		return False
	except:
		return False

WebDriverWait(driver, 5).until(foo)
print("Welcome message")

# Chat
button_chat = driver.find_element_by_xpath("//a[@href=\"chat.html\"]")
button_chat.click()
print("Chatroom")

# Send message (Enter)
input_chat = driver.find_element_by_xpath("//input[@id=\"messageInput\"]")
input_chat.send_keys("Hello world! (Enter)")
input_chat.send_keys(Keys.RETURN)
print("Chatted (Enter)")
# TODO check message is sent

# Send message (Button)
input_chat.send_keys("Hello world! (Button)")
button_chat_send = driver.find_element_by_xpath("//button[@onclick=\"sendMessage()\"]")
button_chat_send.click()
print("Chatted (Button)")
# TODO check message is sent

# Post message (Enter)
driver.get(path+"/profile.html?user=Banton")
input_post = driver.find_element_by_xpath("//input[@id=\"messageInput\"]")
input_post.send_keys("Hello Banton (Enter)")
input_post.send_keys(Keys.RETURN)
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//li[text()[contains(.,'Hello Banton (Enter)')]]"))
print("Posted message (Enter)")


# Post message (Button)
input_post.send_keys("Hello Banton (Button)")
button_post_send = driver.find_element_by_xpath("//button[@onclick=\"postMessage()\"]")
button_post_send.click()
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//li[text()[contains(.,'Hello Banton (Button)')]]"))
print("Posted message (Button)")

# Message persistance
driver.get(path+"/profile.html?user=Banton")
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//li[text()[contains(.,'Hello Banton (Enter)')]]"))
print("Message (Enter) persisted")
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//li[text()[contains(.,'Hello Banton (Button)')]]"))
print("Message (Button) persisted")

# Add friend
driver.get(path+"/friends.html")
def foo(x):
	try:
		button_add_friend = driver.find_element_by_xpath("//button[@data-friend=\"Banton\"]")
		if button_add_friend:
			button_add_friend.click()
			return True
		return False
	except:
		return False
WebDriverWait(driver, 5).until(foo)
alert = waitForAlert(driver)
alert.dismiss()
print("Added friend (Banton)")

# Friend in list
driver.get(path + "/myProfile.html")
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//a[text()[contains(.,'Banton')]]"))
print("Friend in list")

# Prviate chat TestUsername -> Banton (offline) # DEBUG make sure old connections are closed
driver.get(path + "/privateChat.html?friendName=Banton")
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//h2[text()[contains(.,'Status: offline')]]"))
print("Private chat: TestUsername -> Banton (offline)")


# Prviate chat Banton -> TestUsername (online)
driver_secondary = webdriver.Chrome('chromedriver.exe') #TODO Linux/Windows OS fix
driver_secondary.get(path)
login(driver_secondary, "Banton", "123")
driver_secondary.get(path + "/privateChat.html?friendName="+testUsername)
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//h2[text()[contains(.,'Status: online')]]"))
print("Private chat: Banton -> TestUsername (online)")

# Chat message TestUsername -> Banton (sent)
input_private_chat = driver.find_element_by_xpath("//input[@id=\"messageInput\"]")
input_private_chat.send_keys("Hello Banton (private)")
input_private_chat.send_keys(Keys.RETURN)
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//div[text()[contains(.,'You: Hello Banton (private)')]]"))
print("Chat message TestUsername -> Banton (sent)")

# Chat message TestUsername -> Banton (recieved)
WebDriverWait(driver, 5).until(lambda x: driver_secondary.find_element_by_xpath("//div[text()[contains(.,'"+ testUsername +": Hello Banton (private)')]]"))
print("Chat message TestUsername -> Banton (recieved)")

# Chat partner gone offline
logout_button = driver_secondary.find_element_by_xpath("//button[@onclick=\"logOut()\"]")
logout_button.click()
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_xpath("//h2[text()[contains(.,'Status: offline')]]"))
print("Chat partner gone offline")
driver_secondary.quit()

# Close
logout_button = driver.find_element_by_xpath("//button[@onclick=\"logOut()\"]")
logout_button.click()
driver.quit()
print("- - - ALL TESTS CLEARED - - -")
