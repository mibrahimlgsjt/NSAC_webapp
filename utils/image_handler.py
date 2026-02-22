import os
import uuid
from datetime import datetime
from PIL import Image
from werkzeug.utils import secure_filename
from flask import current_app
try:
    import blurhash
except ImportError:
    blurhash = None
import cloudinary
import cloudinary.uploader
import cloudinary.api

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Configure Cloudinary if URL is present
if os.environ.get('CLOUDINARY_URL'):
    cloudinary.config(
        cloud_name=os.environ.get('CLOUDINARY_CLOUD_name'),
        api_key=os.environ.get('CLOUDINARY_API_KEY'),
        api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
        secure=True
    )

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file_storage, subfolder='sightings'):
    """
    Validates, resizes, and saves an image.
    Returns (db_path, blur_hash) relative path for the database.
    Returns (None, None) if validation fails or error occurs.
    """
    if not file_storage or not allowed_file(file_storage.filename):
        return None, None

    # Generate unique filename
    filename = secure_filename(file_storage.filename)
    try:
        ext = filename.rsplit('.', 1)[1].lower()
    except IndexError:
        return None, None
        
    unique_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"
    
    # Process and Save
    try:
        img = Image.open(file_storage)
        
        # Convert to RGB for Blurhash
        if img.mode != 'RGB':
            img_rgb = img.convert('RGB')
        else:
            img_rgb = img
            
        # Blurhash (on small thumbnail for speed)
        bh_str = None
        if blurhash:
            try:
                thumb = img_rgb.resize((10, 10))
                pixels = list(thumb.getdata())
                width, height = thumb.size
                rows = [pixels[i * width:(i + 1) * width] for i in range(height)]
                bh_str = blurhash.encode(rows, 4, 3)
            except Exception as e:
                print(f"Blurhash error: {e}")
        
        # Cloudinary Path
        if os.environ.get('CLOUDINARY_URL'):
            # Upload to Cloudinary
            # Reset file pointer since PIL read it
            file_storage.seek(0)
            upload_result = cloudinary.uploader.upload(
                file_storage,
                public_id=unique_name.split('.')[0],
                folder=f"nsac/{subfolder}",
                resource_type="image"
            )
            return upload_result['secure_url'], bh_str

        # Local Path (Fallback)
        # Create directory: static/uploads/{subfolder}/YYYY/MM
        now = datetime.now()
        relative_path = os.path.join('uploads', subfolder, now.strftime('%Y'), now.strftime('%m'))
        full_dir_path = os.path.join(current_app.root_path, 'static', relative_path)
        
        if not os.path.exists(full_dir_path):
            os.makedirs(full_dir_path)
            
        full_path = os.path.join(full_dir_path, unique_name)

        # Save original/resized version
        if img.mode in ('RGBA', 'P') and ext in ['jpg', 'jpeg']:
            img = img.convert('RGB')
            
        # Resize if width > 1080
        max_width = 1080
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
        img.save(full_path, quality=85, optimize=True)
        
        # Return path relative to static/
        # Ensure forward slashes for URL compatibility regardless of OS
        db_path = os.path.join(relative_path, unique_name).replace(os.sep, '/')
        return db_path, bh_str
        
    except Exception as e:
        print(f"Error saving image: {e}")
        return None, None
