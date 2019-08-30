import * as ffi from 'ffi';

const duck = ffi.Library('./duck', {
  init: ['int', []],
  fixnum: ['void*', ['long']],
  flonum: ['void*', ['float']],

  scm_eval: ['void*', ['string']],
  scm_string: ['void*', ['string']],

  scm_symbolp: ['int', ['void*']],
  scm_procedurep: ['int', ['void*']],
  scm_pairp: ['int', ['void*']],
  scm_flonump: ['int', ['void*']],
  scm_fixnump: ['int', ['void*']],
  scm_nullp: ['int', ['void*']],
  scm_booleanp: ['int', ['void*']],
  scm_vectorp: ['int', ['void*']],

  Stop_level_value: ['void*', ['void*']],
  Sforeign_symbol: ['void', ['string', 'void*']],
  Sstring_to_symbol: ['void*', ['string']],
  Slock_object: ['void', ['void*']],
  Sunlock_object: ['void', ['void*']],
  scm_get_thread_context: ['void*', []],
  S_initframe: ['void', ['void*', 'int']],
  S_put_arg: ['void', ['void*', 'int', 'void*']],
  Scall: ['void*', ['void*', 'int']],

  vector_length: ['int', ['void*']],
  vector_ref: ['void*', ['void*', 'int']],
  fxvector_length: ['int', ['void*']],
  fxvector_ref: ['void*', ['void*', 'int']],
  flonum_value: ['double', ['void*']],
  fixnum_value: ['int', ['void*']],

  string_length: ['int', ['void*']],
  string_ref: ['int', ['void*', 'int']],

  scm_my_read_string: ['void*', ['string']],
  scm_print: ['void', ['void*']],
  scm_call0: ['void*', ['string']],
  scm_call1: ['void*', ['string', 'void*']],
  scm_call2: ['void*', ['string', 'void*', 'void*']],
  scm_call3: ['void*', ['string', 'void*', 'void*', 'void*']],
  scm_call4: ['void*', ['string', 'void*', 'void*', 'void*', 'void*']],
  scm_call0_proc: ['void*', ['void*']],
  scm_call1_proc: ['void*', ['void*', 'void*']],
  scm_call2_proc: ['void*', ['void*', 'void*', 'void*']],
  scm_call3_proc: ['void*', ['void*', 'void*', 'void*', 'void*']],
  scm_call4_proc: ['void*', ['void*', 'void*', 'void*', 'void*', 'void*']]
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
  locked = [];
  startLock = false;
  constructor() {
    const meval = `(define $meval   
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
             ))`;
    this.call1('eval', this.read_from_string(meval));
  }
  read_from_string(exp) {
    return duck.scm_my_read_string(exp);
  }

  top_value(exp) {
    return duck.Stop_level_value(exp);
  }
  prepare() {
    this.startLock = true;
    require('events').EventEmitter.defaultMaxListeners = 0;
  }
  eval(string) {
    const str = this.string(string);
    const ret = this.call1('$meval', str);
    if (this.startLock) {
      this.lock(ret);
      this.locked.push(ret);
    }
    return ret;
  }
  end() {
    this.locked.forEach(e => {
      this.unlock(e);
    });
    this.locked = [];
    this.startLock = false;
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
  symbol(exp) {
    return duck.Sstring_to_symbol(exp);
  }
  fixnum(exp) {
    return duck.fixnum(exp);
  }
  flonum(exp) {
    return duck.flonum(exp);
  }
  print(exp) {
    duck.scm_print(exp);
  }
  is_symbol(exp) {
    return duck.scm_symbolp(exp);
  }
  is_procedure(exp) {
    return duck.scm_procedurep(exp);
  }
  is_vector(exp) {
    return duck.scm_vectorp(exp);
  }
  is_flonum(exp) {
    return duck.scm_flonump(exp);
  }
  is_fixnum(exp) {
    return duck.scm_fixnump(exp);
  }
  flonum_value(exp) {
    return duck.flonum_value(exp);
  }
  fixnum_value(exp) {
    return duck.fixnum_value(exp);
  }
  get_string(exp) {
    let attr = '';
    const len = duck.string_length(exp);
    for (let i = 0; i < len; i++) {
      const e = duck.string_ref(exp, i);
      attr += String.fromCharCode(e);
    }
    return attr;
  }
  get_vector_array(exp) {
    const arr = [];
    const len = duck.vector_length(exp);
    for (let i = 0; i < len; i++) {
      const e = duck.vector_ref(exp, i);
      if (this.is_flonum(e)) {
        arr.push(duck.flonum_value(e));
      } else if (this.is_fixnum(e)) {
        arr.push(duck.fixnum_value(e));
      }
    }
    return arr;
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
  call5(name, arg0, arg1, arg2, arg3, arg4) {
    const proc = duck.Stop_level_value(duck.Sstring_to_symbol(name));
    return this.call5_proc(proc, arg0, arg1, arg2, arg3, arg4);
  }
  call5_proc(proc, arg0, arg1, arg2, arg3, arg4) {
    const tc = duck.scm_get_thread_context();
    duck.S_initframe(tc, 4);
    duck.S_put_arg(tc, 1, arg0);
    duck.S_put_arg(tc, 2, arg1);
    duck.S_put_arg(tc, 3, arg2);
    duck.S_put_arg(tc, 4, arg3);
    duck.S_put_arg(tc, 5, arg4);
    return duck.Scall(proc, 5);
  }
  call0_proc(proc) {
    return duck.scm_call0_proc(proc);
  }
  call1_proc(proc, arg) {
    return duck.scm_call1_proc(proc, arg);
  }
  call2_proc(proc, arg0, arg1) {
    return duck.scm_call2_proc(proc, arg0, arg1);
  }
  call3_proc(proc, arg0, arg1, arg2) {
    return duck.scm_call3_proc(proc, arg0, arg1, arg2);
  }
  call4_proc(proc, arg0, arg1, arg2, arg3) {
    return duck.scm_call4_proc(proc, arg0, arg1, arg2, arg3);
  }
  convert_type(args) {
    for (let i = 0; i < args.length; i++) {
      if (args[i] === 'pointer') {
        args[i] = 'ptr';
      }
    }
    return args;
  }
  get_args(args) {
    return args
      .map((o, i) => {
        return 'arg' + i;
      })
      .join(' ');
  }
  lock(exp) {
    duck.Slock_object(exp);
  }
  unlock(exp) {
    duck.Sunlock_object(exp);
  }
  make_callback_exp(name, fn, args, ret) {
    const addr = ffi.Callback(ret, args, fn);
    process.on('exit', function() {
      addr;
    });
    args = this.convert_type(args);
    duck.Sforeign_symbol(name, addr);
    const exp = `
        (lambda (${this.get_args(args)}) 
          (let ((fun (foreign-procedure "${name}" (${args.join(' ')}) ${ret}) ))
            (fun ${this.get_args(args)})
          )
        )
    `;
    return exp;
  }
}
