require "test/unit"
require "./ex9"

class Tester < Test::Unit::TestCase
	def test_simple
		assert_equal([2, 3, 1], [1, 2, 3].rotate_left)
		assert_equal([1, 2, 3], [1, 2, 3].rotate_left(3))
		assert_equal([1], [1].rotate_left(99))
		assert_equal([3, 4, 1, 2], [1, 2, 3, 4].rotate_left(2))
	end
end
