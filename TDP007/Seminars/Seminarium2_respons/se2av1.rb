#file = filename, re_match = regexp to scan for, idx_one and two = the numbers to compare
#returns
def rank_diff(file, re_match, idx_one, idx_two)
    contents = File.read(file)

    md = contents.scan(re_match)

    arr = Array.new((md.length)) { Array.new(2)}
    for i in 0..(md.length-1)
       #arr[i][0] => Name
       arr[i][0] = md[i][0]
       #arr[i][1] => +/-
       arr[i][1] = (Integer(md[i][idx_one]) - Integer(md[i][idx_two])).abs

    end

    #Sort by value
    arr = arr.sort {|a,b| a[1] <=> b[1]}
end

g_find = Regexp.new(/([a-zA-Z_]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+-\s+(\d+)\s+(\d+)/)

arrg = rank_diff("football.txt", g_find, 5, 6)

puts "Laget med minst skillnad i antal gjorda och insläppta mål: " + arrg[0][0].to_s
puts "\n"
arrg.each_with_index {|val, index| puts "#{index+1}. #{val[0]}: #{val[1]}"}

puts "\n"

t_find = Regexp.new(/^\s+(\d+)\s+(\d+).?\s+(\d+)/)
arrw = rank_diff("weather.txt", t_find, 1, 2)

puts "Dagen med minst skillnad mellan lägsta (MnT) och högsta (MxT) dyngstemperaturen: Dag " + arrw[0][0].to_s
puts "\n"
arrw.each_with_index {|val, index| puts "#{index+1}. Dag #{val[0]}: #{val[1]}"}
