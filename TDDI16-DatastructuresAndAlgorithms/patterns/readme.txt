/**********************************************************************
 *  M�nsterigenk�nning readme.txt
 **********************************************************************/

 Ungef�rligt antal timmar spenderade p� labben (valfritt): ~1h

/**********************************************************************
 *  Empirisk    Fyll i tabellen nedan med riktiga k�rtider i sekunder
 *  analys      n�r det k�nns vettigt att v�nta p� hela ber�kningen.
 *              Ge uppskattningar av k�rtiden i �vriga fall.
 *
 **********************************************************************/
    
      N       brute       sortering
 ----------------------------------
    150		31ms		31ms
    200		38ms		53ms
    300		91ms		109ms
    400		189ms		128ms
    800		1,3s		272ms
   1600		8,9s		981ms
   3200		61,1s		2.7s
   6400		427,8s*		11.3s
  12800		2994,8ms*	53.1s

	* Uppskattningar: Varje f�rdubbling av N gav ~7x l�ngre k�rtid, d�rf�r �r v�rdena som de �r.
/**********************************************************************
 *  Teoretisk   Ge ordo-uttryck f�r v�rstafallstiden f�r programmen som
 *  analys      en funktion av N. Ge en kort motivering.
 *
 **********************************************************************/

Brute: O(n^4)
Den fj�rde for-loppen blir relevant om de flesta punkter �r "collinear".
slopeTo �r konstant tid.

Sortering: O(n^2 * log n)
Vi loopar igenom alla punkter som origo, dyraste operationen inuti den loopen �r sorteringen, vilket ligger p� O(n log n) enligt dokumentationen. Totalt O(n^2 * log n)
