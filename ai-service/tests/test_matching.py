import unittest

import numpy as np

from matching import cosine_similarity


class CosineSimilarityTests(unittest.TestCase):
    def test_identical_skill_vectors_score_one(self):
        self.assertAlmostEqual(cosine_similarity([1.0, 2.0], [1.0, 2.0]), 1.0)

    def test_unrelated_orthogonal_vectors_score_zero(self):
        self.assertAlmostEqual(cosine_similarity([1.0, 0.0], [0.0, 1.0]), 0.0)

    def test_numpy_embedding_vectors_are_supported(self):
        score = cosine_similarity(
            np.array([1.0, 0.0], dtype=np.float32),
            np.array([1.0, 1.0], dtype=np.float32),
        )
        self.assertAlmostEqual(score, 0.70710678, places=7)
        self.assertIsInstance(score, float)

    def test_different_vector_lengths_are_rejected(self):
        with self.assertRaises(ValueError):
            cosine_similarity([1.0, 0.0], [1.0])


if __name__ == '__main__':
    unittest.main()
