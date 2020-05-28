# TDP015 Programming Assignment 3
# Number Theory
# Skeleton Code

import random
import sys

# In this assignment you are asked to implement a simple version of
# the RSA cryptosystem.
#
# https://en.wikipedia.org/wiki/RSA_(cryptosystem)

# ## Problem 1
#
# At its core, the RSA cryptosystem deals with integers. In order to
# encrypt and decrypt strings, we first need to convert them into
# numbers. To do that we first encode each string into a byte array,
# and then convert each byte into an integer. Here is an example:
#
# String: 'foo'
# Byte array: b'foo'
# Integers: [102, 111, 111]
#
# In real implementations of RSA, a single integer corresponds to a
# block of bytes. Here is an example where we encode blocks of 2 bytes
# instead of single bytes. In order for this to work, we need to pad
# the original byte string with a zero byte:
#
# String: 'foo'
# Byte array: b'foo'
# Byte array, padded: b'foo\x00'
# Integers: [26223, 28416]
#
# To encode a string into a byte array, use
# https://docs.python.org/3/library/stdtypes.html#str.encode
#
# To decode a byte array into a string, use
# https://docs.python.org/3/library/stdtypes.html#str.decode
#
# To convert a byte array to an integer, use
# https://docs.python.org/3/library/stdtypes.html#int.from_bytes
#
# To convert an integer into a byte array, use
# https://docs.python.org/3/library/stdtypes.html#int.to_bytes

