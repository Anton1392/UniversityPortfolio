require './constraint_networks.rb'
require 'test/unit'

# Enhetstest för uppgift 1.
class Tester < Test::Unit::TestCase
	def test_addition
		a = Connector.new("a")
		b = Connector.new("b")
		c = Connector.new("c")
		Adder.new(a, b, c)
		a.user_assign(10)
		b.user_assign(5)
		puts "c = "+c.value.to_s
		a.forget_value "user"
		c.user_assign(20)

		assert_equal(15, a.value)
		assert_equal(5, b.value)
		assert_equal(20, c.value)
	end

	def test_multiplication
		a = Connector.new("a")
		b = Connector.new("b")
		c = Connector.new("c")
		Multiplier.new(a, b, c)
		a.user_assign(2)
		b.user_assign(4)
		a.forget_value "user"
		c.user_assign(32)

		assert_equal(8, a.value)
		assert_equal(4, b.value)
		assert_equal(32, c.value)
	end

	def test_temps
		c, f = celsius2fahrenheit

		c.user_assign(100)
		assert_equal(212, f.value)

		c.user_assign(0)
		assert_equal(32, f.value)

		# Has error "PrettyPrint is not a class".
		# Still has correct value, though.
		c.forget_value("user")
		f.user_assign(100)
		assert_equal(37, c.value)
	end
end
