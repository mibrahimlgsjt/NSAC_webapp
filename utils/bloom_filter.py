import mmh3
import os
import pickle
from bitarray import bitarray

class SimpleBloomFilter:
    def __init__(self, size=10000, hash_count=7, filepath=None):
        if filepath and os.path.exists(filepath):
            self.load(filepath)
        else:
            self.size = size
            self.hash_count = hash_count
            self.bit_array = bitarray(size)
            self.bit_array.setall(0)

    def add(self, string):
        for i in range(self.hash_count):
            index = mmh3.hash(string, i) % self.size
            self.bit_array[index] = 1

    def lookup(self, string):
        for i in range(self.hash_count):
            index = mmh3.hash(string, i) % self.size
            if self.bit_array[index] == 0:
                return False
        return True

    def save(self, filepath):
        with open(filepath, 'wb') as f:
            pickle.dump({
                'size': self.size,
                'hash_count': self.hash_count,
                'bit_array': self.bit_array
            }, f)

    def load(self, filepath):
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            self.size = data['size']
            self.hash_count = data['hash_count']
            self.bit_array = data['bit_array']
