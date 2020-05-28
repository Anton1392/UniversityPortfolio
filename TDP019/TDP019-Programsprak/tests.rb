require './automato'
require 'test/unit'

class Tests < Test::Unit::TestCase

	def test_arithmetic
		a = Automato.new
		a.log(false)
		assert_equal(1, a.automatoParser.parse("1"))
		assert_equal(2, a.automatoParser.parse("1+1"))
		assert_equal(0, a.automatoParser.parse("1-1"))
		assert_equal(4, a.automatoParser.parse("2*2"))
		assert_equal(1, a.automatoParser.parse("2/2"))
		assert_equal(3, a.automatoParser.parse("10//3"))
		assert_equal(1, a.automatoParser.parse("(1)"))
		assert_equal(2, a.automatoParser.parse("(1)*2"))
		assert_equal(4, a.automatoParser.parse("(1+1)*2"))

		assert_equal(512, a.automatoParser.parse("2^3^2"))
		assert_equal(64, a.automatoParser.parse("(2^3)^2"))

		assert_equal(3, a.automatoParser.parse("(4-8)*3/6+5"))
	end


	def test_assignments
		a = Automato.new
		a.log(false)
		a.automatoParser.parse("a = 5")
		assert_equal(5, a.getVars("a"))

		a.automatoParser.parse("a = 5.44")
		assert_equal(5.44, a.getVars("a"))

		a.automatoParser.parse("a = True")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = False")
		assert_equal(false, a.getVars("a"))

		a.automatoParser.parse('a = "False"')
		assert_equal("False", a.getVars("a"))


		a.automatoParser.parse('a,b = 1,2')
		assert_equal(1, a.getVars("a"))
		assert_equal(2, a.getVars("b"))

		a.automatoParser.parse('a,b,c,d = "a","b","c","d"')
		assert_equal("a", a.getVars("a"))
		assert_equal("b", a.getVars("b"))
		assert_equal("c", a.getVars("c"))
		assert_equal("d", a.getVars("d"))
	end


	def test_self_mod
		a = Automato.new
		a.log(false)
		a.automatoParser.parse("a = 5")
		a.automatoParser.parse("a++")
		assert_equal(6, a.getVars("a"))

		a.automatoParser.parse("a--")
		assert_equal(5, a.getVars("a"))

		a.automatoParser.parse("a**")
		assert_equal(25, a.getVars("a"))

		a.automatoParser.parse("a^^")
		assert_equal(25**25, a.getVars("a"))
	end


	def test_aug_assign
		a = Automato.new
		a.log(false)
		a.automatoParser.parse("a = 3")
		a.automatoParser.parse("a += 2")
		assert_equal(5, a.getVars("a"))

		a.automatoParser.parse("a -= 2")
		assert_equal(3, a.getVars("a"))

		a.automatoParser.parse("a *= 2")
		assert_equal(6, a.getVars("a"))

		a.automatoParser.parse("a /= 2")
		assert_equal(3, a.getVars("a"))

		a.automatoParser.parse("a ^= 2")
		assert_equal(9, a.getVars("a"))

		a.automatoParser.parse("a %= 2")
		assert_equal(1, a.getVars("a"))

		a.automatoParser.parse("a,b = 1,2")
		a.automatoParser.parse("a,b += 2,2")
		assert_equal(3, a.getVars("a"))
		assert_equal(4, a.getVars("b"))

		a.automatoParser.parse("a,b,c,d = 2,4,6,8")
		a.automatoParser.parse("a,b,c,d -= 2,2,2,2")
		assert_equal(0, a.getVars("a"))
		assert_equal(2, a.getVars("b"))
		assert_equal(4, a.getVars("c"))
		assert_equal(6, a.getVars("d"))
	end


	def test_variable_math
		a = Automato.new
		a.log(false)
		a.automatoParser.parse("a = 2")
		a.automatoParser.parse("b = 6")
		a.automatoParser.parse("c = a + 2 * b")
		assert_equal(14, a.getVars("c"))

		a.automatoParser.parse("a = 3")
		a.automatoParser.parse("b = 4")
		a.automatoParser.parse("c = b++ + a++")
		assert_equal(9, a.getVars("c"))
	end


	def test_booleans
		a = Automato.new
		a.log(false)
		a.automatoParser.parse("a = not True")
		assert_equal(false, a.getVars("a"))

		a.automatoParser.parse("a = not False")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = True or True")
		assert_equal(true, a.getVars("a"))
		a.automatoParser.parse("a = False or True")
		assert_equal(true, a.getVars("a"))
		a.automatoParser.parse("a = True or False")
		assert_equal(true, a.getVars("a"))
		a.automatoParser.parse("a = False or False")
		assert_equal(false, a.getVars("a"))

		a.automatoParser.parse("a = True and True")
		assert_equal(true, a.getVars("a"))
		a.automatoParser.parse("a = False and True")
		assert_equal(false, a.getVars("a"))
		a.automatoParser.parse("a = True and False")
		assert_equal(false, a.getVars("a"))
		a.automatoParser.parse("a = False and False")
		assert_equal(false, a.getVars("a"))

		a.automatoParser.parse("a = not False and (True or False)")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = False or False or False or False or not False or False")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = not False and True")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = False")
		a.automatoParser.parse("b = not a")
		assert_equal(true, a.getVars("b"))

		a.automatoParser.parse("a = False")
		a.automatoParser.parse("b = True")
		a.automatoParser.parse("c = not a and b")
		assert_equal(true, a.getVars("c"))
	end


	def test_comparisons
		a = Automato.new
		a.log(false)

		a.automatoParser.parse("a = 5 > 3")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = 5 < 3")
		assert_equal(false, a.getVars("a"))

		a.automatoParser.parse("a = 5 == 3")
		assert_equal(false, a.getVars("a"))

		a.automatoParser.parse("a = 5 != 3")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = 5 > 5")
		assert_equal(false, a.getVars("a"))
		a.automatoParser.parse("a = 5 >= 5")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = 5 < 5")
		assert_equal(false, a.getVars("a"))
		a.automatoParser.parse("a = 5 <= 5")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = 5 > 3 and 3 <= 5")
		assert_equal(true, a.getVars("a"))

		a.automatoParser.parse("a = 3 > 5 and 3 <= 5")
		assert_equal(false, a.getVars("a"))

		a.automatoParser.parse("a = 3 > 5 and 3 <= 5 or 3 != 5")
		assert_equal(true, a.getVars("a"))
	end


	def test_if_else
		a = Automato.new
		a.log(false)

		a.automatoParser.parse("if 5 > 3{a = 8}")
		assert_equal(8, a.getVars("a"))

		a.automatoParser.parse("if 5 < 3{a = 8} else{a = 5}")
		assert_equal(5, a.getVars("a"))

		a.automatoParser.parse("a = 99")
		a.automatoParser.parse("if a == 99{a = 50} else{a = 5}")
		assert_equal(50, a.getVars("a"))
	end


	def test_loop
		a = Automato.new
		a.log(false)

		a.automatoParser.parse("a = 1")
		a.automatoParser.parse("loop a < 10{a++}")
		assert_equal(10, a.getVars("a"))

		a.automatoParser.parse("a = 1")
		a.automatoParser.parse("b = 5")
		a.automatoParser.parse("loop b{a++}")
		assert_equal(6, a.getVars("a"))

		a.automatoParser.parse("a = 1")
		a.automatoParser.parse("b = 7")
		a.automatoParser.parse("loop a <= b{a++}")
		assert_equal(8, a.getVars("a"))
	end


	def test_multiline
		a = Automato.new
		a.log(false)

		#test_arithmetic
		assert_equal(2, a.automatoParser.parse("1
                                            +
                                            1"))
		#test_assignments
		a.automatoParser.parse("a
                            =
                            1")
		assert_equal(1, a.getVars("a"))

		#test_self_mod
		a.automatoParser.parse("a=1")
		a.automatoParser.parse("a
                            ++")
		assert_equal(2, a.getVars("a"))

		#test_aug_assign
		a.automatoParser.parse("a=1")
		a.automatoParser.parse("a
                            +=
                            1")
		assert_equal(2, a.getVars("a"))

		#test_variable_math
		a.automatoParser.parse("a=1")
		a.automatoParser.parse("b=2")
		a.automatoParser.parse("a
                            =
                            a
                            +
                            b")
		assert_equal(3, a.getVars("a"))

		#test_booleans
		assert_equal(false, a.automatoParser.parse("not
                                                True"))

		#test_comparisons
		assert_equal(true, a.automatoParser.parse("1
                                               >
                                               0"))

		#test_if_else
		a.automatoParser.parse("if
                           58
                           ==
                           99
                           {
                           a
                           =
                           50}
                           else
                           {
                           if
                           58
                           !=
                           99
                           {
                           b
                           =
                           30
                           }
                           }")
		assert_equal(30, a.getVars("b"))

		#test_loop
		a.automatoParser.parse("a=1;
														loop
                            8
                            {
                            a
                            *=
                            2
                            }")
		assert_equal(256, a.getVars("a"))
	end




	def test_functions
		a = Automato.new
		a.log(false)
		#puts "\n$use_scope =#{$use_scope}\n"
		$use_scope= true
		a.automatoParser.parse("fun ara(){-1}; c=ara()")
		assert_equal(-1, a.getVars("c"))

		a.automatoParser.parse("fun ara(a){Return a; 9000} ; c = ara(0)")
		assert_equal(0, a.getVars("c"))

		a.automatoParser.parse("fun foo(){Return 1}; fun bar(a=foo()){Return a}; c=bar(1)")
		assert_equal(1, a.getVars("c"))


		a.automatoParser.parse("temp= 2; fun bar(a=temp){Return a}; c=bar(Nil)")
		assert_equal(2, a.getVars("c"))


		a.automatoParser.parse("fun foo(){Return 3}; fun bar(a=foo()){Return a}; c=bar(Nil)")
		assert_equal(3, a.getVars("c"))


		a.automatoParser.parse("temp=4")
		a.automatoParser.parse("fun ara(){Return temp}; b=ara()")
		assert_equal(4, a.getVars("b"))


		a.automatoParser.parse("fun ara(){5}; fun bar(b=ara()){b}; c=bar(Nil)")
		assert_equal(5, a.getVars("c"))


		a.automatoParser.parse("fun ara(a,b=5){a+b}; c = ara(1,Nil)")
		assert_equal(6, a.getVars("c"))


		a.automatoParser.parse("fun ara(){7}; fun bar(b=ara()){b}; c=bar(ara())")
		assert_equal(7, a.getVars("c"))


		a.automatoParser.parse("fun ara(a){if a==8 {Return a} else {ara(a+2)}}; b=ara(0)")
		assert_equal(8, a.getVars("b"))

		a.automatoParser.parse("fun ara(){9,10,11}; a,b,c = ara()")
		assert_equal(9, a.getVars("a"))
		assert_equal(10, a.getVars("b"))
		assert_equal(11, a.getVars("c"))

		a.automatoParser.parse("fun ara(){12,13}; a,b,c,d = ara(),ara()")
		assert_equal(12, a.getVars("a"))
		assert_equal(13, a.getVars("b"))
		assert_equal(12, a.getVars("c"))
		assert_equal(13, a.getVars("d"))

		a.automatoParser.parse("fun ara(){14,15};fun bar(){ara()}; a,b,c,d = bar(),ara()")
		assert_equal(14, a.getVars("a"))
		assert_equal(15, a.getVars("b"))
		assert_equal(14, a.getVars("c"))
		assert_equal(15, a.getVars("d"))

		a.automatoParser.parse("fun ara(aa,bb = aa){aa,bb} ; aa,bb = ara(16,Nil)")
		assert_equal(16, a.getVars("aa"))
		assert_equal(16, a.getVars("bb"))
	end
end
