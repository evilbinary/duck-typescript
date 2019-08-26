/**
 * cc src/duck.c  -o duck.dylib -shared -I. -L. -lscm
 * */
#include "scm.h"
const char *libexts = (char *)0;


char* eval_str(char* string){
    return scm_strings(scm_eval(string));
}
void init(){
    if (libexts == 0) libexts = getenv("CHEZSCHEMELIBEXTS");
    if (libexts != 0) {
        scm_call1("library-extensions", Sstring(libexts));
    }
    scm_init();
}

ptr fixnum(exp){
    return scm_fixnum(exp);
}
ptr flonum(exp){
return scm_flonum(exp);
}

void deinit(){
    scm_deinit();
}