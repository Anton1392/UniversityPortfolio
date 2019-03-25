# coding=utf-8
letterTable = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
]

letterNumberTable = {
    "A":1,
    "B":2,
    "C":3,
    "D":4,
    "E":5,
    "F":6,
    "G":7,
    "H":8,
    "I":9,
    "J":10,
    "K":11,
    "L":12,
    "M":13,
    "N":14,
    "O":15,
    "P":16,
    "Q":17,
    "R":18,
    "S":19,
    "T":20,
    "U":21,
    "V":22,
    "W":23,
    "X":24,
    "Y":25,
    "Z":26
}


# Creates a card with a name and value
def create_card(value):
    name = generateName(value)
    card = (value, name)
    return card


# Function for generating names
def generateName(value):
    suit = get_suit(value)
    valueNameTable = {
        1: "Ace",
        2: "Two",
        3: "Three",
        4: "Four",
        5: "Five",
        6: "Six",
        7: "Seven",
        8: "Eight",
        9: "Nine",
        10: "Ten",
        11: "Jack",
        12: "Queen",
        13: "King",
        14: "Joker"
    }
    valueName = ""
    if value <= 26:
        if value > 13:
            valueName = valueNameTable[value-13]
        else:
            valueName = valueNameTable[value]
        name = valueName + " of " + suit
        return name
    elif value == 27:
        return "Joker A"
    elif value == 28:
        return "Joker B"


# Creates a deck
def create_deck():
    deck = []
    for value in range(1, 29):
        deck.append(create_card(value))

    return deck


# Gets the value of a card
def get_value(card):
    if card[0] > 26:
        return card[0]
    elif card[0] > 13:
        return card[0]-13
    else:
        return card[0]


# Gets the encryption value of a card.
def get_encryption_value(card):
    return card[0]


# Gets the suit of a card
def get_suit(value):
    if value > 26:
        return "Joker"
    elif value > 13:
        return "Spades"
    else:
        return "Hearts"


# Displays a card
def display_card(card):
    print(card[1])


# Picks a card from the deck, defaults to the top card
def pick_card(deck, i=None):
    if i == None:
        i = 0
    return deck.pop(i)


# Moves a card between two positions in the deck.
def move_card(deck, original, target):
    deck[original], deck[target] = deck[target], deck[original]


# Inserts a card into a particular index in the deck.
def insert_card(card, deck, i=None):
    if i == None:
        i = 0
    return deck.insert(i, card)


# Shuffles a deck our special little way.
def shuffle_deck(deck):
    # Dela leken i två delar, part1 och part2.
    part1 = []
    part2 = []
    for i in range(0, int(len(deck)/2)):
        part1.append(deck[i])
    for j in range(int(len(deck)/2), len(deck)):
        part2.append(deck[j])

    # Blandning - Ta först ett kort från första hälften, sedan ett kort från andra hälften, osv osv.
    deck = []
    for x in range(0, 14):
        deck.append(pick_card(part1))
        deck.append(pick_card(part2))
    return deck


