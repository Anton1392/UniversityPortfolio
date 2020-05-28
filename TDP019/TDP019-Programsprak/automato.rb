require './rdparse.rb'
require './classes'
##############################################################################
#
# This part defines our own language.
#
##############################################################################
# TODO: a mojor spell check

# Insted of matching things like strings and bools then creating them at the bottom of match()
# crate them in parser
# move scope manegment to a seperate file
class Automato
	attr_accessor :automatoParser


	def initialize
		@automatoParser = Parser.new("Automato") do
			token(/#.*\n/)

			token(/"(?:(?!").)*?"/) {|m| StringClass.new(m)}

			token(/\(/)  {|m|m}
			token(/\)/)  {|m|m}
			token(/\{/)  {|m|m}
			token(/\}/)  {|m|m}

			token(/Nil/) {|_| :nil_marker}
			token(/Return/)      {|m|m}
			token(/Print/)       {|m|m}
			token(/Send/)        {|m|m}
			token(/Move/)        {|m|m}
			token(/Click/)       {|m|m}
			token(/RightClick/)  {|m|m}
			token(/MiddleClick/) {|m|m}
			token(/DoubleClick/) {|m|m}
			token(/MouseDown/)   {|m|m}
			token(/MouseUp/)     {|m|m}
			token(/KeyDown/)     {|m|m}
			token(/KeyUp/)       {|m|m}
			token(/KeyStroke/)   {|m|m}

			token(/not/) {|_| :not} #change to "not"
			token(/and/) {|_| :and} #change to "and"
			token(/or/)  {|_| :or}  #change to "or"

			token(/;/)   {|_| :end_stmt} #change to ";"

			token(/>=/) {|m|m}
			token(/<=/) {|m|m}
			token(/!=/) {|m|m}
			token(/==/) {|m|m}

			token(/\+\=/)  {|m|m}
			token(/\-\=/)  {|m|m}
			token(/\*\=/)  {|m|m}
			token(/\/\/\=/){|m|m}
			token(/\/\=/)  {|m|m}
			token(/\^\=/)  {|m|m}
			token(/\%\=/)  {|m|m}

			token(/\+\+/)  {|m|m}
			token(/--/)    {|m|m}
			token(/\^\^/)  {|m|m}
			token(/\*\*/)  {|m|m}
			token(/\/\//)  {|m|m}

			token(/fun/) {|_| "fun"}

			token(/\d+/) {|m| m.to_i }

			token(/\s+/)

			token(/[a-zA-Z]+/) {|m| m}

			token(/./) {|m| m}



			# Highest level match
			start :program do
				match(:stmt_list){|a| a.evaluate()}
			end

			###########################################################
			#                       MATCHES                           #
			###########################################################
			rule :stmt_list do
				match(:stmt, :end_stmt, :stmt_list) {|a,_,b| Stmt_list.new(a,b)}
				match(:stmt, :end_stmt)             {|a,_|   Stmt_list.new(a, nil)}
				match(:stmt)                        {|a|   Stmt_list.new(a, nil)}

			end

			rule :stmt do
				match(:func_def)
				match(:return_stmt)
				match(:assignment_stmt)
				match(:augmented_assignment_stmt)
				match(:sleep_stmt)
				match(:if_stmt)
				match(:loop_stmt)
				match(:print_stmt)
				match(:send_stmt)
				match(:mouse_move_stmt)
				match(:mouse_click_stmt)
				match(:mouse_down_stmt)
				match(:mouse_up_stmt)
				match(:key_down_stmt)
				match(:key_up_stmt)
				match(:key_stroke_stmt)
				match(:expression_stmt)
			end


			rule :func_def do
				match("fun", :func_name, "(", :param_list,")","{",:stmt_list,"}"){|_,a,_,b,_,_,c,_|Func_def.new(a,b,c)}
				match("fun", :func_name, "(", ")", "{",:stmt_list,"}")           {|_,a,_,_,_,c,_|  Func_def.new(a,[],c)}
			end


			rule :param_list do
				match(:def_param, ",", :param_list){|a,_,b| [a]+b}
				match(:def_param)                  {|a|     [a]}
			end


			rule :def_param do
				match(:parameter, "=", :expression){|a,_,b| Def_parameter.new(a,b)}
				match(:parameter)               {|a|     Def_parameter.new(a,nil)}
			end


			rule :parameter do
				match(:identifier)
			end


			rule :func_name do
				match(:identifier)
			end

####################################################################################################

			# Most of these have to be matched more general, and insted controled in implementation eg insted of :identifier and :string, should be expression
			rule :print_stmt do
				match("Print", "(", :expression, ")"){|_,_,s,_| Print.new(s)}
			end

			rule :send_stmt do
				match("Send", "(", :string, ")"){|_, _, s, _|
					Send.new(s)
				}
				match("Send", "(", :identifier, ")"){|_,_,s,_| Send.new(s)}
			end

			rule :mouse_move_stmt do
				match("Move", "(", :a_expr, ",", :a_expr, ")"){|_, _, x, _, y, _| MouseMove.new(x, y)}
			end

			rule :mouse_click_stmt do
				match("Click", "(", ")")      {MouseClick.new("left")}
				match("RightClick", "(", ")") {MouseClick.new("right")}
				match("MiddleClick", "(", ")"){MouseClick.new("middle")}
				match("DoubleClick", "(", ")"){MouseClick.new("double")}
			end

			rule :mouse_down_stmt do
				match("MouseDown", "(", :identifier, ")"){|_, _, s, _| MouseDown.new(s)}
				match("MouseDown", "(", :string, ")")    {|_, _, s, _| MouseDown.new(s)
				}
			end

			rule :mouse_up_stmt do
				match("MouseUp", "(", :identifier, ")"){|_, _, s, _| MouseUp.new(s)}
				match("MouseUp", "(", :string, ")")    {|_, _, s, _| MouseUp.new(s)}
			end

			rule :key_down_stmt do
				match("KeyDown", "(", :identifier, ")",){|_, _, s, _|
					KeyDown.new(s)
				}
				match("KeyDown", "(", :string, ")",){|_, _, s, _|
					KeyDown.new(s)
				}
			end

			rule :key_up_stmt do
				match("KeyUp", "(", :identifier, ")",){|_, _, s, _|
					KeyUp.new(s)
				}
				match("KeyUp", "(", :string, ")",){|_, _, s, _|
					KeyUp.new(s)
				}
			end

			rule :key_stroke_stmt do
				match("KeyStroke", "(", :identifier, ")"){|_, _, k, _|
					KeyStroke.new(k)
				}
				match("KeyStroke", "(", :string, ")"){|_, _, k, _|
					KeyStroke.new(k)
				}
			end
####################################################################################################

			rule :if_stmt do
				match("if", :expression, "{", :stmt_list, "}", "else", "{", :stmt_list, "}"){|_, cond, _, body, _, _, _, else_body, _|	If_Else.new(cond, body, else_body)}
				match("if", :expression, "{", :stmt_list, "}")                              {|_, cond,_ , body, _|	                    If_Else.new(cond, body)	}
			end

			rule :loop_stmt do
				match("loop", :expression, "{", :stmt_list, "}") {|_,cond,_,body,_| Loop.new(cond, body) }
			end


			rule :sleep_stmt do
				match("Sleep", "(", :expression, ")"){|_, _, ms, _|	Sleep.new(ms)}
			end


			rule :return_stmt do
				match("Return", :expression_list){|_,a| Return_class.new( a )}
				match("Return")                  {|_|   Return_class.new(nil)}
			end


			rule :assignment_stmt do
				match(:target_list, '=', :expression_list) {|s, _, v| Assignment.new(s,lambda {|a, b| b }, v,false)}
			end


			rule :augmented_assignment_stmt do
				match(:target_list, :aug_op, :expression_list) {|s, op, t| Assignment.new(s,op, t,true)}
			end


			rule :aug_op do
				match("+=")  {|_| lambda {|a, b| a+b }}
				match("-=")  {|_| lambda {|a, b| a-b }}
				match("*=")  {|_| lambda {|a, b| a*b }}
				match("/=")  {|_| lambda {|a, b| a/b }}
				match("//=") {|_| lambda {|a, b| a=(a/b).floor}}
				match("^=")  {|_| lambda {|a, b| a**b }}
				match("%=")  {|_| lambda {|a, b| a%b }}
			end


			rule :target_list do
				match(:target, ",", :target_list) {|a,_,b| [a] + b}
				match(:target)                    {|a|     [a]}
			end


			rule :target do
				match(:identifier)
				end


			rule :expression_stmt do
				match(:expression_list)
			end


			rule :expression_list do
				match(:expression, "," ,:expression_list) {|a,_,b| [a] + b}
				match(:expression)                        {|a|     [a]}
			end

			rule :expression do
					match(:or_test)
			end

			rule :or_test do
				match(:and_test)
				match(:or_test, :or, :and_test){|a,_,b| OrTest.new(a,b)}
			end

			rule :and_test do
				match(:not_test)
				match(:and_test, :and, :not_test){|a,_,b| AndTest.new(a,b)}
			end

			rule :not_test do
				match(:not, :not_test){|_,a| NotTest.new(a)}
				match(:comparison)
			end

			rule :comparison do
				match(:a_expr, :comp_op, :a_expr){|a,op,b| Comparison.new(a,op,b)}
				match(:a_expr)
			end

			rule :comp_op do
				match(">")
				match("<")
				match("<=")
				match(">=")
				match("==")
				match("!=")
			end
			################ All math thingies can be united under one class (?)
			rule :a_expr do
				match(:m_expr)
				match(:a_expr, "-", :m_expr){|a,_,b| A_Expr.new(a,"-",b)}
				match(:a_expr, "+", :m_expr){|a,_,b| A_Expr.new(a,"+",b)}
			end

			rule :m_expr do
				match(:power)
				match(:m_expr, "/", :power) {|a,_,b| M_Expr.new(a,"/",b)}
				match(:m_expr, "*", :power) {|a,_,b| M_Expr.new(a,"*",b)}
				match(:m_expr, "%", :power) {|a,_,b| M_Expr.new(a,"%",b)}
				match(:m_expr, "//", :power){|a,_,b| M_Expr.new(a,"//",b)}
			end

			rule :power do
				match(:self_mod, "^", :power){|a,_,b| Power.new(a,b)}
				match(:self_mod)
			end

			rule :self_mod do
				match(:variable, :self_mod_op){|s,op| SelfModOp.new(s,op)}
				match(:primary)
			end

			rule :self_mod_op do
				match("++")
				match("--")
				match("**")
				match("^^")
			end


			rule :primary do
				match(:func_call)
				match(:atom)
			end



			rule :func_call do
				match( :identifier, "(", :argument_list, ")"){|a,_,b,_| Func_call.new(a,b)}
				match( :identifier, "(", ")")                {|a,_,_|   Func_call.new(a,[])}

			end

			rule :argument_list do
				match(:positional_arguments,",",:argument_list){|a,_,b| [a] + b}
				match(:positional_arguments)                   {|a|     [a]}
			end

			rule :positional_arguments do
				match(:expression)
			end


			rule :atom do
				match(:mouse_pos)
				match(:enclosure)
				match(:literal)
				match(:nil)
				match(:variable)
			end

			rule :mouse_pos do
				match("MousePos", "(", :string, ")"){|_, _, dimension, _| MousePos.new(dimension)} #should look for "x" or "y" insted of string
			end

			rule :variable do
				match(:identifier){|s| VariableValue.new(s)}
			end

			rule :identifier do
				match(/[a-zA-Z_]+/){|m|m}
			end

			rule :enclosure do
				match( "(", :stmt_list, ")") {|_,a,_| a} # :stmt_list should be :expression_list (have to make a class so that enclosure can handle :expression_list)
			end


			rule :literal do
				match(:bool)
				match(:string)
				match(:float)
				match(:integer)
			end


			rule :bool do
				match("True")  {|_| BoolClass.new(true)}
				match("False") {|_| BoolClass.new(false)}
			end


			rule :string do
				match(StringClass){|s| s}
			end

			rule :float do
				match(Integer, '.', Integer){|n,_,d|
					decPart = d.to_f/(10**(d.to_s.length)) #implementation should be moved to the classes initialize()

					result = n.to_f + decPart.to_f

					FloatClass.new(result)
				}
				match("-", Integer, '.', Integer){|_,n,_,d|
					decPart = d.to_f/(10**(d.to_s.length)) #implementation should be moved to the classes initialize()

					result = n.to_f + decPart.to_f

					FloatClass.new(-result)
				}
			end

			rule :integer do
				match(Integer)     {|i|   IntClass.new(i)}
				match("-", Integer){|_,i| IntClass.new(-i)}
			end

			rule :nil do
				match(:nil_marker){|_| Our_NilClass.new()}
			end
		end
	end

	def done(str)
		["quit","exit","bye",""].include?(str.chomp)
	end

	def getVars(name)
		get_variable_value(name)
	end

	def getInput
		print("[automation] ")
		str = gets
		if done(str) then
			puts("Bye.")
		else
			puts("=> #{@automatoParser.parse(str)}")
			getInput
		end
	end

	def log(state = true)
		if state
			@automatoParser.logger.level = Logger::DEBUG
		else
			@automatoParser.logger.level = Logger::WARN
		end
	end
end




# Put "unofficial" tests here. When done, extend tests.rb and run to make sure everything works.
if __FILE__==$0
	if ARGV[0] == "dev"
		# Parse code here for small tests.
		a = Automato.new
		a.log(false)

		$use_scope= true #togles all scope off, regardless what the other are
		$use_scope_if_else = false #togles if_else stmt scope
		$use_scope_loop = true #togles loop stmt scope
		$use_scope_functions = true #togles function scope

		#a.automatoParser.parse("a = 10; loop a > 1{ a++;Print(a); if a > 100{ Return Nil}}") #get this to work
		#why arent return returning from the loop
		#a.automatoParser.parse("a = 0; loop a < 10 {a++}")
		#a.automatoParser.parse("       loop a < 10{a++}")
		#a.automatoParser.parse("if 2>1{Return 1}")

		#a.automatoParser.parse("fun foo(){1,2,3}")
		#a.automatoParser.parse("fun bar(){4}")
		#a.automatoParser.parse("a,b,c,d = foo(), bar()")

		#a.automatoParser.parse("a=1")
		#a.automatoParser.parse("b=a++")
		#a.automatoParser.parse("fun foo(var){var+2}")
		#a.automatoParser.parse("a,b,c,d = 1,a+2,foo(a+1),")

		#a.automatoParser.parse("fun foo(){Return 10}; fun bar(a=foo()){Return a,1}; c,d=bar(Nil)")


		#a.automatoParser.parse("a,b,c = 1,1,d")
		#a.automatoParser.parse("a,b  += 2,c")

		a.automatoParser.parse("Move(200, 200)")
		
		print "Variables: ", $global_variables, "\n"
		print "Functions: ", $global_functions, "\n"
	elsif ARGV[0] != nil
		a = Automato.new
		a.log(false)

		fileName = ARGV[0]
		f = File.read(fileName)

		a.automatoParser.parse(f)
	else
		puts "File not found. Usage: ruby automato.rb <FILENAME>"
	end
end

# make scope for each cunstruct optional

