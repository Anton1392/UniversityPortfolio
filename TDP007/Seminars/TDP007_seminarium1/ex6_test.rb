require "test/unit"
require "./ex6"

class Tester < Test::Unit::TestCase
	def test_simple
		person_normal = Person.new("Anton", "Sköld", 19)
		person_ageless = Person.new("Johan", "Öhman")
		person_default = Person.new()

		# Tests normal values
		assert_equal("Anton", person_normal.name.name)
		assert_equal("Sköld", person_normal.name.surname)
		assert_equal("Anton Sköld", person_normal.name.fullname)
		assert_equal(19, person_normal.age)
		assert_equal(1999, person_normal.birthyear)

		# Tests changing birthyear and age
		person_normal.birthyear = 2010
		assert_equal(8, person_normal.age)
		assert_equal(2010, person_normal.birthyear)
		person_normal.age = 5
		assert_equal(2013, person_normal.birthyear)
		assert_equal(5, person_normal.age)

		# Tests on person with no age
		assert_equal(0, person_ageless.age)
		assert_equal(2018, person_ageless.birthyear)

		# Tests on an empty person
		assert_equal("", person_default.name.name)
		assert_equal("", person_default.name.surname)
		assert_equal(" ", person_default.name.fullname)
	end
end
