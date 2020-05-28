class Integer
	def fib
		two_prev = 0
		prev = 0
		res = 1

		(self-1).times do
			two_prev = prev
			prev = res
			res = two_prev + prev
		end

		return res
	end
end
