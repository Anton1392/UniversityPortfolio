require './auto_click'

$global_variables = [{}]
$global_functions = [{}]
$scope = 0
$use_scope = true
$use_scope_if_else = false
$use_scope_loop = false
$use_scope_functions = true


####################################################
# Utilitarian and scope handling functions
####################################################
def error_print(message)
	print("\nERROR :: ", message, "\n\n")
end

def get_variable_value(name)
	for i in (0..$scope).reverse_each
		if $global_variables[i][name] != nil
			return $global_variables[i][name]
		end
	end
	return nil
end

def set_variable(name, value)
	$global_variables[$scope][name] = value
end

def get_func_info(name)
	for i in (0..$scope).reverse_each
		if $global_functions[i][name] != nil
			return $global_functions[i][name]
		end
	end
	return nil
end

def set_function(name, info)
	$global_functions[$scope][name] = info
end

def increase_scope()
	if $use_scope != false
		$scope += 1
		$global_variables << {}
		$global_functions << {}
	end
end

def decrease_scope
	if $use_scope != false
		if $scope != 0
			$scope -= 1
			$global_variables.pop()
			$global_functions.pop()
		else
			error_print("Scope is alredy at bottom")
		end
	end
end


##########################
# Stmt_list
##########################
class Stmt_list
  def initialize (stmt,stmt_tail)
    @stmt = stmt
    @stmt_tail = stmt_tail
  end

  def evaluate()
		if @stmt.class == Array
			to_ret = []
			for item in @stmt
				to_ret += [item.evaluate]
			end
			if to_ret.size == 1
				to_ret = to_ret[0]
			end
		else
			to_ret =	@stmt.evaluate()

		end
		if @stmt.class == Return_class
			if $scope != 0
				return to_ret
			else
				error_print("Cant use return in scope 0")
			end
		end
    if @stmt_tail != nil
			return @stmt_tail.evaluate()
		else
			return to_ret
    end
  end
end
#################################
# Built in functions
#################################
class Print
	def initialize(msg)
		@msg = msg
	end

	def evaluate
		print(@msg.evaluate(), "\n")
	end
end

class Sleep
	def initialize(ms)
		@time = ms
	end

	def evaluate
		sleep(@time.evaluate/1000.0) # Takes in seconds.
	end
end

class MouseMove
	def initialize(x, y)
		# x and y should evaluate to Integers.
		@x = x
		@y = y
	end

	def evaluate
		mouse_move(@x.evaluate, @y.evaluate)
	end
end

# Retrieves current mouse position as an integer.
class MousePos
	def initialize(dimension)
		# dimension can be "x" or "y"
		@dimension = dimension
	end

	def evaluate
		if @dimension.evaluate == "x" then return cursor_position[0] end
		if @dimension.evaluate == "y" then return cursor_position[1] end
	end
end

class MouseClick
	def initialize(type)
		# Type is the type of click you want to perform.
		# Options are: "left", "right", "double", "middle"
		@type = type
	end

	def evaluate
		if @type == "left" then left_click end
		if @type == "right" then right_click end
		if @type == "double" then double_click end
		if @type == "middle" then middle_click end
	end
end

# Keystrokes
class Send
	def initialize(text)
		@text = text # StringClass object.
	end

	def evaluate
		type(@text.evaluate)
	end
end

class MouseDown
	def initialize(btn)
		@btn = btn
	end

	def evaluate
		if @btn.evaluate == "left" then mouse_down(:left) end
		if @btn.evaluate == "middle" then mouse_down(:middle) end
		if @btn.evaluate == "right" then mouse_down(:right) end
	end
end

class MouseUp
	def initialize(btn)
		@btn = btn
	end

	def evaluate
		if @btn.evaluate == "left" then mouse_up(:left) end
		if @btn.evaluate == "middle" then mouse_up(:middle) end
		if @btn.evaluate == "right" then mouse_up(:right) end
	end
end

class KeyDown
	def initialize(key)
		@key = key
	end

	def evaluate
		key_down(@key.evaluate)
	end
end

class KeyUp
	def initialize(key)
		@key = key
	end

	def evaluate
		key_up(@key.evaluate)
	end
end

class KeyStroke
	def initialize(key)
		@key = key
	end

	def evaluate
		key_stroke(@key.evaluate)
	end
end

#################################
# Function declare and call
#################################
class Func_def
	def initialize(func_name, param_list, stmt_list)
		@func_name      = func_name
		@param_list = param_list
		@stmt_list      = stmt_list
	end

	def evaluate()
		if @param_list != nil
			set_function(@func_name,[process_params(@param_list), @stmt_list])
		else
			set_function(@func_name,[nil, @stmt_list])
		end
	end

	private
	def process_params(param_list)
		to_ret = []
		for param in param_list
			to_ret += [param.evaluate()]
		end
		return to_ret
	end
end



# As is now: if scope is off, params may override existing variables
#Implementation is code heavy, and thus moved to a separate file
require "./Func_call"


class Def_parameter
	def initialize(param_name, standard_value)
		@param_name = param_name
		@standard_value = standard_value
	end

	def evaluate()
		return {@param_name => @standard_value}
	end
end


class Return_class
	def initialize(to_ret)
		@to_ret = to_ret
	end

	def evaluate()
		items_to_ret = []
		for item in @to_ret
			items_to_ret += [item.evaluate()]
		end
		return items_to_ret
	end
end

#################################
# Control statements and loops
#################################

