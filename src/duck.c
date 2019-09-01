/**
 * osx cc src/duck.c  -o duck.dylib -fPIC -shared -I. -L. -lscm
 * linux cc src/duck.c  -o duck.so -fPIC -shared -I. -L. -lscm
 * */
#include "scm.h"
const char* libexts = (char*)0;

char* eval_str(char* string) { return scm_strings(scm_eval(string)); }
void init() {
  if (libexts == 0) libexts = getenv("CHEZSCHEMELIBEXTS");
  if (libexts != 0) {
    scm_call1("library-extensions", Sstring(libexts));
  }
  scm_init();
}

ptr fixnum(int exp) { return scm_fixnum(exp); }
double flonum_value(ptr x) { return scm_flonum_value(x); }

iptr fixnum_value(ptr x) { return scm_fixnum_value(x); }

ptr flonum(float exp) { return scm_flonum(exp); }
ptr vector_ref(ptr exp, iptr i) { return scm_vector_ref(exp, i); }
iptr vector_length(ptr exp) { return scm_vector_length(exp); }

ptr string_ref(ptr exp, iptr i) { return scm_string_ref(exp, i); }
iptr string_length(ptr exp) { return scm_string_length(exp); }

ptr fxvector_ref(ptr exp, iptr i) { return scm_fxvector_ref(exp, i); }
iptr fxvector_length(ptr exp) { return scm_fxvector_length(exp); }

void deinit() { scm_deinit(); }