#include <stddef.h>
#include <stdio.h>

#include "flist.h"

// Only inserts from i = 2 and up, to prevent collisions with STDIN_FILENO = 0 and STDOUT_FILENO = 1

void f_map_init(struct f_map* m)
{
  for(int i = 0; i < MAP_SIZE; i++)
  {
    m->content[i] = NULL;
  }
}

key_t f_map_insert(struct f_map* m, value_t v)
{
  for(int i = 2; i < MAP_SIZE; i++)
  {
    if(m->content[i] == NULL)
    {
      m->content[i] = v;
      return i;
    }
  }
  return -1;
}

value_t f_map_find(struct f_map* m, key_t k)
{
  if(k >= MAP_SIZE || k < 0)
  {
    return NULL;
  }
  else
  {
    return m->content[k];
  }
}

value_t f_map_remove(struct f_map* m, key_t k)
{
  value_t v = f_map_find(m, k);
  if(v != NULL)
  {
      m->content[k] = NULL;
  }
  return v;
}

void f_map_for_each (struct f_map* m, void (*exec)(key_t k, value_t v, int aux), int aux)
{
  for(int i = 2; i < MAP_SIZE; i++)
  {
    if(m->content[i] != NULL)
    {
      exec(i, m->content[i], aux);
    }
  }
}

void f_map_remove_if(struct f_map* m, bool (*cond)(key_t k, value_t v, int aux), int aux)
{
  for(int i = 2; i < MAP_SIZE; i++)
  {
    if(m->content[i] != NULL)
    {
      if(cond(i, m->content[i], aux))
      {
        f_map_remove(m, i);
      }
    }
  }
}
