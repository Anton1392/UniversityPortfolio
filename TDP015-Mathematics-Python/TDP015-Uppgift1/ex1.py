import itertools

class Exp(object):
    """A Boolean expression.

    A Boolean expression is represented in terms of a *reserved symbol* (a
    string) and a list of *subexpressions* (instances of the class `Exp`).
    The reserved symbol is a unique name for the specific type of
    expression that an instance of the class represents. For example, the
    constant `True` uses the reserved symbol `1`, and logical and uses `∧`
    (the Unicode symbol for conjunction). The reserved symbol for a
    variable is its name, such as `x` or `y`.

    Attributes:
        sym: The reserved symbol of the expression (a string).
        sexps: The list of subexpressions (instances of the class `Exp`).
    """

    def __init__(self, sym, *sexps):
        """Constructs a new expression.

        Args:
            sym: The reserved symbol for this expression.
            sexps: The list of subexpressions.
        """
        self.sym = sym
        self.sexps = sexps

    def value(self, assignment):
        """Returns the value of this expression under the specified truth
        assignment.

        Args:
            assignment: A truth assignment, represented as a dictionary
            that maps variable names to truth values.

        Returns:
            The value of this expression under the specified truth
            assignment: either `True` or `False`.
        """
        raise ValueError()

    def variables(self):
        """Returns the (names of the) variables in this expression.

        Returns:
           The names of the variables in this expression, as a set.
        """
        variables = set()
        for sexp in self.sexps:
            variables |= sexp.variables()
        return variables

class Var(Exp):
    """A variable."""

    def __init__(self, sym):
        super().__init__(sym)

    def value(self, assignment):
        assert len(self.sexps) == 0
        return assignment[self.sym]

    def variables(self):
        assert len(self.sexps) == 0
        return {self.sym}

class Nega(Exp):
    """Logical not."""
    def __init__(self, sexp1):
        super().__init__('¬', sexp1)

    def value(self, assignment):
        assert len(self.sexps) == 1
        return not self.sexps[0].value(assignment)

    # TODO: Complete this class

    # DONE

class Conj(Exp):
    """Logical and."""

    def __init__(self, sexp1, sexp2):
        super().__init__('∧', sexp1, sexp2)

    def value(self, assignment):
        assert len(self.sexps) == 2
        return \
            self.sexps[0].value(assignment) and \
            self.sexps[1].value(assignment)

class Disj(Exp):
    """Logical or."""
    def __init__(self, sexp1, sexp2):
        super().__init__('∨', sexp1, sexp2)

    def value(self, assignment):
        assert len(self.sexps) == 2
        return \
            self.sexps[0].value(assignment) or \
            self.sexps[1].value(assignment)

    # TODO: Complete this class

    # DONE

class Impl(Exp):
    """Logical implication."""

    def __init__(self, sexp1, sexp2):
        super().__init__('→', sexp1, sexp2)

    def value(self, assignment):
        assert len(self.sexps) == 2
        if(self.sexps[0].value(assignment) == False):
            return True
        else:
            return self.sexps[1].value(assignment)

    # TODO: Complete this class

    # DONE

class Equi(Exp):
    """Logical equivalence."""

    def __init__(self, sexp1, sexp2):
        super().__init__('↔', sexp1, sexp2)

    def value(self, assignment):
        assert len(self.sexps) == 2
        return self.sexps[0].value(assignment) == self.sexps[1].value(assignment)

    # TODO: Complete this class

    # DONE

def assignments(variables):
    """Yields all truth assignments to the specified variables.

    Args:
        variables: A set of variable names.

    Yields:
        All truth assignments to the specified variables. A truth
        assignment is represented as a dictionary mapping variable names to
        truth values. Example:

        {'x': True, 'y': False}
    """
    var_names = list(variables) # Convert set to list, easier to iterate.
    var_names.sort()

    # List of all combinations of truth assignments
    combinations = list(itertools.product([False, True], repeat=len(var_names)))

    # Bind to variable names, construct a list of dicts
    l = []
    for comb in combinations:
        d = {} # Empty dict
        for i in range(0, len(comb)):
            d[var_names[i]] = comb[i]
        l.append(d)

    return l

    # TODO: Complete this function. Use the itertools module!

    # DONE (?)
    # yields vs returns is a little confusing here, what purpose would yield serve?
    # We want all combinations at once, and not one at a time here, so returns seems to fit better.

