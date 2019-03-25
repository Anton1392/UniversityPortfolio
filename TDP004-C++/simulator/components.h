#ifndef COMPONENTS_H
#define COMPONENTS_H

#include <string>

struct Connection
{
	double current_voltage;
};

// Fint med protected, pure virtual och Connection&
class Component
{
	public:
		Component(Connection& plus, Connection& minus, std::string name);
		double get_voltage();
		virtual void do_work(double time_unit) = 0;
		virtual double get_current() = 0;

		std::string get_name();

	protected:
		std::string name;
		Connection& plus;
		Connection& minus;
};

// Bra att override används
class Resistor : public Component
{
	public:
		Resistor(Connection& plus, Connection& minus, std::string name, double resistance);
		void do_work(double time_unit) override;
		double get_current();

	private:
		double resistance;
};

class Capacitor : public Component
{
	public:
		Capacitor(Connection& plus, Connection& minus, std::string name, double capacitance);
		void do_work(double time_unit) override;
		double get_current();

	private:
		double capacitance;
		double charge;
};

class Battery : public Component
{
	public:
		Battery(Connection& plus, Connection& minus, std::string name, double voltage);
		void do_work(double time_unit) override;
		double get_current();

	private:
		double voltage;
};



#endif // COMPONENTS_H
