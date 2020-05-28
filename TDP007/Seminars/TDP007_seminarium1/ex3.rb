def longest_string(strings)
    res = ""
    strings.each { | str | if str.length > res.length then res = str end }
    res
end
