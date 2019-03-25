#ifndef LINKED_LIST_H
#define LINKED_LIST_H

class Sorted_List
{
	class Node;
    public:
        Sorted_List();
		Sorted_List(Sorted_List const & original);
		Sorted_List& operator= (Sorted_List const & original);
		~Sorted_List();
		bool is_empty() const;
		int size() const;
		void insert(int val);
		int index_value(int index) const;
		void remove_index(int index);
		void remove_all();

	private:
		void insert(int val, Node*& current);
		Node* index_node(int index) const;
		Node* first{nullptr};
		class Node
		{
			public:
		        Node(int val, Node* next);
				int val;
				Node* next;
		};

};

#endif
