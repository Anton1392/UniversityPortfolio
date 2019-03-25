// This test program uses a test framework supporting TDD and BDD.
// You are not required to use the framework, but encouraged to.
// Documentation:
// https://github.com/philsquared/Catch/blob/master/docs/tutorial.md

// You ARE however required to implement all test cases outlined here,
// even if you do it by way of your own function for each case.  You
// are recommended to solve the cases in order, and rerun all tests
// after you modify your code.

// This define lets Catch create the main test program
// (Must be in only one place!)
#include "catch.hpp"
#include "linked_list.h"
#include <iostream>

#include <random>

using namespace std;

//=======================================================================
// Test cases
//=======================================================================
// Solve one TEST_CASE or WHEN at a time!
//
// Move this comment and following #if 0 down one case at a time!
// Make sure to close any open braces before this comment.
// The #if 0 will disable the rest of the file.

TEST_CASE( "Create an empty list" )
{
    Sorted_List l{};

    REQUIRE( l.is_empty() );
    REQUIRE( l.size() == 0 );
}

TEST_CASE( "Insert an item in an empty list" )
{
    Sorted_List l{};

    l.insert(2);

    REQUIRE_FALSE( l.is_empty() );
    REQUIRE_FALSE( l.size() == 0 );

}

TEST_CASE( "Remove out of range index of a list" )
{
    Sorted_List l{};
    l.insert(2);
    l.remove_index(5);
}

TEST_CASE( "Remove out of range index of an empty list" )
{
    Sorted_List l_empty{};
    l_empty.remove_index(5);
    l_empty.remove_index(0);
}




SCENARIO( "Empty lists" )
{

    GIVEN( "An empty list" )
    {
	Sorted_List l{};

	REQUIRE( l.is_empty() );
	REQUIRE( l.size() == 0 );

	WHEN( "an item is inserted" )
	{
	    // insert an item
        int insert_val = 2;
        l.insert(insert_val);

	    THEN( "the size increase and the item is first in the list" )
	    {
		REQUIRE_FALSE( l.is_empty() );
		REQUIRE( l.size() == 1 );
		REQUIRE( l.index_value(0) == insert_val );
	    }
	}

	WHEN( "an item is removed" )
	{
        l.insert(2);
        l.remove_index(0);
	    // remove an item

	    THEN( "the list is still empty" )
	    {
		// add your REQUIRE statements
        REQUIRE( l.is_empty() );
		REQUIRE( l.size() == 0 );
	    }
	}

	WHEN( "the list is copied to a new list" )
	{
	    // copy your list to a new variable (copy constructor)
        Sorted_List l_copy{l};

	    THEN( "the new list is also empty" )
	    {
		// add your REQUIRE statements
        REQUIRE( l_copy.is_empty() );
        REQUIRE( l_copy.size() == 0 );
	    }
	}

	WHEN( "the list is copied to an existing non-empty list" )
	{
	    // create and fill a list to act as the existing list
        Sorted_List existing_list{};
        existing_list.insert(3);
        existing_list.insert(9);
        existing_list.insert(5);

        Sorted_List empty_list{};

	    // copy (assign) your empty list to the existing
        existing_list = empty_list;

	    THEN( "the existing list is also empty" )
	    {
		// add your REQUIRE statements
        REQUIRE( existing_list.is_empty() );
        REQUIRE( existing_list.size() == 0 );
	    }

	}
    }
}

SCENARIO( "Single item lists" )
{

    GIVEN( "A list with one item in it" )
    {
        Sorted_List l{};
        l.insert(5);

	// create the given scenario

	WHEN( "a smaller item is inserted" )
	{
        l.insert(2);
	    THEN( "the inserted value is stored at index 0" )
	    {
            REQUIRE_FALSE( l.is_empty() );
            REQUIRE( l.size() == 2 );
            REQUIRE( l.index_value(0) == 2);
            REQUIRE( l.index_value(1) == 5);
	    }
	}
	WHEN( "a larger item is inserted" )
	{
        l.insert(1000);
	    THEN( "the inserted value is stored at index 1" )
	    {
            REQUIRE_FALSE( l.is_empty() );
            REQUIRE( l.size() == 2 );
            REQUIRE( l.index_value(0) == 5);
            REQUIRE( l.index_value(1) == 1000);
	    }
	}
	WHEN( "an item is removed" )
	{
        l.remove_index(0);
	    THEN( "the list becomes empty" )
	    {
            REQUIRE( l.is_empty() );
            REQUIRE( l.size() == 0 );
	    }
	}
	WHEN( "the list is copied to a new list" )
	{
        Sorted_List l_copy{l};
	    THEN( "the sizes and values stored are equal" )
	    {
            REQUIRE( l.size() == l_copy.size());
            REQUIRE( l.index_value(0) == l.index_value(0));
	    }
	}
	WHEN( "the list is copied to an existing non-empty list" )
	{
        Sorted_List list_overwritten{};
        list_overwritten.insert(1);

        list_overwritten = l;
	    THEN( "the sizes and values stored are equal" )
	    {
            REQUIRE(list_overwritten.size() == l.size());
            REQUIRE(list_overwritten.index_value(0) == l.index_value(0));
	    }
	}
    }
}

