import os, re

def process_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                new_content = re.sub(r'\bgray-', 'olive-', content)
                if content != new_content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

process_dir('/Users/saranshsharma/Documents/jyt-web/jyt-web/app')
process_dir('/Users/saranshsharma/Documents/jyt-web/jyt-web/components')
