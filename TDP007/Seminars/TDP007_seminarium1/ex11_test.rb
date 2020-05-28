require "test/unit"
require "./ex11"

class Tester < Test::Unit::TestCase
	def test_simple
		require 'open-uri.rb'
		html = open("http://www.google.com/") { |f| f.read }
		names = tag_names(html)
		assert_equal(["head"], names[0])
		assert_equal(names.count(["/head"]), 0)
    end
end
