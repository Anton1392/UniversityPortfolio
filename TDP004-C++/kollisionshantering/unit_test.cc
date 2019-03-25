#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

// graphics library
#include <SFML/Graphics.hpp>

#include "aabb.h"

using namespace std;

// constants in this file
namespace
{
    int const screen_width  { 640 };
    int const screen_height { 480 };
}

// use a namespace since we want to minimize the risk
// of name conflicts
namespace test
{   
    // used to represent a point on the screen
    struct Dot
    {

        // Convert this Dot to Point
        Point to_point() const;

        // Draw this Dot to 'target' with color 'color'
        void draw(sf::RenderTarget & target, sf::Color color) const;

        int x { };
        int y { };
    };

    // used to represent a box on the screen
    struct Box
    {

        // convert this Box to AABB
        AABB to_aabb() const;
        // convert the top left corner of this Box to a Point
        Point to_point() const;

        // Draw this Box to 'target' with color 'color'
        // if 'filled' is true then the box is filled,
        // otherwise it is drawn with an outline
        void draw(sf::RenderTarget & target, sf::Color color,
                  bool filled = false) const;

        // Draw this Box with a dashed outline to 'target'
        // with color 'color'
        void draw_dashed(sf::RenderTarget & target, sf::Color color) const;

        int x      { };
        int y      { };
        int width  { };
        int height { };
    };

    // This function read, perform and render the next testcase
    // The testcase is read from 'is' and rendered to 'target'
    bool handle_next(sf::RenderTarget & target, istream & is);

    // These functions read all necessary data from 'is' to perform
    // the corresponding type of test. The result is rendered to 'target'
    bool handle_contain         (sf::RenderTarget & target, istream & is);
    bool handle_intersect       (sf::RenderTarget & target, istream & is);
    bool handle_will_not_collide(sf::RenderTarget & target, istream & is);
    bool handle_collision_point (sf::RenderTarget & target, istream & is);

    // This function draws the result bar to 'target'
    // if result is true than the result bar is green
    // otherwise it is red.
    void draw_result(sf::RenderTarget & target, bool result);

    // This function converts the AABB 'source' into a Box.
    // Note: Since it is not guaranteed that we can retrieve
    // the corners of 'source' we have to calculate them.
    Box aabb_to_box(AABB const & source);
}

/**** test::Dot implementation ****/

Point test::Dot::to_point() const
{
    return Point { x, y };
}

void test::Dot::draw(sf::RenderTarget & target, sf::Color color) const
{
    sf::RectangleShape shape { sf::Vector2f { 4.0f, 4.0f } };
    // SFML uses floats when working with coordinates, so
    // we have to convert all coordinates to floats.
    shape.setPosition(
        sf::Vector2f {
            static_cast<float>(x-2),
            static_cast<float>(y-2)
    });
    shape.setFillColor(color);
    target.draw(shape);
}

/**** test::Box implementation ****/

AABB test::Box::to_aabb() const
{
    return AABB { y, x, y + height - 1, x + width - 1 };
}

Point test::Box::to_point() const
{
    return Point { x, y };
}

void test::Box::draw(sf::RenderTarget & target,
                     sf::Color color, bool filled) const
{
    sf::RectangleShape shape {
        sf::Vector2f {
            static_cast<float>(width),
            static_cast<float>(height) }
    };
    shape.setPosition(
        sf::Vector2f {
            static_cast<float>(x),
            static_cast<float>(y)
    });
    if ( filled )
    {
        shape.setFillColor(color);
    }
    else
    {
        shape.setFillColor(sf::Color::Transparent);
        shape.setOutlineColor(color);
        // negative outline thickness means that
        // it is drawn inside the box.
        shape.setOutlineThickness(-2.0f);
    }
    target.draw(shape);
}

// This function draws each dash manually since SFML
// has no built in support for drawing dashed lines with thickness.
void test::Box::draw_dashed(sf::RenderTarget & target, sf::Color color) const
{
    // this variable determines how wide each dash is
    int const dash_size { 2 };
    sf::RectangleShape shape {
        sf::Vector2f { static_cast<float>(dash_size), 2.0f }
    };
    shape.setFillColor(color);
    
    // draw all horizontal line segments
    for ( int dx { 0 }; dx + dash_size <= width; dx += 2*dash_size )
    {
        shape.setPosition(sf::Vector2f {
                static_cast<float>(x + dx),
                static_cast<float>(y)
        });
        target.draw(shape);
        shape.setPosition(sf::Vector2f {
                static_cast<float>(x + dx),
                static_cast<float>(y + height - dash_size)
        });
        target.draw(shape);
    }

    // draw all vertical line segments
    sf::Vector2f prev_size { shape.getSize() };
    std::swap(prev_size.x, prev_size.y);
    shape.setSize(prev_size);
    
    for ( int dy { 0 }; dy + dash_size <= height; dy += 2*dash_size )
    {
        shape.setPosition(sf::Vector2f {
                static_cast<float>(x),
                static_cast<float>(y + dy)
        });
        target.draw(shape);
        shape.setPosition(sf::Vector2f {
                static_cast<float>(x + width - dash_size),
                static_cast<float>(y + dy)
        });
        target.draw(shape);
    }
}

