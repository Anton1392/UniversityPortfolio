def findUsername(string)
    string.scan(/[a-zA-Z|åäöÅÄÖ]+\s*\:\s*(.+)/)
end
