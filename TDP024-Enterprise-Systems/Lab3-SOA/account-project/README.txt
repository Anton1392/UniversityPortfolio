Användbara kommandon
  * mvn compile
  * mvn clean repackage
  * java -jar person-rest-1.0.jar
  * mvn -Dmaven.test.skip=true clean package
    * // kompilera om allt

Användbara URLer:
  http://localhost:8080/account-rest/account/create?accounttype=CHECK&person=3&bank=NORDEA
  http://localhost:8080/account-rest/account/find/person?person=3
  http://localhost:8080/account-rest/account/debit?id=1&amount=20
  http://localhost:8080/account-rest/account/credit?id=2&amount=20
  http://localhost:8080/account-rest/account/transactions?id=2

3 tjänster som nås genom REST-api, "account", "person", "bank"

Account har beroende av att person och bank finns tillgänglig.
Account använder http requests för att kommunicera med person och bank. (HTTPHelperImpl.java i logiklagret.)

Nedanstående lista bör implementeras uppifrån och ner.

person
  * person-datalayer (skapa persistence-kopplingar)
  * person-logic (skapa metoder)
  * person-rest (sätta upp routes)
  * person-tests (testa logiklagret (kanske rest-lagret också))

bank
  * bank-datalayer
  * bank-logic
  * bank-rest
  * bank-tests

account
  * account-logic
  * account-rest
  * account-datalayer
