require './ex1_1'
require 'test/unit'

class Tester < Test::Unit::TestCase
	def test_simple
		assert_equal(least_difference("football.txt"), ["Leicester"])
		assert_not_equal(least_difference("football.txt"), ["Arsenal"])

		assert_equal(read_file("hejsan.txt"), "hejsan, hej\n")
		assert_not_equal(read_file("hejsan.txt"), "HEJ DÅ")
	end
end
