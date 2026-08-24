CC     = mpicc
CFLAGS = -Wall
LDLIBS = -lm
NP    ?= 4

run: main
	mpirun -np $(NP) ./main

clean:
	$(RM) main

.PHONY: run clean
