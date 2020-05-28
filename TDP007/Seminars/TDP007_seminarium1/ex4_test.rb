require "test/unit"
require "./ex4"

class Tester < Test::Unit::TestCase
	def test_simple
		strings = ["apelsin", "banan", "citron"]
		assert_equal(find_it(strings) { |a, b| a.length > b.length }, "apelsin")
		assert_equal(find_it(strings) { |a, b| a.length < b.length }, "banan")

		strings2 = ["a", "b", "c", "d", "e"]
		assert_equal(find_it(strings2) { |a, b| a.length < b.length }, "a")
		
		empty = []
		assert_equal(find_it(empty) { |a, b| a.length < b.length }, nil)
    end
end
