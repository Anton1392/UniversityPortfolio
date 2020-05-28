require 'test/unit'
require './ex2.rb'

class Tester < Test::Unit::TestCase
    def test_language
        l = Lang.new
        assert(l.test_input("(not false)"))
        assert_equal(false, l.test_input("(not true)"))
        assert(l.test_input("(set a true)"))
        assert(l.test_input("a"))
        assert_equal(false, l.test_input("(not a)"))
        assert_equal(false, l.test_input("(set b false)"))
        assert_equal(false, l.test_input("b"))
        assert(l.test_input("(not b)"))
        assert(l.test_input("(or a b)"))
        assert_equal(false, l.test_input("(and a b)"))
        assert(l.test_input("(set c (not b))"))
        assert_equal(false, l.test_input("(set c false)"))
        assert_equal(false, l.test_input("c"))
    end
end
