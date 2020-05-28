class MyClass
  def initialize(&c)
    @a = 0
    @b = 0
    @c = c
  end

  def korvgryta(d=0)
    @a += 1
    @b += @c.call(d)
    1.0*@b/@a
  end
end
