from PIL import Image
import blurhash
import os
import numpy as np

def process_image(image_file, max_size=(800, 800)):
    """
    Resizes the image to fit within max_size while maintaining aspect ratio.
    Returns the processed Image object.
    """
    img = Image.open(image_file)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    return img

def generate_blurhash(image_path):
    """
    Generates a blurhash for the image at image_path.
    """
    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    # Blurhash requires a small image for performance
    img.thumbnail((100, 100), Image.Resampling.LANCZOS)
    return blurhash.encode(np.array(img), components_x=4, components_y=3)
