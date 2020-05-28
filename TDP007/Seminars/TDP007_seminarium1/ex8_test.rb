require "test/unit"
require "./ex8"

class Tester < Test::Unit::TestCase
	def test_simple
		assert_equal("LOL", "Laughing out loud".acronym)
		assert_equal("DWIM", "Do what I mean!!".acronym)
		assert_equal("", "".acronym)
		assert_equal("T15!<L", "Test 1hey 5 ! < LOL".acronym)
	end
end