/**** Testcase handling ****/

bool test::handle_next(sf::RenderTarget & target, istream & is)
{
    // clear the render target
    target.clear(sf::Color::White);
    string row;
    // read the next line in is
    while ( getline(is, row) )
    {
        string command;
        istringstream iss { row };
        // read command and ignore comments
        if ( iss >> command && command.front() != '#' )
        {
            if ( command == "contain" )
                return handle_contain(target, iss);
            else if ( command == "intersect" )
                return handle_intersect(target, iss);
            else if ( command == "will_not_collide" )
                return handle_will_not_collide(target, iss);
            else if ( command == "collision_point" )
                return handle_collision_point(target, iss);
            cerr << "WARNING: Unknown function " << command << endl;
        }
    }
    // We have read all testcases
    return false;
}

bool test::handle_contain(sf::RenderTarget & target, istream & is)
{
    int x, y, w, h, px, py;
    char c;
    if ( is >> x >> y >> w >> h >> px >> py >> c )
    {
        Box box { x, y, w, h };
        Dot dot { px, py };
        bool expected { c == 't' };
        box.draw(target, sf::Color::Blue);
        dot.draw(target, sf::Color::Red);
        // perform the test
        bool result { box.to_aabb().contain(dot.to_point()) };
        draw_result(target, result == expected);
        return true;
    }
    return false;
}

bool test::handle_intersect(sf::RenderTarget & target, istream & is)
{
    int x1, y1, w1, h1, x2, y2, w2, h2;
    char c;
    if ( is >> x1 >> y1 >> w1 >> h1 >> x2 >> y2 >> w2 >> h2 >> c )
    {
        Box first  { x1, y1, w1, h1 };
        Box second { x2, y2, w2, h2 };
        bool expected { c == 't' };
        second.draw(target, sf::Color::Blue);
        first.draw_dashed(target, sf::Color::Red);
        bool result { second.to_aabb().intersect(first.to_aabb()) };
        draw_result(target, result == expected);
        return true;
    }
    return false;
}

bool test::handle_will_not_collide(sf::RenderTarget & target, istream & is)
{
    int x1, y1, w1, h1, x2, y2, x3, y3, w3, h3;
    char c;
    if ( is >> x1 >> y1 >> w1 >> h1 >> x2 >> y2 >> x3 >> y3 >> w3 >> h3 >> c )
    {
        Box self { x1, y1, w1, h1 };
        Box to { x2, y2, w3, h3 };
        Box from { x3, y3, w3, h3 };
        bool expected { c == 't' };
        // get the min_bounding_box so it can be drawn
        AABB tmp { from.to_aabb().min_bounding_box(to.to_aabb()) };
        Box bbox { aabb_to_box(tmp) };
        // fill the bounding box
        bbox.draw(target, sf::Color { 240, 255, 240 }, true);
        self.draw(target, sf::Color { 128, 128, 128 }, true);
        // draw the outline of the bounding box
        bbox.draw_dashed(target, sf::Color::Green);
        to.draw_dashed(target, sf::Color::Red);
        from.draw(target, sf::Color::Blue);
        bool result {
            self.to_aabb().will_not_collide(from.to_aabb(),
                                             to.to_point())
        };
        draw_result(target, result == expected);
        return true;
    }
    return false;
}

