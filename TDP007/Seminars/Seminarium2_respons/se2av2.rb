require 'rexml/document'

# Stores a calender event in a hash
def store_events(elem, dict)
    elem.elements.each do |subelem|
        if (subelem.attributes["class"] == "summary" ||
            subelem.attributes["class"] == "dtstart" ||
            subelem.attributes["class"] == "org fn" ||
            subelem.attributes["class"] == "street-address" ||
            subelem.attributes["class"] == "locality" ||
            subelem.attributes["class"] == "region" ||
            subelem.name == "p" )
            dict[subelem.attributes["class"]] = subelem.text
        end
        if (subelem.text == "Cost:")
            dict["cost"] = subelem.next_element.text
        end
    store_events(subelem, dict)
    end
end

#Prints out an array of hashes
def print_events(list)
    list.each do |e|
        e.each do |k, v|
            puts k.to_s + ": " + v.to_s
        end
        puts ""
    end
end

src = File.open "events.html"
doc = REXML::Document.new src
r = doc.root

events = Array.new

# Detects and stores celender events in hashes in an array
doc.elements.each("//div[@class='vevent']") do |n|
    event = Hash.new("N/A")
    store_events(n, event)
    events << event
end

# Prints out all events stored
print_events(events)
