#!/usr/bin/env ruby

# V�ran egen kod finns i new_value-metoden i ArithmeticConstraint klassen.
# Detta ovan f�r att fixa "bidirectional"-delen av koden.

require 'logger'
require 'test/unit'

module PrettyPrint
  def inspect
    "#<#{self.class}: #{to_s}>"
  end

end

# This is the base class for Adder and Multiplier.
class ArithmeticConstraint

  include PrettyPrint

  attr_accessor :a,:b,:out
  attr_reader :logger,:op,:inverse_op

  def initialize(a, b, out)
    @logger=Logger.new(STDOUT)
    @a,@b,@out=[a,b,out]
    puts "A is: " + a.class.to_s
    puts "B is: " + b.class.to_s
    puts "OUT is: " + out.class.to_s
    [a,b,out].each { |x| x.add_constraint(self) unless x.is_a?(NilClass) }
  end

  def to_s
    "#{a} #{op} #{b} == #{out}"
  end



  def new_value(connector)
    if [a,b].include?(connector) and a.has_value? and b.has_value? and
        (not out.has_value?) then
      # Inputs changed, so update output to be the sum of the inputs
      # "send" means that we send a message, op in this case, to an
      # object.
      val=a.value.send(op, b.value)
      logger.debug("#{self} : #{out} updated")
      out.assign(val, self)
    end
	# This beneath is the code written for the first part of ex1.
	# One of inputs or the other, but not both lacking value.
	if [a,b,out].include?(connector) and (a.has_value? or b.has_value?) and
			not (a.has_value? and b.has_value?) then
		# Out needs a value for inverse operation
		if(out.has_value?)
			if not a.has_value?
				val = out.value.send(inverse_op, b.value)
				logger.debug("#{self} : #{a} updated")
				a.assign(val, self)
			end
			if not b.has_value?
				val = out.value.send(inverse_op, a.value)
				logger.debug("#{self} : #{b} updated")
				b.assign(val, self)
			end
		end
	end
	self
  end

  # A connector lost its value, so propagate this information to all
  # others
  def lost_value(connector)
	  ([a,b,out]-[connector]).each { |connector| connector.forget_value(self) }
  end

end

class Adder < ArithmeticConstraint

	def initialize(*args)
		super(*args)
		@op,@inverse_op=[:+,:-]
	end
end

class Multiplier < ArithmeticConstraint

	def initialize(*args)
		super(*args)
		@op,@inverse_op=[:*,:/]
	end

end

class ContradictionException < Exception
end

# This is the bidirectional connector which may be part of a constraint network.

class Connector

	include PrettyPrint

	attr_accessor :name,:value

	def initialize(name, value=false)
		self.name=name
		@has_value=(not value.eql?(false))
		@value=value
		@informant=false
		@constraints=[]
		@logger=Logger.new(STDOUT)
	end

	def add_constraint(c)
		@constraints << c
	end

	# Values may not be set if the connector already has a value, unless
	# the old value is retracted.
	def forget_value(retractor)
		if @informant==retractor then
			@has_value=false
			@value=false
			@informant=false
			@logger.debug("#{self} lost value")
			others=(@constraints-[retractor])
			@logger.debug("Notifying #{others}") unless others == []
			others.each { |c| c.lost_value(self) }
			"ok"
		else
			@logger.debug("#{self} ignored request")
		end
	end

	def has_value?
		@has_value
	end

	# The user may use this procedure to set values
	def user_assign(value)
		forget_value("user")
		assign value,"user"
	end

	def assign(v,setter)
		if not has_value? then
			@logger.debug("#{name} got new value: #{v}")
			@value=v
			@has_value=true
			@informant=setter
			(@constraints-[setter]).each { |c| c.new_value(self) }
			"ok"
		else
			if value != v then
				raise ContradictionException.new("#{name} already has value #{value}.\nCannot assign #{name} to #{v}")
			end
		end
	end

	def to_s
		name
	end

end

class ConstantConnector < Connector

	def initialize(name, value)
		super(name, value)
		if not has_value?
			@logger.warn "Constant #{name} has no value!"
		end
	end

	def value=(val)
		raise ContradictionException.new("Cannot assign a constant a value!")
	end
end



# ----------------------------------------------------------------------------
#  Assignment
# ----------------------------------------------------------------------------

# Uppgift 1 inf�r fj�rde seminariet inneb�r tv� saker:
# - F�rst ska ni skriva enhetstester f�r Adder och Multiplier. Det �r inte
#   helt s�kert att de funkar som de ska. Om ni med era tester uppt�cker
#   fel ska ni dessutom korrigera Adder och Multiplier.
# - Med hj�lp av Adder och Multiplier m.m. ska ni sedan bygga ett n�tverk som
#   kan omvandla temperaturer mellan Celsius och Fahrenheit. (Om ni vill
#   f�r ni ta en annan ekvation som �r ungef�r lika komplicerad.)

# Ett tips �r att skapa en funktion celsius2fahrenheit som returnerar
# tv� Connectors. Dessa tv� motsvarar Celsius respektive Fahrenheit och
# kan anv�ndas f�r att mata in temperatur i den ena eller andra skalan.

def celsius2fahrenheit
	# Klistra in er kod h�r.

	# Celcius = (Fahrenheit-32) * 5/9
	#
	#			      32
	#			   -
	#			      fah
	# Celcius = *
	# 			   5/9
	#
	# First an adder that adds -32 to fahrenheit.
	fahren_side = Connector.new('FahrenheitIO')
	b = Connector.new('Minus32')
	c = Connector.new('Minus32Output')

	b.user_assign(-32)

	Adder.new(fahren_side,b,c)

	# Then a multiplier that takes in the output of first step, and 5/9. Also spits out the celcius output.
	d = Connector.new('FiveNinths')
	d.user_assign(5.0/9.0)
	celcius_side = Connector.new('CelsiusIO')

	Multiplier.new(c, d, celcius_side)

	# Then construct the final output.
	return celcius_side, fahren_side
end
