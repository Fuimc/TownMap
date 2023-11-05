import os
import argparse

# Function to compare two images and generate a difference image
def compare_images(image1, corresponding_image2, output_file):
    os.system('convert "' + corresponding_image2 + '" "' + image1 + '" -alpha off +repage \\( -clone 0 -clone 1 -compose difference -composite -threshold 0 \\) -delete 1 -alpha off -compose copy_opacity -composite \\( +clone -alpha off \\) -compose SrcIn -composite "' + output_file + '"')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compare images in two folders and generate difference images.")
    parser.add_argument("folder1", help="Path to the first folder containing images.")
    parser.add_argument("folder2", help="Path to the second folder containing images.")
    parser.add_argument("output_dir", help="Path to the output directory for difference images.")
    args = parser.parse_args()

    if not os.path.exists(args.output_dir):
        os.makedirs(args.output_dir)

    # List all the image files in folder1
    images1 = [os.path.join(args.folder1, file) for file in os.listdir(args.folder1) if file.lower().endswith((".png"))]

    # List all the image files in folder2
    images2 = [os.path.join(args.folder2, file) for file in os.listdir(args.folder2) if file.lower().endswith((".png"))]

    # Compare images with the same name and generate difference images
    for image1 in images1:
        corresponding_image2 = os.path.join(args.folder2, os.path.basename(image1))
        if corresponding_image2 in images2:
            output_file = os.path.join(args.output_dir, os.path.basename(image1))
            compare_images(image1, corresponding_image2, output_file)

