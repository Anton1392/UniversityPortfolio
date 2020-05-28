INIT:
	ldi r16, low(ramend)
	out SPL, r16
	ldi r16, high(ramend)
	out SPH, r16

	call HWINIT

	rjmp START

HWINIT:
    ldi r16, 0
	out DDRB, r16
	ldi r16, 0b11111111
	out DDRA, r16
	ldi r17, 0
	ret


START:
	in r16, PINB
	andi r16, 0b00000001
	cpi r16, 0b00000001
	brne PART1
	inc r17

	PART1:
	in r16, PINB
	andi r16, 0b00000010
	cpi r16, 0b00000010
	brne PART2
	out PORTA, r17

	PART2:
	rjmp START
