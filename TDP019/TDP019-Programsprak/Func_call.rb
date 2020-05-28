class Func_call
	def initialize(func_name, recived_param_list)
		@func_name = func_name
		@recived_param_list = recived_param_list
	end

	def evaluate()
		method = get_func_info(@func_name)
		if method == nil
			error_print("#{@func_name}, do not exist")
			return nil
		end
		increase_scope() unless not $use_scope_functions

		if method[0].size != @recived_param_list.size
			error_print("#{@func_name} expected #{method[0].size} arguments, recived #{@recived_param_list.size}")
			return nil
		end
		apply_params_on_method_arguments(@recived_param_list, method[0])

		to_ret = method[1].evaluate()

		if to_ret.class != Array
			to_ret = [to_ret]
		end

		procesed_ret = []
		for i in 0..to_ret.size-1
			if to_ret[i].class != VariableValue
				if to_ret[i].class != Func_call
					procesed_ret += [to_ret[i]]
				else
					procesed_ret += [to_ret[i].evaluate()]
				end
			else
				procesed_ret += [to_ret[i].evaluate()]
			end
		end
		decrease_scope()
		return procesed_ret
	end




	private
	def apply_params_on_method_arguments(recived_params, method_arguments)
		identifier_list = []
		expr_list = []
		for i in 0..recived_params.size-1
			identifier_list += [method_arguments[i].keys[0]]

			if recived_params[i].class == Our_NilClass
				if method_arguments[i].values[0] != nil
					expr_list += [method_arguments[i].values[0]]
				else
					error_print("#{@func_name} varible #{method_arguments[i].keys[0]} has no defult value")
				end
			else
				expr_list += [recived_params[i]]
			end
		end
		Assignment.new(identifier_list,lambda {|a, b| b }, expr_list,false).evaluate()
	end

	def process_recived_params(param_list)
		to_ret = []
		for param in param_list
			to_ret += [param.evaluate()]
		end
		return to_ret
	end
end
