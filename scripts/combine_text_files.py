import os
import glob

def combine_files(folder_path, output_file):
  """Combines all .txt and .md files in a folder into a single .txt file,
  sorted alphabetically, handling different encodings.

  Args:
    folder_path: The path to the folder containing the files.
    output_file: The name of the output file.
  """

  file_paths = sorted(glob.glob(os.path.join(folder_path, '*.txt')) + glob.glob(os.path.join(folder_path, '*.md')))

  with open(output_file, 'w', encoding='utf-8') as outfile:
    for file_path in file_paths:
      try:
        with open(file_path, 'r', encoding='utf-8') as infile:
          contents = infile.read()
          outfile.write(contents)
          outfile.write('\n\n---\n\n')
      except UnicodeDecodeError:
        try:
          with open(file_path, 'r', encoding='latin-1') as infile:
            contents = infile.read()
            outfile.write(contents)
            outfile.write('\n\n---\n\n')
        except UnicodeDecodeError:
          print(f"Error reading file: {file_path}. Skipping...")

# Ask the user for the folder name
folder_name = input("Enter the folder name: ")
folder_path = os.path.join(os.getcwd(), folder_name)

# Use a default output file name
output_file = 'combined_files.txt'

combine_files(folder_path, output_file)
print(f"Files combined into {output_file}")