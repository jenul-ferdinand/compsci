#!/bin/sh
# Compile and run a C file: ./run.sh file.c [program args]
# MPI files (once mpicc is installed) run under mpirun; NP sets process count.
set -e
src="$1"
shift
bin="/tmp/$(basename "$src" .c)"
if grep -q '#include *<mpi.h>' "$src"; then
	mpicc -Wall -o "$bin" "$src" -lm
	mpirun -np "${NP:-4}" "$bin" "$@"
else
	gcc -Wall -fopenmp -o "$bin" "$src" -lm
	"$bin" "$@"
fi
