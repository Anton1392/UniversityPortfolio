;
; AssemblerApplication1.asm
;
; Created: 2018-12-17 11:21:54
; Author : Anton
;
.dseg
.org SRAM_START
POSX: .byte 1

; Replace with your application code
.macro INCSRAM ; inc byte in SRAM
	lds r16, @0
	inc r16
	sts @0, r16
.endmacro

.cseg
START:
	INCSRAM POSX
	rjmp START