bool test::handle_collision_point(sf::RenderTarget & target, istream & is)
{
    int x1, y1, w1, h1, x2, y2, x3, y3, w3, h3;
    char c;
    if ( is >> x1 >> y1 >> w1 >> h1 >> x2 >> y2 >> x3 >> y3 >> w3 >> h3 >> c )
    {
        Box self { x1, y1, w1, h1 };
        Box to { x2, y2, w3, h3 };
        Box from { x3, y3, w3, h3 };
        bool expected { c == 't' };
        // place the point far away from the screen
        // so it is only visible when it has been updated
        Point where { -2*w3, -2*h3 };
        bool result {
            self.to_aabb().collision_point(from.to_aabb(),
                                            to.to_point(),
                                            where)
        };
        Box collision { where.x, where.y, w3, h3 };
        collision.draw(target, sf::Color::Green);
        self.draw(target, sf::Color { 128, 128, 128 }, true);
        to.draw_dashed(target, sf::Color::Red);
        from.draw(target, sf::Color::Blue);
        draw_result(target, result == expected);
        return true;
    }
    return false;
}

void test::draw_result(sf::RenderTarget & target, bool result)
{
    sf::Vector2f size { target.getSize() };
    float height { size.y };
    size.y = 32.0f;
    sf::RectangleShape shape { size };
    shape.setPosition(sf::Vector2f(0, height - size.y));
    if ( result )
        shape.setFillColor(sf::Color::Green);
    else
        shape.setFillColor(sf::Color::Red);
    target.draw(shape);
}

int main(int argc, char *argv[])
{
    // if there are no arguments show usage message
    if ( argc < 2 )
    {
        cerr << "Usage: " << argv[0] << " TESTCASEFILE "
             << "[--auto [frequency in milliseconds]]" << endl;
        return 1;
    }

    // open the supplied testcases file
    ifstream ifs { argv[1] };

    if ( !ifs )
    {
        cerr << "Unable to open test file '" << argv[1] << "'." << endl;
        return 1;
    }

    // check if --auto is present
    bool const is_auto { argc > 2 && ("--auto"s == argv[2]) };
    int frequency { 500 };

    // check if additional frequency argument is supplied
    if ( argc > 3 ) {
        istringstream iss { argv[3] };
        iss >> frequency;
    }

    // Create a window
    sf::RenderWindow win { sf::VideoMode { screen_width, screen_height },
                           "Collision test" };

    sf::RenderTexture target { };
    target.create(screen_width, screen_height);
    target.clear(sf::Color::White);
    
    test::handle_next(target, ifs);
    
    // determine if the program is finnished
    bool running { true };

    // determines if we should go to the next testcase
    bool next { false };
    
    // setup clocks for --auto
    sf::Time target_time { sf::milliseconds(frequency) };
    sf::Clock clock { };
    
    while ( running )
    {
        // if --auto is active and the timer is done
        if ( is_auto && clock.getElapsedTime() >= target_time )
        {
            clock.restart();
            next = true;
        }

        // Event handling, handles mouse clicks and the exit button
        sf::Event event;
        while ( win.pollEvent(event) )
        {
            if ( event.type == sf::Event::MouseButtonPressed )
            {
                if ( event.mouseButton.button == sf::Mouse::Button::Left )
                    next = !is_auto;
                else
                    running = false;
            }
            else if ( event.type == sf::Event::Closed )
            {
                // exit program
                running = false;
            }
        }

        // if we should go to the next testcase
        if ( next )
        {
            next = false;
            running = test::handle_next(target, ifs);
        }

        // draw the screen
        win.clear(sf::Color::White);
        target.display();
        sf::Sprite sprite { target.getTexture() };
        win.draw(sprite);
        win.display();

        // control the drawing frquency
        //sf::sleep(sf::milliseconds(10));
    }
}

// since we cannot assume that there are any method of getting
// the corners of an AABB, we will binary search for the top_left
// corner, and then find its size.
// WARNING: This assumes that intersect and contain works
test::Box test::aabb_to_box(AABB const & a)
{
    int left { 0 };
    int right { screen_width };
    int top { 0 };
    int bottom { screen_height };

    // find left
    while ( left < right )
    {
        int mid { (left + right) / 2 };
        if ( a.intersect(AABB { top, left, bottom, mid }) )
            right = mid;
        else
            left = mid + 1;
    }
    int x { left };
    
    // find top
    while ( top < bottom )
    {
        int mid { (top + bottom) / 2 };
        if ( a.intersect(AABB { top, x, mid, right }) )
            bottom = mid;
        else
            top = mid + 1;
    }
    int y { top };

        // find width
    int w { 1 };
    for ( ; w < screen_width; ++w )
    {
        if ( !a.contain(Point{x + w, (top+bottom)/2}) )
            break;
    }
    // find height
    int h { 1 };
    for ( ; h < screen_height; ++h )
    {
        if ( !a.contain(Point{x+w/2, y + h}) )
            break;
    }
    
    return Box { x, y, w, h };
}
