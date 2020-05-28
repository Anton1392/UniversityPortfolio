require './ex1_2'
require 'test/unit'

class Tester < Test::Unit::TestCase
	def test_simple
		assert_equal(present("weather.txt")[0], 14)
		assert_equal(present("weather.txt")[1], 2)

		assert_equal(find_diff("weather.txt")[0][0], 1)
		assert_equal(find_diff("weather.txt")[0][1], 88 - 59)

		assert_equal(read_file("hejsan.txt"), "hejsan, hej\n")
		assert_not_equal(read_file("hejsan.txt"), "HEJ DÅ")
	end
end
