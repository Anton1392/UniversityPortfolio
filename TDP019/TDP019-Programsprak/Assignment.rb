class Assignment
	def initialize(target_list, operator, expr_list,target_have_to_exist)
		@target_list = target_list
		@operator = operator
		@expr_list = expr_list
		@target_have_to_exist = target_have_to_exist
		@temp_vars = {}
	end


	def evaluate()
		offset = 0
		func_calls = 0
		for i in 0..@expr_list.size-1
			if @target_list.size < @expr_list.size + offset - func_calls
				error_print("Asignment #{@target_list} recived to many expressions for too few targets")
				return nil
			end

			if @expr_list[i].class != VariableValue
				if @expr_list[i].class != Func_call
					add_temp_var(@target_list[i+offset-func_calls], @expr_list[i].evaluate())
				else
					recived = @expr_list[i].evaluate()
					if recived != nil
						for j in 0..recived.size-1
							if @target_list.size < @expr_list.size + offset - func_calls
								error_print("#{@target_list} asigned with function that generated to many expressions")
								return nil
							end
							if recived[j].class != VariableValue
								add_temp_var(@target_list[i+offset-func_calls], recived[j])
							else
								value = use_varible(recived[j])
								if value.class != nil
									add_temp_var(@target_list[i+offset-func_calls], value)
								else
									return nil
								end
							end
							offset +=1
						end
					func_calls +=1
					end
				end
			else
				value = use_varible(@expr_list[i])
				if value.class != nil
					add_temp_var(@target_list[i+offset-func_calls], value)
				else
					return nil
				end
			end
		end
		if @target_list.size > @expr_list.size + offset
			error_print("Asignment #{@target_list} recived too few expressions in assignment")
		end
		make_temp_global()
	end

	private
	def use_varible(varible)
		if varible.evaluate() != nil #if in global vars
			return varible.evaluate()
		else
			if @temp_vars[varible.evaluate("set")] != nil #if in temp vars
				return @temp_vars[varible.evaluate("set")]
			else
				error_print("VARBLE \"#{varible.evaluate("set")}\" DO NOT EXIST")
			end
		end
	end

	def get_taret_value(varible)
		if @target_have_to_exist
			if get_variable_value(varible) != nil #if in global vars
				return get_variable_value(varible)
			else
				error_print("VARBLE \"#{varible}\" DO NOT EXIST")
				return nil
			end
		else
			return 0
		end
	end

	def add_temp_var(target,modifying_val)
		if modifying_val == nil and @target_have_to_exist
			return nil
		else
			if get_taret_value(target) == nil
				return nil
			else
				@temp_vars[target] = @operator.call(get_variable_value(target),modifying_val)
			end
		end
	end


	def ger_temp_vars()
		@temp_vars
	end

	def make_temp_global()
		@temp_vars.each do |key,value|
			set_variable(key, value)
		end
	end
end
