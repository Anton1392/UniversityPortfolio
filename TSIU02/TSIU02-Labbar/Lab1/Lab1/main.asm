;
; Lab1.asm
;
; Created: 2018-11-05 13:55:41
; Author : Anton
;


; PA0 = IR input

; PB0 = Segment display output
; PB1 = Segment display output
; PB2 = Segment display output
; PB3 = Segment display output

; PB7 = Oscilloscope output

	.def result = r20

START:
	; Initializes stack
	ldi r16, low(RAMEND)
	out SPL, r16
	ldi r16, high(RAMEND)
	out SPH, r16

	/*ldi r16, 0b00000000
	out PORTB, r16
	out PORTA, r16*/

	; Configure I/O
	ldi r16, 0b00000000
	out DDRA, r16
	ldi r16, 0b10001111
	out DDRB, r16

    rcall MAIN			
    
MAIN:
	ldi result, 0b00000000

	; Listen for start-bit
	rcall GETSTARTBIT
	rcall GETDATABITS
	rcall UTSKRIFT

	rjmp MAIN


GETSTARTBIT:
	; If PA0 is high
	in r16, PINA			; Read port A to r16
	andi r16, 0b00000001	; Logical and to get the first pin
	cpi r16, 0b00000001		; Comparison if first pin is high
	brne GETSTARTBIT		; If not equal, listen more.

	; Wait for t/2, check if PA0 is high again.
	rcall DELAY
	in r16, PINA			; Read port A to r16
	andi r16, 0b00000001	; Logical and to get the first pin
	cpi r16, 0b00000001		; Comparison if first pin is high
	brne GETSTARTBIT		; If not equal, listen more.

	; If start bit is found, go back to main for the next steps.
	ret


GETDATABITS:
	ldi result, 0b00000000	; clear result
	ldi r18, 4	; keep track of oop

	LOOP:
	rcall DELAY
	rcall DELAY

	in r19, PINA	; input
	
	ror r19	; push input to carry
	ror result	; push input to output

	dec r18	; dec loop counter
	
	brne LOOP
	swap result
	ret

UTSKRIFT:
	out PORTB, result
	ret
	

; Rutinen DELAY �r en v�nteloop som sam-
; tidigt avger en skvallersignal p� PB7.
; PB7 �r h�g n�r rutinen k�rs.
;
; Med angivet v�rde i r16 v�ntar rutinen
; ungef�r en millisekund @ 1 MHz.
; time = 10 -> ~1ms
;
; PORTB m�ste konfigureras separat.

; r16 = 10 och r17 = $1F ger ~1ms v�ntetid @1 mhz
; Vi beh�ver ha loopen ~76 snabbare pga en 38KHz IR-signal. Denna loop ska vara T/2

; 76 =~ 75. 31 =~ 30
; 75ggr snabbare = 5ggr * 15 ggr
; r16 (10) / 5 = 2
; r17 (30) / 15 = 2

; Vi s�tter r16 till 2 och r17 till 2 f�r att f� ~77.5x snabbare loop, b�r vara inom marginalen
DELAY:
	sbi PORTA,7
	push r16
	push r17

	ldi r16, 65 ; Decimal bas

delayYttreLoop:
	ldi r17, $1f ; $1f = 31

delayInreLoop:
	dec r17
	brne delayInreLoop
	dec r16
	brne delayYttreLoop
	cbi PORTB, 7

	pop r17
	pop r16
	ret