class If_Else
	def initialize(expr, stmt_list, else_stmt_list = nil)
		@expr = expr
		@stmt_list = stmt_list
		@else_stmt_list = else_stmt_list
	end

	def evaluate
		increase_scope() unless not $use_scope_if_else
		if @expr.evaluate()
			to_ret = @stmt_list.evaluate()
		else
			if @else_stmt_list != nil
			to_ret = @else_stmt_list.evaluate()
			end
		end
		decrease_scope() unless not $use_scope_if_else
		return to_ret
	end
end

class Loop
	def initialize(expr, stmt_list)
		@expr = expr
		@stmt_list = stmt_list
	end

	def evaluate
		increase_scope() unless not $use_scope_loop
		res = @expr.evaluate()
		if res.class == Integer or res.class == Fixnum
			# evaluate as many times as the integer.
			res.times do
				to_ret = @stmt_list.evaluate()
			end
		end

		if res.class == TrueClass or res.class == FalseClass
			# Reevaluate the expression, if it ever is false, break the loop.
			to_ret=nil
			loop do
				if @expr.evaluate == false
					break
				else
					to_ret = @stmt_list.evaluate
				end
			end
		end
		decrease_scope() unless not $use_scope_loop
		return to_ret
	end
end

#################################
# Comparison
#################################
class Comparison
	def initialize(lhs, comp_op, rhs)
		@lhs = lhs
		@rhs = rhs
		@comp_op = comp_op
	end

	def evaluate()
		if @comp_op == "<"  then return @lhs.evaluate() <  @rhs.evaluate() end
		if @comp_op == ">"  then return @lhs.evaluate() >  @rhs.evaluate() end
		if @comp_op == "<=" then return @lhs.evaluate() <= @rhs.evaluate() end
		if @comp_op == ">=" then return @lhs.evaluate() >= @rhs.evaluate() end
		if @comp_op == "==" then return @lhs.evaluate() == @rhs.evaluate() end
		if @comp_op == "!=" then return @lhs.evaluate() != @rhs.evaluate() end
	end
end

#################################
# Variable operations
#################################

#Implementation is code heavy, and thus moved to a separate file
require "./Assignment"

class SelfModOp
	def initialize(varName, operator)
		@varName = varName
		@operator = operator
	end

	def evaluate()
		if @operator == "++" then return set_variable(@varName.evaluate("set"), get_variable_value(@varName.evaluate("set")) + 1) end
		if @operator == "--" then return set_variable(@varName.evaluate("set"), get_variable_value(@varName.evaluate("set")) - 1) end
		if @operator == "**" then return set_variable(@varName.evaluate("set"), get_variable_value(@varName.evaluate("set")) * get_variable_value(@varName.evaluate("set"))) end
		if @operator == "^^" then return set_variable(@varName.evaluate("set"), get_variable_value(@varName.evaluate("set")) ** get_variable_value(@varName.evaluate("set"))) end
	end
end

##########################
# Mathematical expressions
##########################
class A_Expr
	def initialize(lhs, operator, rhs)
		@lhs = lhs
		@operator = operator
		@rhs = rhs
	end

	def evaluate()
		if @operator == "+" then return @lhs.evaluate() + @rhs.evaluate() end
		if @operator == "-" then return @lhs.evaluate() - @rhs.evaluate() end
	end
end

class M_Expr
	def initialize(lhs, operator, rhs)
		@lhs = lhs
		@operator = operator
		@rhs = rhs
	end

	def evaluate()
		if @operator == "/" then return @lhs.evaluate() / @rhs.evaluate() end
		if @operator == "*" then return @lhs.evaluate() * @rhs.evaluate() end
		if @operator == "%" then return @lhs.evaluate() % @rhs.evaluate() end
		if @operator == "//"then return(@lhs.evaluate() / @rhs.evaluate()).floor end
	end
end

class Power
	def initialize(lhs, rhs)
		@lhs = lhs
		@rhs = rhs
	end

	def evaluate()
		@lhs.evaluate() ** @rhs.evaluate()
	end
end


######################
# Boolean tests
######################
class OrTest
	def initialize(lhs, rhs)
		@lhs = lhs
		@rhs = rhs
	end

	def evaluate()
		@lhs.evaluate() or @rhs.evaluate()
	end
end

class AndTest
	def initialize(lhs, rhs)
		@lhs = lhs
		@rhs = rhs
	end

	def evaluate()
		@lhs.evaluate() and @rhs.evaluate()
	end
end

class NotTest
	def initialize(expr)
		@expr = expr
	end

	def evaluate()
		not @expr.evaluate()
	end
end

######################
# Variable Value
######################
class VariableValue
	def initialize(varName)
		@varName = varName
	end

	def evaluate(what_todo = "get")
		if what_todo == "get"
			return get_variable_value(@varName)
		end
		if what_todo == "set"
			return @varName
		end
	end
end


######################
# Basic variable types
######################
class IntClass
	def initialize(value)
		@value = value
	end

	def evaluate()
		raise "IntClass has wrong value type" unless @value.class == Integer or @value.class == Fixnum
		@value
	end
end

class FloatClass
	def initialize(value)
		@value = value
	end

	def evaluate()
		raise "FloatClass has wrong value type" unless @value.class == Float
		@value
	end
end

class StringClass
	def initialize(value)

		@value = value[1..-2] # Cuts away the quote marks # could it be solved in match using capture groups?
	end

	def evaluate()
		raise "StringClass has wrong value type" unless @value.class == String
		@value
	end
end

class BoolClass
	def initialize(value)
		@value = value
	end

	def evaluate()
		raise "BoolClass has wrong value type" unless @value.class == TrueClass or @value.class == FalseClass
		@value
	end
end


class Our_NilClass
	def initialize()
		#do what?
	end
	def evaluate()
		return nil
	end
end



if __FILE__==$0

end
