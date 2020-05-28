def read_file(file_name)
	# Opens file and returns all raw text-data
	f = File.open(file_name, "r")
	data = f.read()
	f.close
	return data
end

def find_goals(file_name)
	table = read_file("football.txt")

	# Regexes for finding the scores and teamnames.
	reg_scores = /(\d+)  -  (\d+)/
	reg_teamnames = /\d+. ([a-zA-Z_]+)/
	scores = table.scan(reg_scores)
	teamnames = table.scan(reg_teamnames)

	# Adds all results to a combined array which is later returned.
	combined_res = Array.new
	for i in 0...teamnames.count
		combined_res.push([teamnames[i], scores[i]])
	end

	return combined_res
end

def least_difference(file_name)
	goals = find_goals(file_name)
	#goals[[[teamname], [F, A]], [teamname2, [F2, A2]]]
	# is the structure
	
	##################################################
	# Least difference in order
	# Looks messy, couldn't get it to work multiline.
	##################################################
	goals.sort!{|a, b| a[1][0].to_i - a[1][1].to_i <=> b[1][0].to_i - b[1][1].to_i}
	
	print "The team with the smallest difference was: "
	puts goals[0][0]
	puts "\n"

	# Loop through all teams and present their difference.
	for team in goals
		diff = team[1][0].to_i - team[1][1].to_i
		puts team[0]
		puts "Difference: " + diff.to_s
		puts "----------------"
	end

	# Returns the team with the smallest difference.
	return goals[0][0]
end
