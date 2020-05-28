require "test/unit"
require "./ex10"

class Tester < Test::Unit::TestCase
	def test_simple
		assert_equal(findUsername("USERNAME: Brian"), [["Brian"]])
		assert_equal(findUsername("USERNAME     : Brian"), [["Brian"]])
		assert_equal(findUsername("asdasdasdasd: Brian"), [["Brian"]])
		assert_equal(findUsername("åäöÅÄÖ: Brian"), [["Brian"]])
		assert_equal(findUsername("d-: Brian"), [])
		assert_equal(findUsername("asdasdasdasd Brian"), [])
    end
end
