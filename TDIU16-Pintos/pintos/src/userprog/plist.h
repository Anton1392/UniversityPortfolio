#ifndef _PLIST_H_
#define _PLIST_H_

// 7 are needed for longrun 5 400, kernel+program
// 20 is fine for general use.
#define PLIST_MAP_SIZE 200

#include "threads/synch.h"

struct lock plist_lock;

struct plist
{
 struct process_info* content[PLIST_MAP_SIZE];
};

struct process_info
{
   char name[16];
   int pid;
   int parent_pid;
   int exit_status;
   int alive;
   int parent_alive; //in case parent pid is reused
   struct semaphore wait_sema;
};

/* Place functions to handle a running process here (process list).

   plist.h : Your function declarations and documentation.
   plist.c : Your implementation.

   The following is strongly recommended:

   - A function that given process inforamtion (up to you to create)
     inserts this in a list of running processes and return an integer
     that can be used to find the information later on.

   - A function that given an integer (obtained from above function)
     FIND the process information in the list. Should return some
     failure code if no process matching the integer is in the list.
     Or, optionally, several functions to access any information of a
     particular process that you currently need.

   - A function that given an integer REMOVE the process information
     from the list. Should only remove the information when no process
     or thread need it anymore, but must guarantee it is always
     removed EVENTUALLY.

   - A function that print the entire content of the list in a nice,
     clean, readable format.

 */




void plist_init(struct plist* p);

int plist_add_process(struct plist* p, char* name, int pid, int parent_pid);

struct process_info* plist_find_process(struct plist* p, int pid);

void plist_remove_process(struct plist* p, int pid);

void plist_print(struct plist* p);

#endif
