/**********************************************************************
 *  Mönsterigenkänning readme.txt
 **********************************************************************/

 Ungefärligt antal timmar spenderade på labben (valfritt): ~1h

/**********************************************************************
 *  Empirisk    Fyll i tabellen nedan med riktiga körtider i sekunder
 *  analys      när det känns vettigt att vänta på hela beräkningen.
 *              Ge uppskattningar av körtiden i övriga fall.
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

	* Uppskattningar: Varje fördubbling av N gav ~7x längre körtid, därför är värdena som de är.
/**********************************************************************
 *  Teoretisk   Ge ordo-uttryck för värstafallstiden för programmen som
 *  analys      en funktion av N. Ge en kort motivering.
 *
 **********************************************************************/

Brute: O(n^4)
Den fjärde for-loppen blir relevant om de flesta punkter är "collinear".
slopeTo är konstant tid.

Sortering: O(n^2 * log n)
Vi loopar igenom alla punkter som origo, dyraste operationen inuti den loopen är sorteringen, vilket ligger på O(n log n) enligt dokumentationen. Totalt O(n^2 * log n)
