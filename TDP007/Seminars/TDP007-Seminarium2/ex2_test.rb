require './ex2'
require 'test/unit'

class Tester < Test::Unit::TestCase
	def test_simple
		data = parse_calendar("events.html")
		assert_equal(data[0].summary, "The Dark Carnival - 101.9FM")
		assert_not_equal(data[1].summary, "The Dark Carnival - 101.9FM")
		assert_equal(data.count, 8)

		data2 = parse_calendar("events2.html")
		assert_equal(data2[0].summary, "The Dark Carnival - 101.9FM")
		assert_equal(data2[0].time, "2008-01-04 10:00pm EST")
		assert_equal(data2.count, 8)

		data3 = parse_calendar("events3.html")
		assert_equal(data3, false)
	end
end
