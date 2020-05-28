class Array
	def rotate_left(n = 1)
		n.times do
			self.push(self.shift)
		end

		return self
	end
end
