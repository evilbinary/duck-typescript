;;"srfi-2.scm": Guarded LET* special form
;Copyright (C) 2003 Aubrey Jaffer
;
;Permission to copy this software, to modify it, to redistribute it,
;to distribute modified versions, and to use it for any purpose is
;granted, subject to the following restrictions and understandings.
;
;1.  Any copy made of this software must include this copyright notice
;in full.
;
;2.  I have made no warranty or representation that the operation of
;this software will be error-free, and I am under no obligation to
;provide any services, by way of maintenance, update, or otherwise.
;
;3.  In conjunction with products arising from the use of this
;material, there shall be no use of my name in any advertising,
;promotional, or sales literature without prior written consent in
;each case.

;;@code{(require 'srfi-2)}
;;@ftindex srfi-2

;;@body
;;@url{http://srfi.schemers.org/srfi-2/srfi-2.html}
(defmacro and-let* (claws . body)
  (define (andin claw ans)
    (if (and (pair? ans) (eq? 'and (car ans)))
	`(and ,claw ,@(cdr ans))
	`(and ,claw ,ans)))
  (do ((claws (reverse claws) (cdr claws))
       (ans (cond ((null? body) '(and))
		  ((null? (cdr body)) (car body))
		  (else (cons 'begin body)))
	    (let ((claw (car claws)))
	      (cond ((symbol? claw)
		     (andin claw ans))
		    ((and (pair? claw) (null? (cdr claw)))
		     (andin (car claw) ans))
		    (else
		     `(let (,claw) ,(andin (car claw) ans)))))))
      ((null? claws) ans)))
