require './ex1'
require 'test/unit'

class TestIteratorFunction < Test::Unit::TestCase
    def test_simple
        test_counter = 0
        n_times(5) { test_counter += 1 }
        assert_equal(test_counter, 5)

        n_times(0) { test_counter += 1 }
        assert_equal(test_counter, 5)
    end
end

class TestRepeatClass < Test::Unit::TestCase
    def test_simple
        do_three = Repeat.new(3)
        test_counter = 0
        do_three.each { test_counter += 1 }
        assert_equal(test_counter, 3)

        dont = Repeat.new(0)
        dont.each {test_counter += 1}
        assert_equal(test_counter, 3)
    end
end
