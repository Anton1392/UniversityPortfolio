#ifndef TRIMINO_H
#define TRIMINO_H

#include <vector>

// snyggt med en klass!

class Trimino
{
    public:
        Trimino(int,int,int);
        bool is_valid();
        void print();
    private:
        int vector_next(int const) const;
        std::vector<int> values{};
};

#endif