def satisfiable(exp):
    """Tests whether the specified expression is satisfiable.

    An expression is satisfiable if there is a truth assignment to its
    variables that makes the expression evaluate to true.

    Args:
        exp: A Boolean expression.

    Returns:
        A truth assignment that makes the specified expression evaluate to
        true, or False in case there does not exist such an assignment.
        A truth assignment is represented as a dictionary mapping variable
        names to truth values.
    """
    # TODO: Complete this function
    # DONE
    variables = exp.variables()
    assigns = assignments(variables)
    for assignment in assigns:
        if exp.value(assignment):
            return True
    return False

def tautology(exp):
    """Tests whether the specified expression is a tautology.

    An expression is a tautology if it evaluates to true under all
    truth assignments to its variables.

    Args:
        exp: A Boolean expression.

    Returns:
        True if the specified expression is a tautology, False otherwise.
    """
    # TODO: Complete this function
    # DONE
    variables = exp.variables()
    assigns = assignments(variables)
    for assignment in assigns:
        if not exp.value(assignment):
            return False
    return True

def equivalent(exp1, exp2):
    """Tests whether the specified expressions are equivalent.

    Two expressions are equivalent if they have the same truth value under
    each truth assignment.

    Args:
        exp1: A Boolean expression.
        exp2: A Boolean expression.

    Returns:
        True if the specified expressions are equivalent, False otherwise.
    """
    # TODO: Complete this function
    # DONE
    assert exp1.variables() == exp2.variables()
    variables = exp1.variables()
    assigns = assignments(variables)
    for assignment in assigns:
        if not exp1.value(assignment) == exp2.value(assignment):
            return False
    return True


def test1():
    a = Var('a')
    b = Var('b')
    c = Var('c')
    exp1 = Impl(Impl(a, b), c)
    exp2 = Conj(Disj(a, c), Disj(Nega(b), c))
    return equivalent(exp1, exp2)

def test_nega(val):
    print("\nTest Nega")
    values = {'a': val}
    a = Var('a')
    exp_neg = Nega(a)

    res = exp_neg.value(values) #Returns opposite of a, hopefully.
    print("Input values: {}".format(val))
    print("Result: {}".format(res))

def test_disj(val, val2):
    print("\nTest Disj")
    values = {'a': val, 'b': val2}
    a = Var('a')
    b = Var('b')
    exp_disj = Disj(a, b)

    res = exp_disj.value(values)
    print("Input values: {} {}".format(val, val2))
    print("Result: {}".format(res))

def test_impl(val, val2):
    print("\nTest Impl")
    values = {'a': val, 'b': val2}
    a = Var('a')
    b = Var('b')
    exp_impl = Impl(a, b)

    res = exp_impl.value(values)
    print("Input values: {} {}".format(val, val2))
    print("Result: {}".format(res))

def test_equi(val, val2):
    print("\nTest Equi")
    values = {'a': val, 'b': val2}
    a = Var('a')
    b = Var('b')
    exp_equi = Equi(a, b)

    res = exp_equi.value(values)
    print("Input values: {} {}".format(val, val2))
    print("Result: {}".format(res))

def test_satisfiable(exp):
    print("\nTest Satisfiable")
    variables = exp.variables()
    assigns = assignments(variables)
    for assignment in assigns:
        print(assignment)
        print(exp.value(assignment))

    print("Result: {}".format(satisfiable(exp)))

def test_tautology(exp):
    print("\nTest Tautology")
    variables = exp.variables()
    assigns = assignments(variables)
    for assignment in assigns:
        print(assignment)
        print(exp.value(assignment))

    print("Result: {}".format(tautology(exp)))

def test_equivalent(exp1, exp2):
    print("\nTest Equivalent")
    assert exp1.variables() == exp2.variables()
    variables = exp1.variables()
    assigns = assignments(variables)
    for assignment in assigns:
        print(assignment)
        print(exp1.value(assignment))
        print(exp2.value(assignment))

    print("Result: {}".format(equivalent(exp1, exp2)))

if __name__ == "__main__":
    test_nega(False)
    test_nega(True)

    test_disj(False, False)
    test_disj(True, False)
    test_disj(False, True)
    test_disj(True, True)

    test_impl(False, False)
    test_impl(False, True)
    test_impl(True, False)
    test_impl(True, True)

    test_equi(False, False)
    test_equi(False, True)
    test_equi(True, False)
    test_equi(True, True)

    a = Var('a')
    b = Var('b')
    exp = Disj(a,b)
    exp2 = Disj(b,a)

    test_satisfiable(exp)
    test_tautology(exp)
    test_equivalent(exp, exp2)

    exp3 = Conj(a, Nega(a))
    test_satisfiable(exp3) # Shouldn't be satisfiable.
