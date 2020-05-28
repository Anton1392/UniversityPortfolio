#include "map.h"
#include <stdio.h>

void map_init(struct map* m)
{
  for(int i = 0; i < MAP_SIZE; i++)
  {
    m->content[i] = NULL;
  }
}

key_t map_insert(struct map* m, value_t v)
{
  for(int i = 0; i < MAP_SIZE; i++)
  {
    if(m->content[i] == NULL)
    {
      m->content[i] = v;
      return i;
    }
  }
  return -1;
}

value_t map_find(struct map* m, key_t k)
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

value_t map_remove(struct map* m, key_t k)
{
  value_t v = map_find(m, k);
  if(v != NULL)
  {
      m->content[k] = NULL;
  }
  return v;
}

void map_for_each (struct map* m, void (*exec)(key_t k, value_t v, int aux), int aux)
{
  for(int i = 0; i < MAP_SIZE; i++)
  {
    if(m->content[i] != NULL)
    {
      exec(i, m->content[i], aux);
    }
  }
}

void map_remove_if(struct map* m, bool (*cond)(key_t k, value_t v, int aux), int aux)
{
  for(int i = 0; i < MAP_SIZE; i++)
  {
    if(m->content[i] != NULL)
    {
      if(cond(i, m->content[i], aux))
      {
        map_remove(m, i);
      }
    }
  }
}

void print_all(key_t k, value_t v, int aux)
{
  printf("%p\n", v);
}

bool always_true()
{
  return 1;
}
bool always_false()
{
  return 0;
}

/*
int main()
{

  struct map m;
  map_init(&m);


  key_t k1 = map_insert(&m, "Hejsan");
  key_t k2 = map_insert(&m, "Hejdå");

  value_t v1 = map_find(&m, k1);
  value_t v2 = map_find(&m, k2);
  value_t v3 = map_find(&m, 5);
  value_t v4 = map_find(&m, 300);


  map_remove(&m, k1);

  map_insert(&m, "Hejsan");

  map_insert(&m, "asdasd");
  map_insert(&m, "Hej");
  map_insert(&m, "asdasd");
  map_insert(&m, "sdfsdfsfd");

  map_remove_if(&m, &always_false, 0);

  map_for_each(&m, &print_all, 0);
  printf("\n");

  map_remove_if(&m, &always_true, 0);
  map_for_each(&m, &print_all, 0);

  return 1;
}
*/
