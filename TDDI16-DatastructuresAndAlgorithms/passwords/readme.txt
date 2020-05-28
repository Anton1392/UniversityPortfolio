/**********************************************************************
 *  Knäcka lösenord readme.txt
 **********************************************************************/

 Ungefärligt antal timmar spenderade på labben (valfritt): ~5h

/**********************************************************************
 *  Ge en högnivåbeskrivning av ditt program decrypt.c.
 **********************************************************************/

Decrypt.cpp tar in en sträng och en krypteringstabell. Strängen är ett krypterat lösenord, som krypterades med subset_sum funktionen och den inmatade krypteringstabellen.

Decrypt brute-forcar fram alla möjliga lösenord för de första hälften bitarna i lösenordet, krypterar de enligt subset_sum, och sparar undan dem.

Därefter brute-forcas den sista hälften av bitarna i lösenordet på samma sätt, men istället så jämförs dem med de sparade krypteringarna vi fick fram från första hälften enligt (andra_hälften = hash-första_hälften.).
Om likheten ovan gäller, så har vi hittat ett möjligt lösenord, och vi skriver ut det.

Strategin för lösningen kallas meet in the middle, vi delar upp problemet i två mindre problem, löser de för sig, och kombinerar resultatet i slutet.

/**********************************************************************
 *  Beskriv symboltabellen du använt för decrypt.c.
 **********************************************************************/

Vi har använt std::unordered_map för att bygga tabellen.
Nyckeln i tabellen är en Key som representerar en krypterad del av lösenordet enligt (hashed - första_hälften), aka. andra hälften som vi letar efter.

Värdet i tabellen är en vector av klassen Key, som representerar alla möjliga okrypterade del-lösenord som stämmer överens med hashen i nyckeln.

/**********************************************************************
 *  Ge de dekrypterade versionerna av alla lösenord med 8 och 10
 *  bokstäver i uppgiften du lyckades knäca med DIN kod.
 **********************************************************************/


8 bokstäver         10 bokstäver
-----------         ------------
congrats			completely
youfound			unbreakabl
theright			cryptogram
solution			ormaybenot


/****************************************************************************
 *  Hur lång tid använder brute.c för att knäcka lösenord av en viss storlek?
 *  Ge en uppskattning markerad med en asterisk om det tar längre tid än vad
 *  du orkar vänta. Ge en kort motivering för dina uppskattningar.
 ***************************************************************************/


Char     Brute     
--------------
 4		  0s
 5		  4s
 6		  170s
 8		  174 080s*, för varje extra tecken behövs 32x fler operationer (storleken på alfabetet). 8 har två fler tecken än 6, alltså ~32x32 = 1024x körtid. 1024*170 = 174 080s


/******************************************************************************
 *  Hur lång tid använder decrypt.c för att knäcka lösenord av en viss storlek?
 *  Hur mycket minne använder programmet?
 *  Ge en uppskattning markerad med en asterisk om det tar längre tid än vad
 *  du orkar vänta. Ge en kort motivering för dina uppskattningar.
 ******************************************************************************/


Char    Tid (sekunder)    Minne (bytes)
----------------------------------------
6		0				  2 562 006					// Vi använder valgrind och kollar värdet 
8		2				 67 059 264					// "total heap usage" för minne, tror det stämmer.
10		103			  2 144 000 000*
12		3296s*		 68 608 000 000*

* Varannat extra tecken bör ge 32x körtid och minne eftersom vi delar upp längden i två. O(32^(n/2))

/*************************************************************************
 * Hur många operationer använder brute.c för ett N-bitars lösenord?
 * Hur många operationer använder din decrypt.c för ett N-bitars lösenord?
 * Använd ordo-notation.
 *************************************************************************/

* brute.c: O(32^N)

* decrypt.c: O(32^(ceil(N/2)))

ceil = runda uppåt. N = 5 ger O(32^3)

/*************************************************************************
 * Vilka egenskaper skulle ni leta efter i en hashfunktion för att
 * försäkra er om att den är "säker"?
 *************************************************************************/

Om hashen beror på flera variabler så blir den mycket svårare att bryta. Exempel:

H = a^2 + b^2 + c^2
är mycket svårare att bryta än:
H = a^2 + b^2

Subset-sum funktionen är väldigt bra eftersom hashen beror på alla bitar i lösenordet.
Som vi såg ovan så är den väldigt svår att brute-forca för N > 6.
Våran lösning med meet-in-the-middle är istortsett en "effektivare" bruteforce, men även den strulade för N > 10.
Om N skulle vara större, skulle inte någon av brute eller decrypt klara det inom rimlig tid.

I denna lab så visste vi till och med vilka tabeller som lösenord krypterades med och vilken strategi som användes. Skulle dessa vara hemliga skulle labben vara näst in till omöjlig.
