def get_rules
    additive_rules = {
        "@car == 'BMW'" => 5,
        "@car == 'Citroen'" => 4,
        "@car == 'Fiat'" => 3,
        "@car == 'Ford'" => 4,
        "@car == 'Mercedes'" => 5,
        "@car == 'Nissan'" => 4,
        "@car == 'Opel'" => 4,
        "@car == 'Volvo'" => 5,

        "@postal_code == '58937'" => 9,
        "@postal_code == '58726'" => 5,
        "@postal_code == '58647'" => 3,

        "@years_licensed >= 0 && @years_licensed <= 1" => 3,
        "@years_licensed >= 2 && @years_licensed <= 3" => 4,
        "@years_licensed >= 4 && @years_licensed <= 15" => 4.5,
        "@years_licensed >= 16 && @years_licensed <= 99" => 5,

        "@gender == 'M'" => 1,
        "@gender == 'F'" => 1,

        "@age >= 18 && @age <= 20" => 2.5,
        "@age >= 21 && @age <= 23" => 3,
        "@age >= 24 && @age <= 26" => 3.5,
        "@age >= 27 && @age <= 29" => 4,
        "@age >= 30 && @age <= 39" => 4.5,
        "@age >= 40 && @age <= 64" => 5,
        "@age >= 65 && @age <= 70" => 4,
        "@age >= 71 && @age <= 99" => 3


    }

    multiplicative_rules = {
        "@gender == 'M' && @years_licensed < 3" => 0.9,
        "@car == 'Volvo' && @postal_code[0,2] == '58'" => 1.2
    }

    return additive_rules, multiplicative_rules
end
