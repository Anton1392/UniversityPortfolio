; --- lab4_skal.asm
.equ VMEM_SZ = 5 ; # rows on display
.equ AD_CHAN_X = 0 ; ADC0 = PA0 , PORTA bit 0 X - led
.equ AD_CHAN_Y = 1 ; ADC1 = PA1 , PORTA bit 1 Y - led
.equ GAME_SPEED = 70 ; inter - run delay ( millisecs )
.equ PRESCALE = 7 ; AD - prescaler value
.equ BEEP_PITCH = 20 ; Victory beep pitch
.equ BEEP_LENGTH = 100 ; Victory beep length

; ---------------------------------------
; --- Memory layout in SRAM
.dseg
.org SRAM_START
POSX: .byte 1 ; Own position
POSY: .byte 1
TPOSX: .byte 1 ; Target position
TPOSY: .byte 1
LINE: .byte 1 ; Current line
VMEM: .byte VMEM_SZ ; Video MEMory
SEED: .byte 1 ; Seed for Random

; ---------------------------------------
; --- Macros for inc / dec - rementing
; --- a byte in SRAM
.macro INCSRAM ; inc byte in SRAM
	push r16
	lds r16, @0
	inc r16
	sts @0, r16
	pop r16
.endmacro

.macro DECSRAM ; dec byte in SRAM
	push r16
	lds r16, @0
	dec r16
	sts @0, r16
	pop r16
.endmacro

.macro SET_BIT_N ; set bit in any register
	;@0 output register
	;@1 chosen bit
	sec
	ldi r16, 0
	inc @1
SET_BIT_N_LOOP:
	dec @1
	lsl r16
	BRNE SET_BIT_N_LOOP
	or @0, r16
.endmacro

.macro COPY_BIT ; r17, (4,5,6)
	bst @0, @1
	brts SET_BIT
	rjmp CLR_BIT
SET_BIT:
	sbi PORTA, @1
	rjmp BIT_DONE
CLR_BIT:
	cbi PORTA, @1
BIT_DONE:
.endmacro

; ---------------------------------------
; --- Code
.cseg
	.org $0
	jmp START
	.org INT0addr
	jmp MUX

START:
	;DONE: s�tt stackpekaren
	ldi r16, HIGH(RAMEND)
	out SPH, r16
	ldi r16, LOW(RAMEND)
	out SPL, r16

	call HW_INIT
	call WARM
RUN:
	call JOYSTICK
	call ERASE
	call UPDATE

	;*** Vanta en stund sa inte spelet gar for fort ***
	call DELAY

	;DONE: Avgor om traff
	lds r16, POSX
	lds r17, TPOSX
	cp r16, r17 ; Not same X -> no hit
	brne NO_HIT
	lds r16, POSY
	lds r17, TPOSY
	cp r16, r17 ; Not same Y -> no hit
	brne NO_HIT

	; Victory beep
	ldi r16, BEEP_LENGTH
	call BEEP

	; Reset
	call WARM
NO_HIT:
	jmp RUN

; ---------------------------------------
; --- Multiplex display
; --- Uses : r16, r17, r18, r19
MUX:
	;*** skriv rutin som handhar multiplexningen och ***
	;*** utskriften till diodmatrisen . Öka SEED . ***
	
	; LINE (current line/row)
	; PORTB (display output values)
	; bit num to display num 1-7
	; PORTA (display output control)
	; 0-A 1-B 2-C

	push r16
	push r17
	push r18
	push r19

	; shut off while changing
	ldi r16, 0
	out PORTB, r16

	; increase display line (control)
	lds r17, LINE
	INCSRAM LINE
	cpi r17, 4
	brsh RESET_LINE
	rjmp KEEP_LINE
RESET_LINE:
	ldi r16, 0
	sts LINE, r16
