class String
	def acronym
		words = self.split(" ")

		acr = ""
		for word in words do
			acr += word[0].upcase
		end

		return acr
	end
end
