require "Date"

class PersonName
	attr_accessor :name, :surname

	def initalize
		@name
		@surname
	end

	def fullname
		name + " " + surname
	end

	def fullname=(full_name)
		parts = full_name.split(" ")
		self.name = parts[0]
		self.surname = parts[1]
	end
end

class Person
	attr_accessor :age, :name

	def initialize(_name = "", _surname = "", _age = 0)
		@name = PersonName.new
		self.name.name = _name
		self.name.surname = _surname

		@age = _age
	end

	def birthyear
		current_year = Date.today.year
		return current_year - age
	end

	def birthyear=(year)
		current_year = Date.today.year
		self.age = current_year - year
	end
end
