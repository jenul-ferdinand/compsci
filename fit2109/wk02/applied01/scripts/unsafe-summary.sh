#!/usr/bin/env bash
dir=$1
grep -Eo ERROR [0-9]+ $dir/*.log | sort | uniq -c