KEEP_LINE:
	;copy control bits to PORTA
	; A B C = A4 A5 A6
	swap r17
	COPY_BIT r17, 4
	COPY_BIT r17, 5
	COPY_BIT r17, 6
	swap r17

	; calculate line output (value)
	ldi r18, 0 ; output

	; POS on current line?
	lds r19, POSY
	cp r17, r19
	BREQ POS_ON_LINE
	rjmp POS_OFF_LINE
POS_ON_LINE:
	lds r19, POSX
	SET_BIT_N r18, r19
POS_OFF_LINE:

	; TPOS on current line?
	lds r19, TPOSY
	cp r17, r19
	BREQ TPOS_ON_LINE
	rjmp TPOS_OFF_LINE
TPOS_ON_LINE:
	lds r19, TPOSX
	SET_BIT_N r18, r19
TPOS_OFF_LINE:
	
	lsl r18	; bit 0 unused
	lds r16, POSY ; (default 2)
	lsl r16
	out PORTB, r16 ; r16 debug (should be r18)
	INCSRAM SEED

	pop r19
	pop r18
	pop r17
	pop r16

	reti

; ---------------------------------------
; --- JOYSTICK Sense stick and update POSX , POSY
; --- Uses : r16
JOYSTICK:
	;DONE: skriv kod som ökar eller minskar POSX beroende
	; pa insignalen fran A/D - omvandlaren i X - led ...
	
	; Initialize A/D-converter
	ldi r16, AD_CHAN_X ; PA0 = ADC0
	out ADMUX, r16
	ldi r16, (1 << ADEN)
	out ADCSRA, r16
	sbi ADCSRA, ADSC ; Start conversion

	; Wait for conversion to finish.
	WAITX:
	sbic ADCSRA, ADSC
	rjmp WAITX

	in r16, ADCH ; Get result, only care for two highest bits.

	; If 00, go right. If 11, go left.
	cpi r16, 0
	brne NOT_RIGHT
	DECSRAM POSX
	NOT_RIGHT:

	cpi r16, 3
	brne NOT_LEFT
	INCSRAM POSX
	NOT_LEFT:

	;DONE: ... och samma for Y - led
	; Initialize A/D-converter
	ldi r16, AD_CHAN_Y ; PA1 = ADC1
	out ADMUX, r16
	ldi r16, (1 << ADEN)
	out ADCSRA, r16
	sbi ADCSRA, ADSC ; Start conversion

	; Wait for conversion to finish.
	WAITY:
	sbic ADCSRA, ADSC
	rjmp WAITY

	in r16, ADCH ; Get result, only care for two highest bits.

	; If 00, go down. If 11, go up.
	cpi r16, 0
	brne NOT_DOWN
	DECSRAM POSY
	NOT_DOWN:

	cpi r16, 3
	brne NOT_UP
	INCSRAM POSY
	NOT_UP:

JOY_LIM:
	call LIMITS ; don � t fall off world !
	ret

; ---------------------------------------
; --- LIMITS Limit POSX , POSY coordinates
; --- Uses : r16 , r17
LIMITS:
	lds r16, POSX ; variable
	ldi r17, 7 ; upper limit +1
	call POS_LIM ; actual work
	sts POSX, r16
	lds r16, POSY ; variable
	ldi r17, 5 ; upper limit +1
	call POS_LIM ; actual work
	sts POSY, r16
	ret
POS_LIM:
	ori r16, 0 ; negative ?
	brmi POS_LESS ; POSX neg = > add 1
	cp r16, r17 ; past edge
	brne POS_OK
	subi r16, 2
POS_LESS:
	inc r16
POS_OK:
	ret

; ---------------------------------------
; --- UPDATE VMEM
; --- with POSX /Y , TPOSX /Y
; --- Uses : r16 , r17 , Z
UPDATE:
	clr ZH
	ldi ZL, LOW(POSX)
	call SETPOS
	clr ZH
	ldi ZL, LOW(TPOSX)
	call SETPOS
	ret

