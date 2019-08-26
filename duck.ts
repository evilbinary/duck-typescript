import * as ffi from 'ffi';

const duck = ffi.Library('./duck', {
  init: ['int', []],
  fixnum: ['void*',['int']],
  flonum: ['void*',['float']],

  scm_eval: ['void*', ['string']],
  scm_string: ['void*', ['string']],

  scm_symbolp: ['int',['void*']],
  scm_procedurep: ['int',['void*']],
  scm_pairp: ['int',['void*']],
  scm_flonump: ['int',['void*']],
  scm_nullp: ['int',['void*']],
  scm_booleanp: ['int',['void*']],
  scm_vectorp: ['int',['void*']],

  Stop_level_value: ['void*',['void*']],
  scm_my_read_string:['void*',['string']],

  scm_print: ['void',['void*']],
  scm_call0: ['void*', ['string']],
  scm_call1: ['void*', ['string', 'void*']],
  scm_call2: ['void*', ['string', 'void*', 'void*']],
  scm_call3: ['void*', ['string', 'void*', 'void*', 'void*']],
  scm_call4: ['void*', ['string', 'void*', 'void*', 'void*', 'void*']]
});

function initEnv() {
  process.env.LD_LIBRARY_PATH =
    '.:./packages:../packages/:../packages/gui:./apps:../:../lib:../packages/nanopass:../apps/duck-editor:../../duck-editor:/z/main/jni/apps/duck-editor/';
  process.env.DYLD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH;
  process.env.CHEZSCHEMELIBDIRS = process.env.LD_LIBRARY_PATH;
  process.env.SCHEMEHEAPDIRS = '.';
  process.env.SCHEME_LIBRARY_PATH = '../packages/slib/';
  process.env.CHEZ_IMPLEMENTATION_PATH = '.';
  process.env.SCHEMEHEAPDIRS = '.';
  duck.init();
}
initEnv();

export class Duck {
  env = '';
  constructor() {
      const meval=`(define $meval   
        (lambda (str)
                (try 
                    (let ((ret '()))
                        (with-input-from-string str
                                (lambda ()
                                (let loop ()
                                    (let ((c ($my-read)))
                                    (cond
                                        ((eof-object? c) c )
                                        ((eq? c (void)) c) 
                                            (else
                                                (set! ret (eval c))
                                                (loop)))
                                    ))))
                            ret)
                (catch (lambda (x) 
                    (display-condition x) 
                )))
             ))`
      this.call1('eval',this.read_from_string(meval) );
  }
  read_from_string(exp){
      return duck.scm_my_read_string(exp);
  }

  top_value(exp){
      return duck.Stop_level_value(exp);
  }
  eval(string){
    const str=this.string(string);
    const ret=this.call1("$meval",str);
    return ret;;
  }
  my_eval(exp) {
    return duck.scm_eval(exp);
  }
  my_eval_str(exp) {
    return duck.eval_str(exp);
  }
  string(exp) {
    return duck.scm_string(exp);
  }
  int(exp){
      return duck.fixnum(exp);
  }
  float(exp){
    return duck.flonum(exp);
}
  print(exp){
      duck.scm_print(exp);
  }
  is_symbol(exp){
    return duck.scm_symbolp(exp);
  }
  is_procedure(exp){
    return duck.scm_procedurep(exp);
  }
  is_vector(exp){
      return duck.scm_vectorp(exp);
  }

  call0(name) {
    return duck.scm_call0(name);
  }
  call1(name, arg) {
    return duck.scm_call1(name, arg);
  }
  call2(name, arg0, arg1) {
    return duck.scm_call2(name, arg0, arg1);
  }
  call3(name, arg0, arg1, arg2) {
    return duck.scm_call3(name, arg0, arg1, arg2);
  }
  call4(name, arg0, arg1, arg2, arg3) {
    return duck.scm_call4(name, arg0, arg1, arg2, arg3);
  }

}
