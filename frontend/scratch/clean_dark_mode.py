import os
import re

def clean_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find 'dark:something' and replace with nothing
    # It handles classes like dark:bg-slate-800/50, dark:text-white, etc.
    # We want to remove the 'dark:classname' part including any trailing space if it was the only class
    # but usually just removing the 'dark:classname' is enough.
    
    # Pattern: 'dark:' followed by non-whitespace characters that are valid in Tailwind
    # We stop at space, double quote, or single quote.
    new_content = re.sub(r'dark:[a-zA-Z0-9\-\/:.]+', '', content)
    
    # Cleanup extra spaces left behind
    new_content = re.sub(r'\s{2,}', ' ', new_content)
    # Fix className=" " or className=" class1 class2 "
    new_content = re.sub(r'className=" ', 'className="', new_content)
    new_content = re.sub(r' "', '"', new_content)

    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    root_dir = r'c:\Users\kmrut\Desktop\FIC\frontend\src'
    files_to_clean = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                files_to_clean.append(os.path.join(root, file))
    
    count = 0
    for file_path in files_to_clean:
        if clean_file(file_path):
            print(f"Cleaned: {file_path}")
            count += 1
    
    print(f"Total files cleaned: {count}")

if __name__ == "__main__":
    main()
