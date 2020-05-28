require "test/unit"
require "./ex5"

class Tester < Test::Unit::TestCase
	def test_simple
		test_name = PersonName.new
		test_name.name = "Anton"
		test_name.surname = "Sköld"

		assert_equal("Anton", test_name.name)
		assert_equal("Sköld", test_name.surname)
		assert_equal("Anton Sköld", test_name.fullname)

		test_name.fullname = "Johan Öhman"

		assert_equal("Johan", test_name.name)
		assert_equal("Öhman", test_name.surname)
		assert_equal("Johan Öhman", test_name.fullname)
	end
end
