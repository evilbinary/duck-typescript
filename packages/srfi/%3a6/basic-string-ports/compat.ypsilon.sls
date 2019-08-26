#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :6 basic-string-ports compat)
  (export 
   (rename
    (make-string-output-port open-output-string)
    (get-accumulated-string get-output-string)))
  (import
   (only (core) make-string-output-port get-accumulated-string))
)
