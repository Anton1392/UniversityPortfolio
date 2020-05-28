require "test/unit"
require "./ex7"

class Tester < Test::Unit::TestCase
	def test_simple
		assert_equal(1, 1.fib)
		assert_equal(1, 2.fib)
		assert_equal(2, 3.fib)
		assert_equal(3, 4.fib)
		assert_equal(5, 5.fib)
		assert_equal(8, 6.fib)
		assert_equal(1836311903, 46.fib)
	end
end
