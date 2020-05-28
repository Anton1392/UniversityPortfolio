def n_times(n, &block)
    1.upto(n) do
        block.call()
    end
end

class Repeat
    def initialize(count)
        @count = count
    end

    def each(&block)
        1.upto(@count) do
            block.call()
        end
    end
end
