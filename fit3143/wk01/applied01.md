# Applied Session 01: Linux Basics

---
## Task one
### Which text-based command provides information on the use of other Linux commands and utilities?

```bash
man <command>
```

Gives information about how to use a specific command.

### List the command line for finding help on the usage of ssh?

```bash
man ssh
```

### List the command-lines for creating directories

```bash
mkdir <name>
```

### List the command-lines for deleting sub-directories.

```bash
rmdir <name>
```

### List the command-line for creating a zero-length file.

```bash
touch file
```

---
## Task two

### Setting home directory permissions

```bash
chmod 700 ~
```

```bash
chmod 4775 filename
```
This gives a specific file, permissions:
- 4: when someone executes this file, the process runs with the file owner's user ID, not the executor's.
- 7 (owner): read + write + execute.
- 7 (group): read + write + execute.
- 5 (others): read + execute.

### How do you set the executable permission on a file (to make it executable)? List the command-line.
```bash
chmod +x filename # makes the files executable
chmod u+x filename # makes the file executable for the current user
chmod 755 filename # makes it so that the file can be run by everyone

./filename # to run the file
```

### List the command-line for inspecting the permissions assigned to a particular file "hello.c".
```bash
> ls -l hello.c # show details about the file
-rw-r--r-- 1 jenul jenul 152 Jul 27 10:30 hello.c
# file-type+perms hard-link-count owner group size-bytes last-modified filename

> ls -la # for all files in the curret directory

> stat hello.c # more detailed information about a file
```

---
## Task three

### How do you get the last command-line re-displayed?

```bash
history # shows history of all commands
!! # runs the previous command
!!sudo # runs the previous command as sudo
```

### Locate the file in your home directory/system containing the PATH variable. What does it do?

The `~/.profile` and `~/.bashrc`, these are shell startup scripts, the profile file is for things that happen once per session, rc files are for things that are not inherited and must be set up in every shell you type into.

The `.profile` file has a line that calls the `.bashrc` file, so at startup it is called then, but it also runs when you run `bash`, since that is essentially starting a new shell.

### How do you inspect its value

```bash
echo $PATH

# The $ prefix means "the value of"
```

Lists all the directories that are in path, so these are the runnable commands available in the session.
