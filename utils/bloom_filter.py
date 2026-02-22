import hashlib

class SimpleBloomFilter:
    def __init__(self, size=1000, hash_count=5):
        self.size = size
        self.hash_count = hash_count
        self.bit_array = 0 # Using an integer as a bit array for simplicity
        
    def _hashes(self, item):
        hashes = []
        for i in range(self.hash_count):
            h = hashlib.sha256(f"{item}:{i}".encode()).hexdigest()
            hashes.append(int(h, 16) % self.size)
        return hashes
        
    def add(self, item):
        for h in self._hashes(item):
            self.bit_array |= (1 << h)
            
    def __contains__(self, item):
        for h in self._hashes(item):
            if not (self.bit_array & (1 << h)):
                return False
        return True
