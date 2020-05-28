require 'rexml/document'
include REXML

class CalendarEvent
    attr_accessor :summary, :time, :location, :website, :author, :desc, :organizer

    def initialize(summary = "", time = "", location = "", website = "", author = "", desc = "", organizer = "")
        @summary = summary
        @time = time
        @location = location
        @website = website
        @author = author
        @desc = desc
        @organizer = organizer
    end

    def display()
        puts "\n", summary
        puts "When: " + time
        puts "Where: " + location
        puts "Posted by: " + author
        puts "Link: " + website
        puts desc
        puts "Organizer: " + organizer
    end
end

def parse_calendar(file_name)
    begin
        file = File.open(file_name)
    rescue
        return false
    end
    
    doc = REXML::Document.new(file)
    events = Array.new
    # Go through the sections of interest in each calendar event
    doc.elements.each("//div[@class='vevent']") { |e|
        # Initial XPath "." searches in current context, not entire document.
        summary = XPath.first(e, ".//span[@class='summary']")
        if summary != nil then summary = summary.text else summary = "" end

        time = XPath.first(e, ".//span[@class='dtstart']")
        if time != nil then time = time.text else time = "" end

        location = XPath.first(e, ".//span[@class='locality']")
        if location != nil
            then location = location.text else location = "" end
        region = XPath.first(e, ".//span[@class='region']")
        if region != nil then location += ", " + region.text end

        # '_NEW' seems to be the only identifier for the links.
        website = XPath.first(e, ".//a[@target='_NEW']")
        if website != nil then website = website.text else website = "" end

        author = XPath.first(e, ".//a[@class='userLink ']")
        if author != nil then author = author.text else author = "" end

        desc = XPath.first(e, ".//td[@class='description']/p")
        if desc != nil then desc = desc.text else desc = "" end

        organizer = XPath.first(e, ".//strong[@class='org fn']")
        if organizer != nil then organizer = organizer.text else organizer = "" end

        # Cost can't seem to reliably be found. There is nothing that identifies it from
        # any other label.

        # Instantiate a new CalendarEvent with the data
        event = CalendarEvent.new(summary, time, location, website, author, desc, organizer)
        events.push(event)

# Old attempt, trying to parse the entire standard, failed.
=begin
        current_event = Hash.new

        objects_to_find = ["dtstart", "dtend", "duration", "summary", "uid", "dtstamp", "method", "category", "location", "url", "description",
            "last-modified", "status", "class", "attendee", "partstat", "role", "contact", "organizer", "attach", "value", "value-title"]

        for object in objects_to_find
            e.elements.each(".//*[contains(@class, #{object})]") {|ee|
                current_event[ee.attribute('class')] = ee.text
                #puts ee.attribute('class')
                #puts ee.text
                #puts "-----------------"
            }
        end
=end

# Old attempt, finds all span objects. Insufficient because other types of objects exists.
=begin
        e.elements.each(".//span"){ |ee|
            puts ee.attribute('class')
            puts ee.text
            puts "-----------------"
            current_event[ee.attribute('class')] = ee.text
        }
=end
    }

    return events
end

# main
#events = parse_calendar(ARGV[0])
# for e in events do e.display; puts "\n" end
