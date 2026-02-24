import pytest
from app import app
from utils.image_handler import save_image
from io import BytesIO
from PIL import Image
import os

def test_save_image_generates_blurhash():
    # Setup: Create a dummy image
    img_io = BytesIO()
    img = Image.new('RGB', (100, 100), color='blue')
    img.save(img_io, 'JPEG')
    img_io.seek(0)

    # Mock FileStorage
    class MockFile(BytesIO):
        def __init__(self, data, filename):
            super().__init__(data)
            self.filename = filename

    file_storage = MockFile(img_io.getvalue(), 'test_image.jpg')

    # Test execution
    with app.app_context():
        # Use a custom subfolder to easily clean up
        db_path, blur_hash = save_image(file_storage, subfolder='test_uploads')

        # Verification
        assert db_path is not None, "db_path should not be None"
        assert blur_hash is not None, "blur_hash should be generated"
        assert len(blur_hash) > 0

        # Cleanup
        # db_path is like "uploads/test_uploads/2024/05/filename.jpg"
        full_path = os.path.join(app.root_path, 'static', db_path.replace('/', os.sep))

        if os.path.exists(full_path):
            os.remove(full_path)
