# FIT3143

Parallel computing: writing code that runs well on parallel hardware, and the theory to reason about it. Covers parallel and distributed architectures, Flynn's taxonomy, pipelines and superscalar and vector processing, SIMD/MIMD, clusters and clouds, performance models and Amdahl's law, GPUs and NPUs, synchronisation and deadlocks, distributed transactions and consensus. Hands-on work in C: processes, IPC, sockets, RPC, pthreads.

Chief examiner and lecturer: Dr Terrence Mak. Reference text: Sima, Fountain and Kacsuk, *Advanced Computer Architectures - a Design Space Approach*.

## Assessment

Pass mark is 50 overall, no threshold hurdles. All assessments are in-class; the regular 2-day extension policy does not apply (sick means special consideration through Central).

- **Applied problem solving tasks** (3 x Moodle quiz, ~1h, in workshops weeks 4, 8, 12): 50%
- **Laboratories** (3 x coding exercises, in labs weeks 4, 8, 12): 30%. Group work: code/report submission plus an in-person team presentation. Labs run every week; odd weeks are unassessed working sessions to prepare.
- **Applied sessions** (2 x written exercises, weeks 6 and 10): 20%. In-person presentation plus code/report/homework submission.

Attendance matters: every assessment happens in class.

## Weekly rhythm

1. **Pre-class**: watch lecture videos, read the notes, prepare lab/applied code and homework.
2. **Workshop** (2h): problem solving; assessment quizzes run here in weeks 4, 8, 12.
3. **Lab / applied session** (2h): hands-on C programming; assessed in weeks 4, 6, 8, 10, 12.
4. **After-class**: discussion forum (Ed), review recordings.

## Schedule

| Week | Lecture topic |
|---|---|
| 1 | Introduction, parallel/distributed systems |
| 2 | Processes, networks, IPC/RPC |
| 3 | Pipelines, superscalar, vector processing |
| 4 | Data parallel architectures, SIMD |
| 5 | MIMD, distributed memory |
| 6 | Parallel processing in clusters and clouds |
| 7 | Performance models, Amdahl's law |
| 8 | GPUs and NPUs, programming models |
| 9 | Synchronisation, mutex, deadlocks |
| 10 | Distributed transactions, concurrency, consensus |
| 11 | Matrix multiplication, partitioning |
| 12 | Exponential growth in parallel systems |

## Layout

- `wkXX/OVERVIEW.md`: topics, learning outcomes, tasks for the week.
- `wkXX/appliedXX/`: applied session code and exercises.
- Lecture, workshop, and synopsis slides stay gitignored.
