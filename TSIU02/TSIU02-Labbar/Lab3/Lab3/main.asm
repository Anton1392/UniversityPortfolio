;
; Lab3.asm
;
; Created: 2018-11-19 14:10:22
; Author : Wilton
;

	; Set up interrupt table
	.org 0x00
	rjmp RESET
	.org INT0addr
	rjmp BCD ; Triggered from pin PD2
	.org INT1addr
	rjmp MUX ; Triggered from pin PD3
	.org $2A

	.equ	NUMSIFF = 4

	.dseg ; Swap to SRAM
TIME: .byte NUMSIFF ; Define 4 bytes to store time.
	.cseg ; Swap back to FLASH

	; 7 segment display coding [ABCDEFG DP] (http://www.isy.liu.se/edu/kurs/TSIU02/2_Hardvara.pdf)
	DTAB:	.db 0b11111100, 0b01100000	; 0 1
			.db 0b11011010, 0b11110010	; 2 3
			.db 0b01100110, 0b10110110	; 4 5
			.db 0b10111110, 0b11100000	; 6 7
			.db 0b11111110, 0b11110110	; 8 9
	; Limit - max value, per display (reversed)
	LTAB: .db 10,6,10,6 

RESET:
	ldi r16, HIGH(RAMEND)
	out SPH, r16
	ldi r16, LOW(RAMEND)
	out SPL, r16

	ldi r16, 0b11000000
	out GICR, r16 ; Enables interrupt INT1 and INT0

	ldi r16, 0b00001111 ; Makes INT0 and INT1 trigger on rising edge. Bit 0 and 1 control INT0, bit 2 and 3 control INT1.
	out MCUCR, r16

	ldi r16, 1
	out DDRB, r16
	out DDRA, r16

	; Reset time in SRAM to 0 (under 10 to work)
	sts TIME, r16
	sts TIME+1, r16
	sts TIME+2, r16
	sts TIME+3, r16

	sei ; Allow interrupts from here

MAIN:
	rjmp MAIN ; Infinite loop, wait for interrupts.

MUX:	; time module 1kHz (display)
	ldi r16, 0
	out PORTB,r16
	inc r18
	ldi r26, 3		; for some reason works as MOD 4
	and r18, r26	; (0-3) AB of display & TIME+
	out PORTA, r18
	ldi ZL, low(TIME)
	ldi ZH, high(TIME)
	add ZL, r18
	ldi r24, $00
	adc ZH, r24
	ld r26, Z
	ldi ZL, low(DTAB*2)
	ldi ZH, high(DTAB*2)
	add ZL, r26
	adc ZH, r24
	lpm r26, Z

	; DP on middle dispaly
	cpi r18, 2
	brne NO_DP
	ori r26, 1
NO_DP:


	out PORTB, r26	; change display to show next digit
	reti

BCD:
	ldi r21, 0 ; Initial Offset

	; Load time value to r22
	ldi YL, low(TIME)
	ldi YH, HIGH(TIME)
	add YL, r21
	ldi r16, $0
	adc YH, r16

	; Load limit value to r23
	ldi ZL, low(LTAB*2)
	ldi ZH, high(LTAB*2)
	add ZL, r21
	adc ZH, r16

NEXT_DIGIT:
	ld r22, Y+	; time value (increment for possible next digit)
	lpm r23, Z+	; limit value (increment for possible next digit)

	inc r22
	cp r22, r23 ; slå om?
	brne UT
	ldi r22, $0
	st -Y, r22
	ld r22, Y+ ; reset dec
	rjmp NEXT_DIGIT
UT:
	st -Y, r22
	ld r22, Y+ ; reset dec
	reti


	

/*
	; Load time values
	lds r20, TIME
	lds r21, TIME+1
	lds r22, TIME+2
	lds r23, TIME+3

	inc r20 ; Increase time by one.

	; If first digit hit 10, reset to 0 and up second digit
	cpi r20, 10
	brne DIGIT_1
	ldi r20, $00
	inc r21
DIGIT_1:

	; If second digit hit 6, reset to 0 and up third digit
	cpi r21, 6
	brne DIGIT_2
	ldi r21, $00
	inc r22
DIGIT_2:

	; If third digit hit 10, reset to 0 and up fourth digit
	cpi r22, 10
	brne DIGIT_3
	ldi r22, $00
	inc r23
DIGIT_3:

	; If fourth digit hit 6, reset to 0. Start over. 59:59 -> 00:00
	cpi r23, 6
	brne DIGIT_4
	ldi r23, $00
DIGIT_4:


	; Store new time in SRAM.
	sts TIME, r20
	sts TIME+1, r21
	sts TIME+2, r22
	sts TIME+3, r23

	reti
	*/
	

; Koppling:
;	PORTB:
;		0-DP
;		1-G
;		2-F
;		3-E
;		4-D
;		5-C
;		6-B
;		7-A
;
;	PORTA:
;		0-A
;		1-B