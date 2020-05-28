require './rdparse.rb'

class Lang

  attr_accessor :current_variables, :langParser
  def initialize

    @@current_variables = Hash.new

    @langParser = Parser.new("dice roller") do
      token(/\s+/)
      token(/\d+/) {|m| m.to_i }
      token(/[a-zA-Z]+/) {|m| m }
      token(/\(/) {|m| m}
      token(/\)/) {|m| m}

      start :valid do
          match(:assign)
          match(:expr)
      end

      rule :assign do
          match('(', 'set', :var, :expr, ')') {|_, _, a, b, _|
          @@current_variables[a] = b
        }
      end

      rule :expr do
          match('(', 'or', :expr, :expr, ')') {|_, _, a, b, _| a || b}
          match('(', 'and', :expr, :expr, ')') {|_, _, a, b, _| a && b}
          match('(', 'not', :expr, ')') {|_, _, a, _| !a}
          match(:term)
      end

      rule :term do
          match('true') {true}
          match('false') {false}
          match(:var) { |a|
              if @@current_variables.has_key?(a)
                  @@current_variables[a]
              else
                  a
              end
              }
      end

      rule :var do
        match(String)
      end
    end
  end

  def get_input
    print "[Great Language] "
    str = gets
    if done(str) then
      puts "Bye."
    else
      puts "=> #{@langParser.parse str}"
      get_input
    end
  end

  def test_input(str)
    puts @@current_variables
    return langParser.parse str
  end

  def done(str)
    ["quit","exit","bye",""].include?(str.chomp)
  end

  def log(state = true)
    if state
      @langParser.logger.level = Logger::DEBUG
    else
      @langParser.logger.level = Logger::WARN
    end
  end
end

# l = Lang.new
# l.get_input
