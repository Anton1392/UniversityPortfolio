def find_it(strings, &block)
    res = strings[0]
    strings.each { | str | if block.call(str, res) then res = str end }
    res
end
