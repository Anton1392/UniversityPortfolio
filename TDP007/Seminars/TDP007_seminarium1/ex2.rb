def factorial(n)
    (1..n).inject(1) { |result, factor| result * factor }
end

puts factorial(20)
