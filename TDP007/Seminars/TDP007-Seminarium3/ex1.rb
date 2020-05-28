class Person
    attr_accessor :car, :postal_code, :years_licensed, :gender, :age
    def initialize(car, postal_code, years_licensed, gender, age)
        @car = car
        @postal_code = postal_code
        @years_licensed = years_licensed
        @gender = gender
        @age = age
    end

    def evaluate_policy(policy_file_name)
        grade = 0.0

        # Methods were carried over, lone variables were not.
        self.instance_eval(File.read(policy_file_name))
        additive_rules, multiplicative_rules = get_rules

        # puts additive_rules, multiplicative_rules

        additive_rules.each do |k, v|
            if self.instance_eval(k)
                grade += v
            end
        end

        multiplicative_rules.each do |k, v|
            if self.instance_eval(k)
                grade *= v
            end
        end

        return grade
    end
end
