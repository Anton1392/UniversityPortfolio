# TDP015 Programming Assignment 4
# Image Classification

import math
import mnist
import png
import random

# ## Introduction
#
# In this assignment you will implement a probabilistic classifier for
# handwritten digit recognition: a system that takes an image of a
# digit as its input, and predicts the digit depicted in it.
#
# To train and evaluate your system, you will use the 70,000 images in
# the MNIST Database of Handwritten Digits:
#
# https://en.wikipedia.org/wiki/MNIST_database
#
# Each image in this database consists of 28x28 pixels with grayscale
# values, and has been manually labelled with the digit depicted in
# the image. For the purposes of this assignment, the grayscale values
# have been converted to black-or-white values.

# ## Problem 0
#
# Write code that reads the training data for the assignment, picks
# out 10 random images, one for each digit, and writes the images to
# disk as PNG files.
#
# Use the following code pattern to loop over the training data:
#
# for image, digit in mnist.read_training_data():
#     ...
#
# On the Python side of things, an image is represented as a tuple
# with 784 components: each component corresponds to a pixel, and has
# a value of either 1 or 0 ("black" or "white").
#
# To save images as PNG files, use `png.save_png()`. This function
# takes four arguments: (1) the width of the image to be generated,
# (2) its height, (3) a list with the grayscale values of the image
# (integers between 0 and 255), and (4) the name of the file to which
# the image should be written. Call the function like this:
#
# png.save_png(28, 28, values, 'digit-{}.png'.format(digit))

def make_images():
    """Generates PNG files from random digits in the training data."""
    # TODO: Replace the following line with your own code.

    # Hardcoded amounts, counted through out-commented loop below. This speeds up debugging.
    digitCount = {0:5923, 1:6742, 2:5958, 3:6131, 4:5842, 5:5421, 6:5918, 7:6265, 8:5851, 9:5949}
    # Counts how many images of each digit there are
    """
    digitCount = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0} # key = digit, value = amount
    for image, digit in mnist.read_training_data():
        digitCount[digit] += 1
    """

    randomPicks = {} # Which image of each digit to be picked
    for i in range(0, 10):
        randomPicks[i] = random.randint(1, digitCount[i])

    imageValues = [] # list of tuples (digit, image data)
    counters={0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1} # Counters for each individual digit.
    for image, digit in mnist.read_training_data():
        # Pick the randomly selected image
        if counters[digit] == randomPicks[digit]:
            imageValues.append((digit, image))
        counters[digit]+=1

    # Saves the randomly picked data to image files.
    for tup in imageValues:
        data = list(tup[1])
        # Converts 0s to 255s and 1s to 0s
        converted = [255 if i == 0 else 0 for i in data]
        png.save_png(28, 28, converted, 'digit-{}.png'.format(tup[0]))
        print("Saved image with digit: " + str(tup[0]))

# ## Problem 1
#
# The first problem that you have to solve is to estimate the two
# types of probabilities required by the classifier:
#
# 1. For each possible digit d, the a priori probability that an image
# represents d, rather than any other digit. You should estimate this
# probability as the percentage of images in the training data that
# have been labelled with d.
#
# To store probabilities of type 1, use a dictionary `pd` that maps
# digits (integers) to probabilities (floats). For example, `pd[7]`
# should give the probability that a random image depicts the digit 7.
#
# 2. For each possible digit d and each possible pixel p (indexed by
# an integer between 0 and 783), the conditional probability that p is
# black given that the image represents d. You should estimate this
# probability as the percentage of d-images in the training data in
# which pixel p is black.
#
# To store probabilities of type 2, use a two-layer dictionary
# `pp`. For example, `pp[7][42]` should give the conditional
# probability that pixel 42 is black in a random image of the digit 7.
#
# Implementation detail: To avoid zero probabilities, pretend that
# each pixel is black in one additional d-image. For example, if pixel
# 0 is never black in images of the digit 7, pretend that it is
# actually black in 1 image; and if pixel 391 is black in 130 images
# of the digit 7, pretend that it is actually black in 131 images.
#
# The following numbers may be useful for debugging:
#
# * Number of images depicting the digit 7: 6265
# * Number of black pixels in images depiciting the digit 7: 568207
# * The same number, but including "hallucinated" pixels: 568991