SCENARIO( "Multi-item lists" )
{

    GIVEN( "A list with five items in it" )
    {
        Sorted_List l{};
        l.insert(1);
        l.insert(5);
        l.insert(10);
        l.insert(20);
        l.insert(50);
	// create the given scenario and all THEN statements
	// and all REQUIRE statements

	WHEN( "an item smaller than all other is inserted" )
	{
        l.insert(0);
        THEN( "the value is stored at index 0")
        {
            REQUIRE(l.index_value(0) == 0);
        }
	}
	WHEN( "an item larger than all other is inserted" )
	{
        l.insert(100);
        THEN( "the value is stored at 5" )
        {
            REQUIRE(l.index_value(5) == 100);
        }
	}
	WHEN( "an item smaller than all but one item is inserted" )
	{
        l.insert(2);
        THEN( "the value is stored at index 1")
        {
            REQUIRE(l.index_value(1) == 2);
        }
	}
	WHEN( "an item larger than all but one item is inserted" )
	{
        l.insert(40);
        THEN( "the value is stored at index 4")
        {
            REQUIRE(l.index_value(4) == 40);
        }
	}
	WHEN( "an item is removed" )
	{
        l.remove_index(0);
        THEN(" the size is 4")
        {
            REQUIRE(l.size() == 4);
        }
	}
	WHEN( "all items are removed" )
	{
        l.remove_all();
        THEN ( "size is 0 and is_empty is true" )
        {
            REQUIRE(l.size() == 0);
            REQUIRE(l.is_empty());
        }
	}
	WHEN( "the list is copied to a new list" )
	{
        Sorted_List l_copy{l};
        THEN( "sizes and values stored are equal" )
        {
            REQUIRE(l.size() == l_copy.size());
            REQUIRE(l.index_value(0) == l_copy.index_value(0));
            REQUIRE(l.index_value(1) == l_copy.index_value(1));
            REQUIRE(l.index_value(2) == l_copy.index_value(2));
            REQUIRE(l.index_value(3) == l_copy.index_value(3));
            REQUIRE(l.index_value(4) == l_copy.index_value(4));
        }
	}
	WHEN( "the list is copied to an existing non-empty list" )
	{
        Sorted_List l_overwritten{};
        l_overwritten.insert(6);
        l_overwritten.insert(7);
        l_overwritten.insert(8);
        l_overwritten = l;
        THEN ( "size and values stored are equal" )
        {
            REQUIRE(l.size() == l_overwritten.size());
            REQUIRE(l.index_value(0) == l_overwritten.index_value(0));
            REQUIRE(l.index_value(1) == l_overwritten.index_value(1));
            REQUIRE(l.index_value(2) == l_overwritten.index_value(2));
            REQUIRE(l.index_value(3) == l_overwritten.index_value(3));
            REQUIRE(l.index_value(4) == l_overwritten.index_value(4));

        }
	}
    }
}

SCENARIO( "Lists can be copied" )
{

    GIVEN( "A list with five items in it, and a new copy of that list" )
    {
        Sorted_List l{};
        l.insert(1);
        l.insert(5);
        l.insert(10);
        l.insert(20);
        l.insert(50);
        Sorted_List l_copy{l};

	WHEN( "the original list is changed" )
	{
        l.remove_all();
        l.insert(1);
	    THEN( "the copy remain unmodified" )
	    {
            REQUIRE(l_copy.size() == 5);
            REQUIRE(l_copy.index_value(0) == 1);
            REQUIRE(l_copy.index_value(1) == 5);
            REQUIRE(l_copy.index_value(2) == 10);
            REQUIRE(l_copy.index_value(3) == 20);
            REQUIRE(l_copy.index_value(4) == 50);
	    }
	}

	WHEN( "the copied list is changed" )
	{
        l_copy.remove_all();
        l_copy.insert(2);
	    THEN( "the original remain unmodified" )
	    {
            REQUIRE(l.size() == 5);
            REQUIRE(l.index_value(0) == 1);
            REQUIRE(l.index_value(1) == 5);
            REQUIRE(l.index_value(2) == 10);
            REQUIRE(l.index_value(3) == 20);
            REQUIRE(l.index_value(4) == 50);
	    }
	}
    }
}

 // TODO: Broken memcheck
