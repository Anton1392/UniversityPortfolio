require "test/unit"
require "./ex3"

class Tester < Test::Unit::TestCase
	def test_simple
        assert_equal(longest_string(["apelsin", "banan", "citron"]), "apelsin")
        assert_equal(longest_string(["", "", ""]), "")
        assert_equal(longest_string(["", "-", ""]), "-")
        assert_equal(longest_string([]), "")
    end
end
