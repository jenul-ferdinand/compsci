#include <stdio.h>
#include <mpi.h>

int main(int argc, char **argv) {
    int rank, size;

    // Start the MPI runtime. Must be the first MPI call. Takes argc/argv so
    // the runtime can read and strip its own arguments before your code sees them.
    MPI_Init(&argc, &argv);

    // How many processes are in this communicator? Set by mpirun -np.
    // MPI_COMM_WORLD is the default communicator holding every process.
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    // This process's ID within the communicator, 0 to size-1.
    // Every rank runs this same binary, so this is the only thing telling them apart.
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    // All ranks execute this line. Output order is nondeterministic: whichever
    // process reaches the terminal first wins, so lines can appear in any order.
    printf("Hello world from process %d of %d\n", rank, size);

    // Shut down the MPI runtime. No MPI calls are valid after this point.
    MPI_Finalize();

    return 0;
}

// Example usage:
//   make run          # 4 ranks
//   make run NP=8     # 8 ranks
// Or without make:
//   mpicc -Wall -o main main.c && mpirun -np 4 ./main