def text2ints(text, m):
    """Encode a string into a list of integers.

    Args:
        text: A string.
        m: The size of a block in bytes.

    Returns:
        A list of integers.

    """

    # Build chunks of the text to be encoded:
    chunks = []
    # Loops once per chunk needed.
    offset = 1
    if len(text)%m == 0: #avoid empty chunks
        offset = 0
    for x in range(0, len(text)//m+offset):
        chunk = text[x*m:x*m+m]
        # Applies padding if the chunk is not of size m.
        if(len(chunk) != m):
            chunk += "\x00" * (m-(len(chunk)))

        chunks.append(chunk)

    # Encodes all chunks into integers.
    res = []
    for chunk in chunks:
        res.append(int.from_bytes(chunk.encode('iso-8859-1'), byteorder = "big"))

    return res

def ints2text(ints, m):
    """Decode a list of integers into a string.

    Args:
        ints: A list of integers.
        m: The size of a block in bytes.

    Returns:
        A string.
    """

    b = bytearray()
    for i in ints:
        b += i.to_bytes(m, byteorder = "big")

    return b.decode('iso-8859-1')

# ## Problem 2
#
# Your next task is to implement the Euclidean algorithm for computing
# the greatest common divisor (gcd) of two integers `a` and `b`. You
# will actually start by implementing an extended version of this
# algorithm that computes not only the gcd but also a pair of
# so-called Bezout coefficients. These are integers `x` and `y`
# satisfying the equation
#
# ax + by = gcd(a, b)
#
# The extended Euclidean algorithm is described here:
# https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
#
# Once you have implemented the extended Euclidean algorithm,
# implementing the standard algorithm is trivial.

def xgcd(a, b):
    """Computes the greatest common divisor (gcd) and a pair of Bezout
    coefficients for the specified integers.

    Args:
        a: An integer.
        b: An integer.

    Returns:
        A triple `(g, x, y)` where `g = gcd(a, b)` and `x`, `y` are
        Bezout coefficients for `a` and `b`.

    """

    s = 0
    old_s = 1 # First coefficient

    t = 1
    old_t = 0 # Second coefficient

    r = b
    old_r = a # GCD

    while r != 0:
        quotient = old_r // r
        old_r, r = r, old_r - quotient * r
        old_s, s = s, old_s - quotient * s
        old_t, t = t, old_t - quotient * t


    return old_r, old_s, old_t

def gcd(a, b):
    """Computes the greatest common divisor (gcd) of the specified
    integers.

    Args:
        a: An integer.
        b: An integer.

    Returns:
        The greatest common divisor of the specified integers.

    """

    return xgcd(a, b)[0]

# ## Problem 3
#
# Your next task is to implement a function that generates an RSA key
# pair from a pair of two prime numbers, `p` and `q`. A key pair
# consists of a public key `(e, n)` (`e` stands for "encrypt") and a
# private key `(d, n)` (`d` stands for "decrypt").  Use the following
# recipe (which is slightly simplified from the real RSA cryptosystem):
#
# 1. Compute n = p * q
# 2. Compute phi = (p-1) * (q-1)
# 3. Choose 1 < e < phi such that e and phi are coprime.
# 4. Determine d as the modular multiplicative inverse of e modulo phi.
#
# For step 3, use a random number generator and the Euclidean
# algorithm from Problem 2 to generate numbers in the relevant range
# until you find a number that satisfies the criterion.
#
# For step 4, note that the modular multiplicative inverse of e modulo
# phi is simply the Bezout coefficient for e, modulo phi. This means
# that you can use the extended Euclidean algorithm from Problem 2.

def generate_keypair(p, q):
    """Generate an RSA key pair.

    An RSA key pair consists of a public key `(e, n)` and a private
    key `(d, n)`.

    Args:
        p: A prime number.
        q: A prime number, distinct from `p`.

    Returns:
        An RSA keypair.

    """

    n = p * q #1
    phi = (p-1) * (q-1) #2

    e = None #3
    random.seed()
    while e == None:
        e_try = random.randint(2, phi-1)
        if gcd(e_try, phi) == 1:
            e = e_try

    d = xgcd(e, phi)[1]%phi #4 TODO Does this need integer conversion?
    assert (d*e)%phi == 1

    return (e, n), (d, n)

# ## Problem 4
#
# Implement functions for encryption and decryption. The encryption
# and decryption of a single integer i is very simple:
#
# Encryption: i^e % n
# Decryption: i^d % n
#
# (You can implement this efficiently using the `pow()` function.)
#
# However, remember that we really want to encrypt and decode
# strings. You will therefore have to use the functions that you
# implemented for Problem 1. As the block size, choose the largest
# number of bytes that still fit into the number n. For example, if n
# >= 255 but n < 65025 then the block size should be 1, and if n >=
# 65025 but n < 16581375 then the block size should be 2.

def get_block_size(n):
        assert n >= 255
        block_size = 1
        while (not pow(255, block_size+1) > n >= pow(255, block_size)):
            block_size += 1
        return block_size

def encrypt(pubkey, plaintext):
    """Encrypt a plaintext message using a public key.

    Args:
        pubkey: A key.
        plaintext: A plaintext message (a string).

    Returns:
        A ciphertext message (a list of integers).

    """
    n = pubkey[1]
    e = pubkey[0]
    block_size = get_block_size(n)
    ints = text2ints(plaintext, block_size)
    encrypted = list(map(lambda i: pow(i,e,n), ints))
    return encrypted

def decrypt(seckey, ciphertext):
    """Decrypt a ciphertext message using a secret key.

    Args:
        seckey: A key.
        ciphertext: A ciphertext message (a list of integers).

    Returns:
        A plaintext message (a string).

    """
    n = seckey[1]
    d = seckey[0]
    block_size = get_block_size(n)
    decrypted = list(map(lambda i: pow(i,d,n), ciphertext))
    text = ints2text(decrypted, block_size)
    return text

# To test your implementation, you can use the following code, which
# will allow you to generate a key pair and encrypt messages.

if __name__ == "__main__":

    # p = int(input("Enter prime number p: "))
    # q = int(input("Enter prime number q: "))
    # print("Generating keypair")
    # pubkey, seckey = generate_keypair(p, q)
    # print("The public key is", pubkey, "and the private key is", seckey)
    # message = input("Enter a message to encrypt with the public key: ")
    # encrypted_msg = encrypt(pubkey, message)
    # print("The encrypted message is: ", end="")
    # print(" ".join(map(lambda x: str(x), encrypted_msg)))
    # print("The decrypted message is: ", end="")
    # print(decrypt(seckey, encrypted_msg))

    # chunk_size = 3
    # ints = text2ints("swedishpasta", chunk_size)
    # print(ints)
    # print(ints2text(ints, chunk_size))
    # print(gcd(54, 24))

    p = 401 # 173, 401, 3457631
    q = 787 # 179, 787, 4563413
    pubkey, seckey = generate_keypair(p, q)
    print("The public key is", pubkey, "and the private key is", seckey)
    message = """Short string swe åäö"""
    print("The message is '" + message + "'")
    print("")
    encrypted_msg = encrypt(pubkey, message)
    print("The encrypted message is: ", end="")
    print("".join(map(lambda x: str(x), encrypted_msg)))
    decrypted_message = decrypt(seckey, encrypted_msg)
    print("The decrypted message is: '" + decrypted_message + "'")
    print("block_size:", get_block_size(p*q))
    print("enc_msg == dec_msg:", message == decrypted_message)
    print(message, len(message))
    print(decrypted_message, len(decrypted_message))

    c = [259114, 14038, 13667, 74062, 148955, 50062, 36907, 18603, 93303, 170481, 7991]
    sec_key = (91307, 268483)
    dec_msg = decrypt(sec_key, c)
    print(dec_msg)

# As a further test, we have generated a ciphertext for you. With a
# working implementation, you should be able to decode that ciphertext
# using the secret key (91307, 268483).
#
# 259114 14038 13667 74062 148955 50062 36907 18603 93303 170481 7991

     #c = [259114, 14038, 13667, 74062, 148955, 50062, 36907, 18603, 93303,
     #        170481, 7991]
     #sec_key = (91307, 268483)
     #dec_msg = decrypt(sec_key, c)
     #print(dec_msg)