; --- SETPOS Set bit pattern of r16 into * Z
; --- Uses : r16 , r17 , Z
; --- 1 st call Z points to POSX at entry and POSY at exit
; --- 2 nd call Z points to TPOSX at entry and TPOSY at exit
SETPOS:
	ld r17, Z+ ; r17 = POSX
	call SETBIT ; r16 = bitpattern for VMEM + POSY
	ld r17, Z ; r17 = POSY Z to POSY
	ldi ZL, LOW( VMEM )
	add ZL, r17 ; Z= VMEM + POSY , ZL = VMEM +0..4
	ld r17, Z ; current line in VMEM
	or r17, r16 ; OR on place
	st Z, r17 ; put back into VMEM
	ret

; --- SETBIT Set bit r17 on r16
; --- Uses : r16 , r17
SETBIT :
	ldi r16, $01 ; bit to shift
SETBIT_LOOP:
	dec r17
	brmi SETBIT_END ; til done
	lsr r16 ; shift
	jmp SETBIT_LOOP
SETBIT_END:
	ret

; ---------------------------------------
; --- Hardware init
; --- Uses :
HW_INIT:
	;DONE: Konfigurera hardvara och MUX - avbrott enligt
	;ditt elektriska schema . Konfigurera
	;flanktriggat avbrott pa INT0 ( PD2 ).

	ldi r16, 0b11110000
	out DDRA, r16
	;ldi r16, $00
	;out PORTA, r16
	ldi r16, $ff
	out DDRB, r16

	ldi r16, 0b01000000
	out GICR, r16 ; Enables interrupt INT0
	ldi r16, 0b00000011 ; Makes INT0 trigger on rising edge. Bit 0 and 1 control INT0.
	out MCUCR, r16

	sei ; display on
	ret
	
; ---------------------------------------
; --- WARM start . Set up a new game .
; --- Uses : r16
WARM:
	;DONE: Satt startposition ( POSX , POSY )=(0, 2)
	ldi r16, 0
	sts POSX, r16
	ldi r16, 2
	sts POSY, r16

	push r0
	push r0
	call RANDOM ; RANDOM returns TPOSX , TPOSY on stack
	;DONE Satt startposition ( TPOSX , TPOSY )
	pop r16
	sts TPOSX, r16
	pop r16
	sts TPOSY, r16

	call ERASE
	ret

; ---------------------------------------
; --- RANDOM generate TPOSX , TPOSY
; --- in variables passed on stack .
; --- Usage as :
; --- push r0
; --- push r0
; --- call RANDOM
; --- pop TPOSX
; --- pop TPOSY
; --- Uses : r16, r17
RANDOM :
	in r16, SPH
	mov ZH, r16
	in r16, SPL
	mov ZL, r16

	;DONE: Anvand SEED for att berakna TPOSX
	lds r16, SEED
	andi r16, 0b00000111
	cpi r16, 5
	brlo VALIDX ; Branch if lower
	subi r16, 4 ; Subtract 4 if too large
	VALIDX:
	inc r16 ; Make r16 in the range 2->6
	inc r16
	;DONE: store TPOSX 2..6
	std Z+3, r16

	;DONE: Anvand SEED for att berakna TPOSY
	lds r16, SEED
	andi r16, 0b00000111
	cpi r16, 5
	brlo VALIDY ; Branch if lower
	subi r16, 4 ; Subtract 4 if too large
	VALIDY:
	;DONE: store TPOSY 0..4
	std Z+4, r16

	ret

; ---------------------------------------
; --- ERASE videomemory
; --- Clears VMEM .. VMEM +4
; --- Uses : r16
ERASE:
	;DONE: Radera videominnet
	ldi r16, 0
	sts VMEM, r16
	sts VMEM+1, r16
	sts VMEM+2, r16
	sts VMEM+3, r16
	sts VMEM+4, r16
	
	ret

; ---------------------------------------
; --- BEEP ( r16 ) r16 half cycles of BEEP - PITCH
; --- Uses :
BEEP:
	;*** skriv kod for ett ljud som ska markera traff ***
	ret

DELAY:
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
