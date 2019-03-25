#include <cmath>
#include "components.h"

// Kommentar: 5-4
// INTE FIXAT. Const fungerar ej i Connection-referenserna. Vi ändrar ju på spänningarna på båda Connections i samtliga do_work-funktioner.
// Kan ej hitta något annat ställe där 5-4 är relevant, alla klassparametrar är Connections. Rätta mig gärna om jag har fel.
// Ny kommentar: Menade på std::string

Component::Component(Connection& plus, Connection& minus, std::string name)
	: plus{plus}, minus{minus}, name{name}
{
}

double Component::get_voltage()
{
	double difference {fabs(plus.current_voltage - minus.current_voltage)};
	return difference;
}

std::string Component::get_name()
{
	return name;
}


Resistor::Resistor(Connection& plus, Connection& minus, std::string name, double resistance)
	: Component::Component(plus, minus, name), resistance{resistance}
{
}

void Resistor::do_work(double time_unit)
{
	Connection* most_positive {&plus};
	Connection* least_positive {&minus};
	if (plus.current_voltage > minus.current_voltage)
	{
		most_positive = &plus;
		least_positive = &minus;
	}
	else
	{
		most_positive = &minus;
		least_positive = &plus;
	}

	// Calculates how much charges to move
	double voltage_difference {most_positive->current_voltage - least_positive->current_voltage};
	double charge_movement {voltage_difference / resistance * time_unit};

	// Moves the charge
	most_positive->current_voltage -= charge_movement;
	least_positive->current_voltage += charge_movement;
}

double Resistor::get_current()
{
	return get_voltage()/resistance;
}


Capacitor::Capacitor(Connection& plus, Connection& minus, std::string name, double capacitance)
	: Component::Component(plus, minus, name), capacitance{capacitance}
{
}

void Capacitor::do_work(double time_unit)
{
	Connection* most_positive {&plus};
	Connection* least_positive {&minus};
	if (plus.current_voltage > minus.current_voltage)
	{
		most_positive = &plus;
		least_positive = &minus;
	}
	else
	{
		most_positive = &minus;
		least_positive = &plus;
	}

	double voltage_difference {most_positive->current_voltage - least_positive->current_voltage};
	double charge_to_store {capacitance * (voltage_difference-charge) * time_unit};

	charge += charge_to_store;
	most_positive->current_voltage -= charge_to_store;
	least_positive->current_voltage += charge_to_store;
}

double Capacitor::get_current()
{
	return capacitance*(get_voltage()-charge);
}


Battery::Battery(Connection& plus, Connection& minus, std::string name, double voltage)
	: Component::Component(plus, minus, name), voltage{voltage}
{
}

void Battery::do_work(double time_unit)
{
	plus.current_voltage = voltage;
	minus.current_voltage = 0;
}

double Battery::get_current()
{
	return 0;
}