# Solitare keystream iteration
def solitaire_iteration(deck, encryption_key):

    # Move Joker A one step down in the deck.
    jIndex = 0
    for x in range(0, len(deck)):
        if deck[x][1] == "Joker A":
            jIndex = x
            if jIndex == len(deck)-1:
                insert_card(pick_card(deck, jIndex), deck, 1)
            else:
                insert_card(pick_card(deck, jIndex), deck, jIndex+1)
            break

    # Flytta Joker B två steg ner i kortleken.
    jBIndex = 0
    for x in range(0, len(deck)):
        if deck[x][1] == "Joker B":
            jBIndex = x
            # Second to bottom in the deck -> Beneath the top-most card
            if jBIndex == len(deck)-2:
                insert_card(pick_card(deck, jBIndex), deck, 1)
            # Bottom in the deck -> Beneath the second top-most card.
            elif jBIndex == len(deck)-1:
                insert_card(pick_card(deck, jBIndex), deck, 2)
            # Move card down two steps.
            else:
                insert_card(pick_card(deck, jBIndex), deck, jBIndex+2)
            break


    # Joker split shuffle.
    groupA = []
    groupB = []
    groupC = []

    # Top of deck to the first joker.
    for x in range(0, len(deck)):
        if deck[0][1] == "Joker A" or deck[0][1] == "Joker B":
            break
        else:
            groupA.append(pick_card(deck))

    # From first joker to second joker, include both of them.
    groupB.append(pick_card(deck))  # Appends the first Joker.
    for x in range(0, len(deck)):
        doBreak = False
        if deck[0][1] == "Joker A" or deck[0][1] == "Joker B":
            doBreak = True
        groupB.append(pick_card(deck))
        if doBreak:
            break

    # Group C is the rest of the cards.
    for x in range(0, len(deck)):
        groupC.append(pick_card(deck))

    # Adds the groups together.
    deck.extend(groupA)
    deck.extend(groupB)
    deck.extend(groupC)

    # Top to bottom shuffle.
    bottomValue = get_value(deck[-1])
    bottomCard = pick_card(deck, -1)
    for i in range(bottomValue):
        deck.append(pick_card(deck))
    deck.append(bottomCard)

    # Top card encryption selector
    topValue = get_encryption_value(deck[0])



    # If joker, ignore, else find the proper letter.
    encryption_letter = ""
    if topValue >= 27:
        pass
    else:
        encryption_letter = letterTable[topValue-1]

    return encryption_letter


# Function for generating a solitaire keystream
def solitaire_keystream(length, deck):
    encryption_key = ""
    while len(encryption_key) < length:
        encryption_key = encryption_key + solitaire_iteration(deck, encryption_key)
    return encryption_key


# Converts a list of letters to the corresponding numbers
def text_to_numbers(text):
    numbers = []
    for l in text:
        numbers.append(letterNumberTable[l])
    return numbers


# Converts a list of numbers into the corresponding letters.
def numbers_to_text(numbers):
    text = ""
    for l in numbers:
        text = text + (letterTable[l-1])
    return text


# Makes a deck suitable for encryption, using our special secret sauce recipe for disaster.
def makeCryptDeck():
    newDeck = create_deck()
    newDeck = shuffle_deck(newDeck)
    newDeck = shuffle_deck(newDeck)
    newDeck = shuffle_deck(newDeck)
    return newDeck


# Encrypts a singular message.
def encrypt():
    # Ask for users input
    text_to_encrypt = input("Insert what you want to encrypt, letters A-Z.")
    text_to_encrypt = text_to_encrypt.upper() # Converts to uppercase

    newDeck = makeCryptDeck()

    encryptKey = solitaire_keystream(len(text_to_encrypt), newDeck)
    textInNumbers = text_to_numbers(text_to_encrypt)
    encryptKeyInNumbers = text_to_numbers(encryptKey)

    listSum = []

    for x in range(0, len(textInNumbers)):
        if textInNumbers[x] + encryptKeyInNumbers[x] > 26:
            listSum.append(textInNumbers[x] + encryptKeyInNumbers[x] -26)
        else:
            listSum.append(textInNumbers[x] + encryptKeyInNumbers[x])
    listLetters = numbers_to_text(listSum)
    return listLetters


# Decrypts a singular decrypted message.
def decrypt(encrypted_string):
    string_in_numbers = text_to_numbers(encrypted_string)

    cryptDeck = makeCryptDeck()
    decryptKey = solitaire_keystream(len(encrypted_string), cryptDeck)

    decryptKeyInNumbers = text_to_numbers(decryptKey)

    listOfDecryptNumbers = []
    for x in range(0, len(string_in_numbers)):
        if string_in_numbers[x]-decryptKeyInNumbers[x] < 1:
            listOfDecryptNumbers.append(string_in_numbers[x]-decryptKeyInNumbers[x]+26)
        else:
            listOfDecryptNumbers.append(string_in_numbers[x]-decryptKeyInNumbers[x])

    listOfLetters = numbers_to_text(listOfDecryptNumbers)
    return listOfLetters

encryptString = encrypt()
print(encryptString)
print(decrypt(encryptString))
