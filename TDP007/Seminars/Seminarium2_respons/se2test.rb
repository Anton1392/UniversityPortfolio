require './se2av1.rb'
require './se2av2.rb'

require 'test/unit'

#------testing se1av1.rb

#test of n_times function
class Test_weather < Test::Unit::TestCase
  def test_simple
    t_find = /^\s+(\d+)\s+(\d+).?\s+(\d+)/
    arrw = rank_diff("weather.txt", t_find, 1, 2)
    assert_equal(30, arrw.length) #Days in weather.txt
    assert_equal(2, arrw[0][1]) #Array is sorted
    assert_equal("14", arrw[0][0]) #Array is sorted
  end
end

class Test_football < Test::Unit::TestCase
  def test_simple
    g_find = Regexp.new(/([a-zA-Z_]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+-\s+(\d+)\s+(\d+)/)
    arrg = rank_diff("football.txt", g_find, 5, 6)

    assert_equal(20, arrg.length) #Teams in football.txt
    assert_equal(1, arrg[0][1]) #Array is sorted
    assert_equal("Aston_Villa", arrg[0][0]) #Array is sorted
  end
end

class Test_calender < Test::Unit::TestCase
  def test_simple
    src = File.open "events.html"
    doc = REXML::Document.new src
    events = Array.new
    doc.elements.each("//div[@class='vevent']") do |n|
        event = Hash.new("N/A")
        store_events(n, event)
        events << event
    end

    assert_equal(8, events.length) #Events in eventes.html
    assert_equal("Ontario", events[0]["region"]) #Array is sorted
    assert_equal("Free", events[1]["cost"]) #Array is sorted
  end
end
