from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
import time
import os

#path = "file://" + os.path.abspath("index.html")
path = os.getcwd() + "/index.html"

driver = webdriver.Chrome('../Drivers_Windows/chromedriver.exe')
#driver = webdriver.Firefox()
driver.get(path)

inputElement = driver.find_element_by_id("textIn")
subButton = driver.find_element_by_id("btnSubmit")
errorBox = driver.find_element_by_id("errorBox")

# Zero length
subButton.click()
WebDriverWait(driver, 5).until(lambda x: errorBox.text == "ERROR: No message")
print("Zero length message passed")

# > 140 length
inputElement.send_keys("------------------------------------------------------------------------------------------------------------------------------------------------------")
subButton.click()
WebDriverWait(driver, 5).until(lambda x: errorBox.text == "ERROR: Message too long (>140 char)")
print(">140 length message passed")

# Proper length
inputElement.clear()
inputElement.send_keys("Hello, world!")
subButton.click()
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_class_name("unread").text == "Hello, world!")
print("Proper message passed")

# Chronological order
inputElement.clear()
inputElement.send_keys("New message")
subButton.click()
inputElement.send_keys("Newer message")
subButton.click()
WebDriverWait(driver, 5).until(lambda x: driver.find_elements_by_class_name("unread")[0].text == "Newer message" and driver.find_elements_by_class_name("unread")[1].text == "New message")
print("Chronological order passed")

# Read-button functional
readBtn = driver.find_element_by_class_name("readButton")
readBtn.click()
WebDriverWait(driver, 5).until(lambda x: driver.find_element_by_class_name("read").text == "Newer message")
print("Read button passed")

# Messages disappear after refresh
driver.refresh()
try:
    # Shouldn't find a message
    driver.find_element_by_class_name("unread")
except:
    print("Disappearing messages passed")


driver.quit()
