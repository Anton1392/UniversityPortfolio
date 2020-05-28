#include <stdio.h>
#include <syscall-nr.h>
#include "userprog/syscall.h"
#include "threads/interrupt.h"
#include "threads/thread.h"

/* header files you probably need, they are not used yet */
#include <string.h>
#include "filesys/filesys.h"
#include "filesys/file.h"
#include "threads/vaddr.h"
#include "threads/init.h"
#include "userprog/pagedir.h"
#include "userprog/process.h"
#include "userprog/flist.h"
#include "devices/input.h"
#include "devices/timer.h"
#include "lib/stdio.h"

#define DBG(format, ...) //printf(format "\n", ##__VA_ARGS__)

// Echo keyboard to screen
// pintos -p ../examples/line_echo -a line_echo -v -k --fs-disk=2 -- -f -q run line_echo

// halt/exit tests
// pintos -p ../examples/halt -a halt -v -k --fs-disk=2 -- -f -q run halt

// file_syscall_tests
// pintos -v -k --fs-disk=2 -p ../examples/file_syscall_tests -a fst -- -f -q run 'fst testing one two three'


static void syscall_handler (struct intr_frame *);

void
syscall_init (void)
{
  intr_register_int (0x30, 3, INTR_ON, syscall_handler, "syscall");
}


/* This array defined the number of arguments each syscall expects.
   For example, if you want to find out the number of arguments for
   the read system call you shall write:

   int sys_read_arg_count = argc[ SYS_READ ];

   All system calls have a name such as SYS_READ defined as an enum
   type, see `lib/syscall-nr.h'. Use them instead of numbers.
 */
const int argc[] = {
  /* basic calls */
  0, 1, 1, 1, 2, 1, 1, 1, 3, 3, 2, 1, 1,
  /* not implemented */
  2, 1,    1, 1, 2, 1, 1,
  /* extended */
  0
};

void halt (void)
{
  power_off();
}

void exit (int status)
{
  //DBG("# Exit status: %d", status);
  plist_find_process(&global_process_list, thread_current()->tid)->exit_status = status;
  thread_exit();
}

// fd is per thread, can't reach other threads files.
int read (int fd, char* buffer, unsigned int length)
{
	if(!verify_fix_length(buffer, length)) exit(-1);

  // Handle keyboard input
  if(fd == STDIN_FILENO)
  {
    for(unsigned int i = 0; i < length; i++)
    {
      // Reads a key and put it into buffer
      char c = input_getc();
      if(c == '\r')
      {
        c = '\n';
      }
      buffer[i] = c;
      printf("%c", c);
    }
    return length;
  }
  else if(fd == STDOUT_FILENO)
  {
		exit(-1);
		return -1; // removes warning, this won't be called
  }
  else // From file
  {
    struct file* f = f_map_find(&(thread_current()->file_map), fd);
    if(f != NULL)
    {
      return file_read(f, buffer, length);
    }
    else
    {
      return -1;
    }
  }
}

// error check is in process_wait if invalid id.
int wait(int id)
{
	return process_wait(id);
}

// fd is safe, files are per thread.
int write (int fd, const char* buffer, unsigned int length)
{
	if(!verify_fix_length(buffer, length)) exit(-1);

  if(fd == STDOUT_FILENO)
  {
    // Prints everything in buffer to screen.
    putbuf(buffer, length);
    //DBG("\nWrote: %d characters to screen.\n", length);
    return length;
  }
  else if(fd == STDIN_FILENO)
  {
		exit(-1);
		return -1; // removes warning, this won't be called
  }
  else
  {
    struct file* f = f_map_find(&(thread_current()->file_map), fd);
    if(f != NULL)
    {
      return file_write(f, buffer, length);
    }
    else
    {
      return -1;
    }
  }
}

// No checking needed, file system handles errors. f_map is thread local.
int open(const char* file)
{
	if(!verify_variable_length(file)) exit(-1);

  struct file* f = filesys_open(file);
  if(f == NULL)
  {
    return -1;
  }
  else
  {
    // Add file to thread-local file map, return descriptor.
    int ret = f_map_insert(&(thread_current()->file_map), f);
    // If map failed to insert (too full?), close file and return error.
    if(ret == -1)
    {
      filesys_close(f);
      return -1;
    }
    else
    {
      return ret;
    }
  }
}

// fd is thread-local.
void close(int fd)
{
  struct file* f = f_map_find(&(thread_current()->file_map), fd);
  if(f != NULL)
  {
    // Releases resources, removes file from threads file table.
    filesys_close(f);
    f_map_remove(&(thread_current()->file_map), fd);
  }
}

// File system handles this
bool remove (const char* file)
{
	if(!verify_variable_length(file)) exit(-1);
  return filesys_remove(file);
}

// File system handles this
bool create (const char* file, unsigned initial_size)
{
	if(!verify_variable_length(file)) exit(-1);
  return filesys_create(file, initial_size);
}

// FD is per thread, file system handles errors.
void seek (int fd, unsigned position)
{
  struct file* f = f_map_find(&(thread_current()->file_map), fd);
  if(f != NULL)
  {
    unsigned f_len = file_length(f);
    if(position < f_len)
    {
        file_seek(f, position);
    }
    else
    {
      file_seek(f, f_len-1);
    }
  }else{
  }
}

