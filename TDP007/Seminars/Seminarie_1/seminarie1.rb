require 'date'

def n_times (n, &block)
  1.upto(n) do
    block.call()
  end
end

class Repeat
  def initialize(num)
    @repeat_num = num
  end

  def each ( &block )
    1.upto(@repeat_num) do
      block.call()
    end
  end
end

def longest_string(array)
  longest = ""
  for s in array
    if(s.length > longest.length)
      longest = s
    end

  end
  longest
end

class PersonName
  attr_accessor :name, :surname
  def fullname
    @name + ' ' + @surname
  end
  def fullname=(new_name)
    @name, @surname = new_name.split(' ')
  end
end

class Person
  attr_reader :name, :age, :year
  def initialize(name = "", surname = "", age = 0)
    @name = PersonName.new
    @name.name = name
    @name.surname = surname
    @age = age
    @year = Date.today.year - @age
  end
  def age=(new_age)
    @age = new_age
    @year = Date.today.year - @age
  end
  def year=(new_year)
    @year = new_year
    @age = Date.today.year - @year
  end
  def fullname
    @name.fullname
  end
end

class Integer
  def fib
    seq = [1,1]
    for i in 1..self
       first = seq [i]
       second = seq [i - 1]
       seq.push(first + second)
    end
    seq[self-1]
  end
end

class String
  def acronym
    result = ""
    words = self.split(" ")

    for word in words
      result += word[0].upcase
    end
    result
  end
end

def username(name)
  re = /[A-Za-z]+$/
  md = re.match(name)

  if name[0] == ":"
    return ""
  else
    return md[0]
  end
end

def validate(reg)
    re = /(?<=\s)[A-Z]{3}[0-9]{3}|^[A-Z]{3}[0-9]{3}/
    md = re.match(reg)
    if (md == nil)
        regno = ""
    else
        regno = md[0]
    end
    if(regno == "")
        return false
    else
        if (regno.include?('I')  || regno.include?('Q') || regno.include?('V'))
            return false
        else
            return regno
        end
    end
end


puts username(": Brian")
