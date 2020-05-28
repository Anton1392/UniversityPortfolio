#ifndef USERPROG_SYSCALL_H
#define USERPROG_SYSCALL_H

void syscall_init (void);

// Uppg. 12
void halt (void);

// Uppg. 13
void exit(int status);

// Uppg. 14 & 15
int read (int fd, char* buffer, unsigned int length);
int write (int fd, const char* buffer, unsigned int length);

// Uppg. 15
int open (const char* file);
void close (int fd);
bool remove (const char* file);
bool create (const char* file, unsigned initial_size);
void seek (int fd, unsigned position);
unsigned tell (int fd);
int filesize (int fd);

void sleep(int millis);
void plist(void);

int exec(const char* command_line);
int wait(int id);

bool verify_fix_length(void* _start, int length);

bool verify_variable_length(const char* start);

bool is_end_of_string(const char* adr);

#endif /* userprog/syscall.h */
