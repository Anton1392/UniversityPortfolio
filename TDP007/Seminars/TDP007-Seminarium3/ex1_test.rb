require 'test/unit'
require './ex1.rb'

class Tester < Test::Unit::TestCase
    def test_simple
        p1 = Person.new("Volvo", "58435", 2, "M", 32)
        assert_equal((5 + 4 + 1 + 4.5)*0.9*1.2, p1.evaluate_policy("policy.rb"))
        p2 = Person.new("BMW", "58937", 5, "F", 66)
        assert_equal((5 + 9 + 4.5 + 1 + 4), p2.evaluate_policy("policy.rb"))
    end
end