def train(data):
    """Estimate the probabilities of the classifier from data.

    Args:
        data: An iterable yielding image–label pairs.

    Returns:
        A pair of two dictionaries `pd`, `pp`, as decribed above.
    """
    ########################
    # PD calculation
    ########################
    pd = {d: 0 for d in range(10)}
    # Hardcoded amounts, counted through out-commented loop below. This speeds up debugging.
    digitCount = {0:5923, 1:6742, 2:5958, 3:6131, 4:5842, 5:5421, 6:5918, 7:6265, 8:5851, 9:5949}
    # Counts how many images of each digit there are
    """
    digitCount = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0} # key = digit, value = amount
    for image, digit in data
        digitCount[digit] += 1
    """
    totalImages = sum(digitCount.values())
    for i in range(0, 10):
        pd[i] = digitCount[i]/totalImages

    ########################
    # PP calculation
    ########################
    pp = {d: {p: 1 for p in range(784)} for d in range(10)}

    # Pixel counting
    pixelCount = {d: {p: 1 for p in range(784)} for d in range(10)} # Amount of black pixels of certain pixels and digits
    pixelSums = {d: {p: 1 for p in range(784)} for d in range(10)} # Amount of total pixels of certain pixels and digits
    for image, digit in data: # Loops through all images in data
        pxIdx = 0
        for px in image: # Loops through all pixels in the image
            if px == 1: # If pixel is black
                pixelCount[digit][pxIdx] += 1
            pixelSums[digit][pxIdx] += 1
            pxIdx += 1

    # Calculates pixel probabilities.
    for digit, counts in pixelCount.items():
        for pxNo, pxAmount in counts.items():
            pp[digit][pxNo] = pxAmount/pixelSums[digit][pxNo]

    return pd, pp

# ## Problem 2
#
# Once you have estimated the relevant probabilities, you can use them
# to predict the digit that a given image represents. Implement the
# following algorithm: For each possible digit d, compute a "score",
# defined as the product of the a priori probability that the image
# represents d (from the `pd` dictionary) and, for each black pixel p
# in the image, the conditional probability that p is black given that
# the image represents d (from the `pp` dictionary). Then, return that
# digit which got the highest score.
#
# Implementation detail: Probabilities are small numbers, and when
# many small numbers are multiplied, there is a risk for underflow. To
# avoid this, convert all numbers to logarithmic scale (using
# `math.log`) and add probabilities instead of multiplying them.

def predict(model, image):
    """Predict the digit depicted by an image.

    Args:
        model: A pair of two dictionaries `pd`, `pp`, as decribed above.
        image: A tuple representing an image.

    Returns:
        The digit depicted by the image.
    """
    assert len(image) == 784
    pd = model[0]
    pp = model[1]

    probs = {n: math.log(pd[n]) for n in range(0, 10)}

    for digit, pixels in pp.items():
        for pixel, p in  pixels.items():
            color = image[pixel]
            if color:
                probs[digit] = probs[digit] + math.log(p)

    guess = 0
    for digit, p in probs.items():
        if p > probs[guess]:
            guess = digit

    return guess

# ## Problem 3
#
# The last step is to assess the accuracy of your classifier on the
# test portion of the MNIST database. Here, accuracy is defined as the
# percentage of correctly classified images, that is, the percentage
# of images for which your system predicts the same digit that is
# specified in the test data.
#
# The classification accuracy should be above 80%.

def evaluate(model, data):
    """Evaluate the classifier on test data.

    Args:
        model: A pair of two dictionaries `pd`, `pp`, as decribed above.
        data: An iterable yielding image–label pairs.

    Returns:
        The accuracy of the classifier on the specified data.
    """
    correct = 0
    fail = 0

    for pair in data:
        image = pair[0]
        digit = pair[1]
        guess = predict(model, image)
        if digit == guess:
            correct += 1
        else:
            fail += 1

    return correct/(correct + fail)

if __name__ == '__main__':
    # 28 x 28 = 784
    print("Generating image files ...")
    make_images()
    print("Estimating the probabilities ...")
    model = train(mnist.read_training_data())
    print("Evaluating the classifier ...")
    print("Accuracy:", evaluate(model, mnist.read_test_data())) # 0.7006

