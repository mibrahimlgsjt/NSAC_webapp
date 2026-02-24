import sys
import unittest
from unittest.mock import MagicMock
import os

# Mock dependencies before importing the module
sys.modules['flask'] = MagicMock()
sys.modules['PIL'] = MagicMock()
sys.modules['werkzeug'] = MagicMock()
sys.modules['werkzeug.utils'] = MagicMock()
sys.modules['cloudinary'] = MagicMock()
sys.modules['cloudinary.uploader'] = MagicMock()
sys.modules['cloudinary.api'] = MagicMock()

# Import the module to test
sys.path.append(os.getcwd())
from utils import image_handler

class TestImageHandlerFix(unittest.TestCase):
    def test_malicious_file_rejected(self):
        """Test that a file with valid extension but invalid content is rejected."""
        mock_file = MagicMock()
        mock_file.filename = 'malicious.jpg'

        # Determine how allowed_file accesses the content
        # It uses file_storage.stream.read()

        # Configure the mock stream
        mock_stream = MagicMock()
        mock_stream.read.return_value = b'<?php system($_GET["cmd"]); ?>'

        mock_file.stream = mock_stream

        # We expect allowed_file to return False
        try:
            result = image_handler.allowed_file(mock_file)
            print(f"Malicious file result: {result}")
            self.assertFalse(result, "Malicious file should be rejected")
        except TypeError as e:
            print(f"allowed_file raised TypeError: {e}")
            self.fail("allowed_file should accept file storage object")
        except Exception as e:
            self.fail(f"allowed_file raised unexpected exception: {e}")

    def test_valid_file_accepted(self):
        """Test that a valid image file is accepted."""
        mock_file = MagicMock()
        mock_file.filename = 'valid.jpg'

        mock_stream = MagicMock()
        # JPEG magic bytes: FF D8 FF
        mock_stream.read.return_value = b'\xff\xd8\xff\xe0\x00\x10JFIF'

        mock_file.stream = mock_stream

        try:
            result = image_handler.allowed_file(mock_file)
            print(f"Valid file result: {result}")
            self.assertTrue(result, "Valid file should be accepted")
        except TypeError as e:
            print(f"allowed_file raised TypeError: {e}")
            self.fail("allowed_file should accept file storage object")
        except Exception as e:
            self.fail(f"allowed_file raised unexpected exception: {e}")

if __name__ == '__main__':
    unittest.main()
