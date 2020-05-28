def regnr(string)
    result = string.scan(/.*\b([^[^A-Z]IQV]{3}\d{3}){1}\b.*/)
    if result == [] then return false
    end
    return result
end
