def read_file(file_name)
	# Opens file and returns all raw text-data
	f = File.open(file_name, "r")
	data = f.read()
	f.close
	return data
end

def find_diff(file_name)
	data = read_file(file_name)
	r = /^\s*\d+\s+(\d+)[^\s]*\s+(\d+)/ # [^\s] takes care of the occasional asterisks
	matches = data.scan(r) # find all matches
	res = Array.new
	for i in 0..(matches.count-1) # for every pair of values
		diff = matches[i][0].to_i - matches[i][1].to_i # max temp minus min temp
		res.push([i + 1, diff]) # Push day number and temperature difference
	end

	return res
end

def present(file_name)
	data = find_diff(file_name)
	data.sort!{|a, b| b[1].to_i <=> a[1].to_i} # sort on temp diff descending
	smallest = data[data.count - 1] # the last element will hold the smallest temp diff

	puts("Smallest temperature difference on day #{smallest[0]}: #{smallest[1]} degrees\n\n")

	for day in data
		puts "Day: #{day[0].to_s} - Difference: #{day[1].to_s}\n\n"
	end

	return smallest
end
