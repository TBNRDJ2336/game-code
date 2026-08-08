Exit code: 0
Wall time: 1.1 seconds
Output:
/* Optional C companion for the JavaScript server.
   Compile (Windows / MinGW): gcc -O2 -o archive_engine.exe archive_engine.c
   Usage: archive_engine.exe stats | profile */
#include <stdio.h>
#include <string.h>

static void stats(void) {
  puts("{\"service\":\"archive-engine\",\"language\":\"C\",\"records\":5,\"status\":\"ready\"}");
}
static void profile(void) {
  puts("{\"subject\":\"Muzan Kibutsuji\",\"designation\":\"First Demon\",\"threat\":\"unmeasurable\"}");
}
int main(int argc, char *argv[]) {
  if (argc < 2 || strcmp(argv[1], "stats") == 0) { stats(); return 0; }
  if (strcmp(argv[1], "profile") == 0) { profile(); return 0; }
  fputs("Usage: archive_engine [stats|profile]\n", stderr);
  return 1;
}

