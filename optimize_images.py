import os
from PIL import Image

def resize_images(directory, max_size=(800, 800)):
    for filename in os.listdir(directory):
        if filename.endswith(".png") or filename.endswith(".jpg"):
            filepath = os.path.join(directory, filename)
            try:
                with Image.open(filepath) as img:
                    # Original size
                    orig_size = os.path.getsize(filepath)
                    
                    # Resize while maintaining aspect ratio
                    img.thumbnail(max_size, Image.Resampling.LANCZOS)
                    
                    # Save with optimization
                    img.save(filepath, optimize=True)
                    
                    new_size = os.path.getsize(filepath)
                    print(f"Resized {filename}: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    print("Resizing dino images...")
    resize_images("/home/dcrespol/Documentos/Dinos/assets/images")
    print("\nResizing map image...")
    resize_images("/home/dcrespol/Documentos/Dinos/imagenes", max_size=(1200, 1200))
