from math import sqrt
from typing import Sequence


def cosine_similarity(left: Sequence[float], right: Sequence[float]) -> float:
    """Return the cosine similarity for two vectors."""
    if len(left) != len(right):
        raise ValueError('Vectors must have the same length.')
    if len(left) == 0:
        raise ValueError('Vectors must not be empty.')

    left_magnitude = sqrt(sum(value * value for value in left))
    right_magnitude = sqrt(sum(value * value for value in right))
    if left_magnitude == 0 or right_magnitude == 0:
        raise ValueError('Zero vectors do not have a cosine similarity.')

    dot_product = sum(a * b for a, b in zip(left, right))
    return float(dot_product / (left_magnitude * right_magnitude))
