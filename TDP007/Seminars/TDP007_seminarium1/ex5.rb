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