// fd is thread local.
unsigned tell (int fd)
{
  struct file* f = f_map_find(&(thread_current()->file_map), fd);
  if (f != NULL)
  {
    return file_tell(f);
  }else{
    return -1;
  }
}

// fd is thread local.
int filesize (int fd)
{
  struct file* f = f_map_find(&(thread_current()->file_map), fd);
  if (f != NULL)
  {
    return file_length(f);
  }else{
    return -1;
  }
}

// No need for check
void sleep(int millis)
{
  timer_msleep(millis);
}

// Harmless
void plist()
{
  plist_print(&global_process_list);
}

int exec(const char* command_line)
{
	if(!verify_variable_length(command_line))	exit(-1);
  return process_execute(command_line);
}

static void syscall_handler (struct intr_frame *f)
{
  int32_t* esp = (int32_t*)f->esp;
	//* SyscallNO = esp
	//* All ptr parameters esp[1-3]
	// all string pointers
	// all buffer pointers
	// file descriptors
	// pid
	// file size

  DBG("Stack top + 0: %d\n", esp[0]);
  DBG("Stack top + 1: %d\n", esp[1]);
	
	if(f == NULL || !verify_fix_length(esp, sizeof(esp)))
	{
		exit(-1);
	}
	if(!verify_fix_length(esp+1, argc[*esp]*4))
	{
		exit(-1);
	}

  switch (*esp)
  {
    case SYS_HALT:
    {
      halt();
      break;
    }
    case SYS_EXIT:
    {
      exit(esp[1]);
      break;
    }
    case SYS_READ:
    {
      f->eax = read(esp[1], (char*)esp[2], esp[3]);
      break;
    }
    case SYS_WRITE:
    {
      f->eax = write(esp[1], (char*)esp[2], esp[3]);
      break;
    }
    case SYS_OPEN:
    {
      f->eax = open((char*)esp[1]);
      break;
    }
    case SYS_CLOSE:
    {
      close(esp[1]);
      break;
    }
    case SYS_REMOVE:
    {
      f->eax = remove((char*)esp[1]);
      break;
    }
    case SYS_CREATE:
    {
      f->eax = create((char*)esp[1], esp[2]);
      break;
    }
    case SYS_SEEK:
    {
      seek(esp[1], esp[2]);
      break;
    }
    case SYS_TELL:
    {
      f->eax = tell(esp[1]);
      break;
    }
    case SYS_FILESIZE:
    {
      f->eax = filesize(esp[1]);
      break;
    }
    case SYS_SLEEP:
    {
      sleep(esp[1]);
      break;
    }
    case SYS_PLIST:
    {
      plist();
      break;
    }
    case SYS_EXEC:
    {
      f->eax = exec((char*)esp[1]);
      break;
    }
    case SYS_WAIT:
    {
	    f->eax = wait(esp[1]);
	    break;
    }

    default:
    {
      DBG("Executed an unknown system call!\n");

      DBG("Stack top + 0: %d\n", esp[0]);
      DBG("Stack top + 1: %d\n", esp[1]);

      thread_exit();
    }
  }
}

/* Verify all addresses from and including 'start' up to but excluding
 * (start+length). */
bool verify_fix_length(void* _start, int length)
{
  // ADD YOUR CODE HERE
	char* start = (char*)_start;

	// In case of invalid pointer, check before we iterate.
	if(_start == NULL || length < 0)	return false;
	if(!is_user_vaddr(_start) || pagedir_get_page(thread_current()->pagedir, _start) == NULL) return false;

	bool is_valid = true;
	char* prev_page = NULL;
	for(int i = 0; i < length; i++)
	{
		void* cur_page = pg_round_down(start+i);
		// If new page
		if(cur_page != prev_page || true)
		{
			prev_page = cur_page;
			if(pagedir_get_page(thread_current()->pagedir, start+i) == NULL|| start+i > (char*)PHYS_BASE || !is_user_vaddr(start+i))
			{
				is_valid = false;
				break;
			}
		}
	}
	return is_valid;
}

/* Verify all addresses from and including 'start' up to and including
 * the address first containg a null-character ('\0'). (The way
 * C-strings are stored.)
 */
bool verify_variable_length(const char* start)
{
  // ADD YOUR CODE HERE
	bool is_valid = true;
	char* cur = start;

	if(cur == NULL)
	{
		return false;
	}

	char* prev_page = NULL;
	while(true)
	{
		char* cur_page = pg_round_down(cur);
		if(cur_page != prev_page)
		{
			prev_page = cur_page;
			if(pagedir_get_page(thread_current()->pagedir, cur) == NULL || cur > (char*)PHYS_BASE || !is_user_vaddr(cur))
			{
				is_valid = false;
				break;
			}
		}
		if(is_end_of_string(cur))
		{
			break;
		}
		cur++;
	}
	return is_valid;
}

bool is_end_of_string(const char* adr)
{
	if(strchr(adr, '\0') == NULL)
	{
		return false;
	}
	else
	{
		return true;
	}
}
