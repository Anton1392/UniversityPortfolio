#include <stdlib.h>
#include <stddef.h>

#include "plist.h"

void plist_init(struct plist* p)
{
  //printf("PLIST_INIT ENTER\n");
  lock_init(&plist_lock);
  for(int i = 0; i < PLIST_MAP_SIZE; i++)
  {
    p->content[i] = NULL;
  }
  //plist_print(p);
  //printf("PLIST_INIT EXIT\n");
}

int plist_add_process(struct plist* p, char* name, int pid, int parent_pid)
{
  //printf("PLIST_ADD_PROCESS ENTER\n");
  lock_acquire(&plist_lock);
  struct process_info* info = (struct process_info*)malloc(sizeof(struct process_info));
  strlcpy(info->name, name, 16);
  info->pid = pid;
  info->parent_pid = parent_pid;
  info->exit_status = -1;
  info->alive = 1;
  info->parent_alive = 1;
  info->wait_sema = (struct semaphore){};
  sema_init(&info->wait_sema, 0);

  for(int i = 0; i < PLIST_MAP_SIZE; i++)
  {
    if(p->content[i] == NULL)
    {
      p->content[i] = info;
			lock_release(&plist_lock);
      //plist_print(p);
      //printf("PLIST_ADD_PROCESS EXIT\n");
      return pid;
    }
  }
	lock_release(&plist_lock);
  //plist_print(p);
  //printf("PLIST_ADD_PROCESS EXIT\n");
  return -1;
}

struct process_info* plist_find_process(struct plist* p, int pid)
{
  //printf("PLIST_FIND_PROCESS ENTER\n");
  lock_acquire(&plist_lock);
  // skall id vara separat från index/size?
  // eller syftar process inte på pid?
  for(int i = 0; i < PLIST_MAP_SIZE; i++)
  {
    if(p->content[i] != NULL)
    {
      if(p->content[i]->pid == pid)
      {
				lock_release(&plist_lock);
        //plist_print(p);
        //printf("PLIST_FIND_PROCESS EXIT\n");
        return p->content[i];
      }
    }
  }
	lock_release(&plist_lock);
  //plist_print(p);
  //printf("PLIST_FIND_PROCESS EXIT\n");
  return NULL;
}

void plist_remove_process(struct plist* p, int pid)
{
  //printf("PLIST_REMOVE_PROCESS ENTER\n");
	lock_acquire(&plist_lock);
  // Mark all processes
  for(int i = 0; i < PLIST_MAP_SIZE; i++)
  {
    if(p->content[i] != NULL)
    {
      if(p->content[i]->parent_pid == pid)
      {
        p->content[i]->parent_alive = 0;
      }
      if(p->content[i]->pid == pid)
      {
        p->content[i]->alive = 0;
      }
    }
  }
  for(int i = 0; i < PLIST_MAP_SIZE; i++)
  {
    if(p->content[i] != NULL)
    {
      if(p->content[i]->parent_alive == 0 && p->content[i]->alive == 0)
      {
        free(p->content[i]);
        p->content[i] = NULL;
      }
    }
  }
	lock_release(&plist_lock);
  //plist_print(p);
  //printf("PLIST_REMOVE_PROCESS EXIT\n");
}

void plist_print(struct plist* p)
{
	lock_acquire(&plist_lock);
  printf("%15s%15s%15s%15s%15s%15s\n", "name", "pid", "parent_pid", "alive", "parent_alive", "exit_status");
  for (int i=0; i < PLIST_MAP_SIZE; i++)
  {
      if (p->content[i] != NULL)
      {
          printf("%15s%15d%15d%15d%15d%15d\n",
              p->content[i]->name,
              p->content[i]->pid,
              p->content[i]->parent_pid,
              p->content[i]->alive,
              p->content[i]->parent_alive,
              p->content[i]->exit_status
          );
      }
  }
	lock_release(&plist_lock);
}