SCENARIO( "Lists can be heavily used" )
{

    GIVEN( "A list with 1000 random items in it" )
    {

	// create the given list with 1000 random items
    Sorted_List l{};
	std::random_device rd;
	std::uniform_int_distribution<int> uniform(1,1000);

	for (int i{0}; i < 1000; ++i)
	{
	    int random { uniform(rd) }; // generate a random number
	    // insert into list
        l.insert(random);
	}

	WHEN( "the list have 1000 random numbers inserted" )
	{
        for (int i{0}; i < 1000; ++i)
    	{
    	    int random { uniform(rd) }; // generate a random number
    	    // insert into list
            l.insert(random);
    	}
        THEN( "the list have 2000 items in ascending order" )
        {
        // THEN the list have 2000 items in correct order
	    // (assumes unique inserts or duplicates allowed)
            REQUIRE(l.size() == 2000);
            for (int i{0}; i < 1999; ++i)
        	{
        	    REQUIRE(l.index_value(i) <= l.index_value(i+1));
        	}
        }
	}

	WHEN( "the list have 1000 random numbers removed" )
	{
        for (int i{0}; i < 1000; ++i)
        {
            std::uniform_int_distribution<int> uniform(0,l.size()-1);
            int random { uniform(rd) }; // generate a random number
            l.remove_index(random);

        }
        THEN( "list is empty and size is 0" )
        {
        // THEN the list is empty
        // (assumes successful removes)
            REQUIRE(l.size() == 0);
            REQUIRE(l.is_empty());
        }
	}
    }
}

Sorted_List trigger_move(Sorted_List l)
{
    l.insert(40);
    l.insert(400);
    l.remove_index(1);
    return l;
}

SCENARIO( "Lists can be passed to functions" )
{

    GIVEN( "A list with 5 items in it" )
    {

	Sorted_List given{};
    given.insert(1);
    given.insert(20);
    given.insert(50);
    given.insert(100);
    given.insert(120);
	// insert 5 items

	WHEN( "the list is passed to trigger_move()" )
	{

	    Sorted_List l{ trigger_move(given) };

	    THEN( "the given list remain and the result have the change" )
	    {
            REQUIRE(given.size() == 5);
            REQUIRE(given.index_value(0) == 1);
            REQUIRE(given.index_value(1) == 20);
            REQUIRE(given.index_value(2) == 50);
            REQUIRE(given.index_value(3) == 100);
            REQUIRE(given.index_value(4) == 120);

            REQUIRE(l.size() == 6);
            REQUIRE(l.index_value(0) == 1);
            REQUIRE(l.index_value(1) == 40);
            REQUIRE(l.index_value(2) == 50);
            REQUIRE(l.index_value(3) == 100);
            REQUIRE(l.index_value(4) == 120);
            REQUIRE(l.index_value(5) == 400);
	    }
	}
    }
}

// In addition you must of course verify that the list is printed
// correct and that no memory leeks occur during use. You can solve
// the printing part on your own. Here's how to run the (test) program
// when you check for memory leaks:

// You must of course verify that no memory leaks occur during use.
// To do so, an external program must be used to track what memory
// is allocated and free'd, you can run such a program like so:
//
// $ valgrind --tool=memcheck a.out

// Finally you need to check that you can do all operations that make
// sense also on a immutable list (eg all operations but insert):
int use_const_list(Sorted_List const& l)
{
    // perform each operation that do not modify the list here
    try
    {
        l.is_empty();
        l.size();
        l.index_value(0);
        l.index_value(1);
        l.index_value(2);
        l.index_value(3);
        l.index_value(4);
    }
    catch(...)
    {
        return 1;
    }
    return 0;
    //return l; (??? TODO: void och return var deklarerade ???)
}
TEST_CASE( "Constant list reference allows all constant functions to be called" )
{
    Sorted_List given{};
    given.insert(1);
    given.insert(20);
    given.insert(50);
    given.insert(100);
    given.insert(120);
    REQUIRE(use_const_list(given) == 0);
}
