require "test/unit"
require "./ex12"

class Tester < Test::Unit::TestCase
	def test_simple
		assert_equal([["FMA297"]], regnr("Min bil heter FMA297"))
		assert_equal(false, regnr("FMQ297"))
		assert_equal([["FMA297"]], regnr("Min bil heter FMA297"))
		assert_equal(false, regnr("Min bil heter FMA2971"))
		assert_equal(false, regnr("Min bil heter AFMA297"))
    end
end
