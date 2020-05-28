;
; MorseCode.asm
;
; Created: 2018-11-12 09:17:12
; Author : Will
;

; Name registers
.def char = r17		; ascii character
.def spk = r18		; speaker (morse)
.def key = r19		; ascii comparable (lookup)
.def delayNum = r20	; N_Times
.def spk_on = r25	; Speaker output enabled beep/nobeep
.def zero = r16		; Always 0

INIT:
	; Stack setup
	ldi r16,HIGH(RAMEND) ; set stack 
	out SPH,r16 ; for rcalls 
	ldi r16,LOW(RAMEND) 
	out SPL,r16 

	; Set output to PB0
	ldi r16, $01 ; ($01 needed)
	out DDRB, r16
	; out DDRA, r16
	; out DDRD, r16

	ldi zero, $00

	; Start program
	rjmp MORSE
	
	; Setup FLASH program memory data
	; ASCII to Morse [lookup table]
	DTAB:	.db $60, $88	; A B
			.db $A8, $90	; C D
			.db $40, $28	; E F
			.db $D0, $08	; G H
			.db $20, $78	; I J
			.db $B0, $48	; K L
			.db $E0, $A0	; M N
			.db $F0, $68	; O P
			.db $D8, $50	; Q R
			.db $10, $C0	; S T
			.db $30, $18	; U V
			.db $70, $98	; W X
			.db $B8, $C8	; Y Z

	; Message to send in Morse
	MESSAGE: .db "DATORTEKNIK "
			 .db $00	; explicit end tag

MORSE:
	; Load message address
	ldi ZL, low(MESSAGE*2)
	ldi ZH, high(MESSAGE*2)

	GET_CHAR:
		lpm char, Z+		; load char from program memory (one byte at Z address)
		cp char, zero
		BREQ MORSE
	WHILE_CHAR:
		cpi char, $20 ; char is space
		brne NORMAL_CHAR
		ldi delayNum, 7 ; Wait for 7N
		rcall NOBEEP
		rjmp NEXT_CHAR
	NORMAL_CHAR:
		rcall LOOKUP ; set spk to correct value
		rcall SEND	; Send current char through speaker
		ldi delayNum, 2 ; Wait for 2N
		rcall NOBEEP
	NEXT_CHAR:
		rjmp GET_CHAR
		;cp char, zero
		;BRNE GET_CHAR
	rjmp MORSE

SEND:
	mov r22, zero

	lsl spk ; Shift spk left
	adc r22, zero
	; If spk is 0, done beeping, return.
	cpse spk, zero
	rjmp PC+2
	ret
	NO_RET:

	ldi delayNum, 1
	cpse r22, zero
	ldi delayNum, 3
	rcall BEEP 	; Beep with T

	/*cpi r22, $01
	brne NO2BEEP
	ldi delayNum, 2
	rcall BEEP : ; Beep twice if current bit is 1, total of 3 beeps
	NO2BEEP:*/

	ldi delayNum, 1 ; 1N silence
	rcall NOBEEP
	rjmp SEND

; translate ascii to morse
LOOKUP:
	push ZL
	push ZH

	ldi ZL, low(DTAB*2)
	ldi ZH, high(DTAB*2)
	
	mov key, char
	subi key, $41
	add Zl, key
	adc ZH, zero

	lpm spk,Z

	pop ZH
	pop ZL
	ret

; 1kHz signal for 20ms * N_Times (delayNum)
BEEP:
	ldi spk_on, $01
NOBEEP:
	push r21
	BEEP_START:
	ldi r21, 20

	BEEP_LOOP:
	; see if output enabled
	sbrc spk_on, 0
	sbi PORTB, 0
	rcall DELAY_500
	cbi PORTB, 0
	rcall DELAY_500
	dec r21
	brne BEEP_LOOP

	dec delayNum
	brne BEEP_START

	pop r21
	mov spk_on, zero
	ret

; wait 500 clock cycles (0.5 ms)
DELAY_500:
	
	push r16
	push r17

	ldi r16, 5
	DELAY_500_OUTER:
	ldi r17, 100
	DELAY_500_INNER:
	dec r17
	brne DELAY_500_INNER
	dec r16
	brne DELAY_500_OUTER

	pop r17
	pop r16
	
	ret