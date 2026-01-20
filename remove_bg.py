from PIL import Image
import numpy as np
import os

input_path = "public/logo.jpg"
output_path = "public/logo.png"

if not os.path.exists(input_path):
    print(f"Error: {input_path} not found!")
    exit(1)

try:
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Define "white" (pixels brighter than 240)
    r, g, b, a = data.T
    white_areas = (r > 240) & (g > 240) & (b > 240)
    
    # Set alpha to 0 for white areas
    data[..., 3][white_areas.T] = 0
    
    new_img = Image.fromarray(data)
    new_img.save(output_path)
    print(f"Success! Transparent logo saved to: {output_path}")

except Exception as e:
    print(f"An error occurred: {e}")
