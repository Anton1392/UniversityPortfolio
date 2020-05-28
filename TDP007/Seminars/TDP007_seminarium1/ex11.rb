# does not find tag names where the tags include other text like "id=..."
def tag_names(html)
    html.scan(/\<(\w+)\>/)
end
