import os
import argparse
from PIL import Image

def create_larger_tile(x, y, input_directory, tile_size):
    new_tile = Image.new("RGBA", (2 * tile_size, 2 * tile_size), (0, 0, 0, 0))
    all_transparent = True
    
    for i in range(2):
        for j in range(2):
            tile_x = x * 2 + j
            tile_y = y * 2 + i
            tile_path = os.path.join(input_directory, f"{tile_x},{tile_y}.png")
            
            if os.path.exists(tile_path):
                tile = Image.open(tile_path)
                
                # Check if the tile is not entirely transparent
                if not tile.getextrema()[1] == 0:
                    all_transparent = False
            else:
                tile = Image.new("RGBA", (tile_size, tile_size), (0, 0, 0, 0))
            
            new_tile.paste(tile, (j * tile_size, i * tile_size))
    
    # If all parts are transparent, don't return the new tile
    if not all_transparent:
        return new_tile.resize((512, 512), Image.BICUBIC)
    else:
        return None

def main():
    parser = argparse.ArgumentParser(description="Create larger tiles from smaller map tiles.")
    parser.add_argument("input_directory", help="Directory containing the original map tiles")
    parser.add_argument("output_directory", help="Directory to save the larger tiles")
    args = parser.parse_args()

    tile_size = 512

    for x in range(-17, 16):
        for y in range(-16, 17):
            output_tile = create_larger_tile(x, y, args.input_directory, tile_size)
            if output_tile:
                output_path = os.path.join(args.output_directory, f"{x},{y}.png")
                output_tile.save(output_path)

    print("Tiles created successfully.")

if __name__ == "__main__":
    main()

