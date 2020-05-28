require 'test-unit'
require './seminarie1'

class TestSem1 < Test::Unit::TestCase
  def test_n_times
    x=0
    n_times(3) { puts "Hello!"; x+=1}
    assert_equal(3, x)

    x=0
    n_times(5) { puts "Hello!"; x+=1}
    assert_equal(5, x)
  end
  def test_Repeat
    x=0
    repeat_three = Repeat.new(3)
    repeat_three.each{ puts "Hello!"; x+=1}
    assert_equal(3, x)

    x=0
    repeat_five = Repeat.new(5)
    repeat_five.each{ puts "Hello!"; x+=1}
    assert_not_equal(3, x)
    assert_equal(5, x)
  end
  def test_longest
    assert_equal("apelsin", longest_string(["apelsin", "banan", "citron"]) )
    assert_not_equal("banan", longest_string(["apelsin", "banan", "citron"]) )
  end
  def test_PersonName
    kalle = PersonName.new
    kalle.name = "kalle"
    kalle.surname = "karlsson"
    assert_equal("kalle karlsson", kalle.fullname)
    kalle.fullname = "Karl Karlson"
    assert_equal("Karl", kalle.name)
    assert_equal("Karlson", kalle.surname)
  end
  def test_Person
    kalle = Person.new(nil,nil, 20)
    assert_equal(20, kalle.age)
    assert_equal(1998, kalle.year)
    kalle.year = 1990
    assert_equal(28, kalle.age)
    assert_equal(1990, kalle.year)
    kalle.age = 19
    assert_equal(19, kalle.age)
    assert_equal(1999, kalle.year)
  end
  def test_fib
    assert_equal(8, 6.fib)
    assert_equal(165580141, 41.fib)
    assert_equal(1, 1.fib)
    assert_equal(1, 2.fib)
  end

  def test_acronym
    assert_equal("HJHS", "Hej Jag heter SteN".acronym)
    assert_equal("LOL", "Laugh out LoaD".acronym)
  end

    def test_username
        assert_equal("", username(": Brian"))
        assert_equal("Brian", username("USERNAME: Brian"))
    end

    def test_regno
        assert_equal("CTH200", validate("Min bil heter CTH200."))
        assert_equal(false, validate("QTV123"))
        assert_equal(false, validate("ITV245"))
        assert_equal(false,validate("min bil är snabb"))
    end

end
