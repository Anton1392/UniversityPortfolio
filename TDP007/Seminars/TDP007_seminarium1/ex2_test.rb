require './ex2'
require 'test/unit'

class Tester < Test::Unit::TestCase
    def test_simple
        assert_equal(factorial(1), 1)
        assert_equal(factorial(0), 1)
        assert_equal(factorial(-1), 1)
        assert_equal(factorial(5), 120)
        assert_equal(factorial(20), 2432902008176640000)
    end
end
