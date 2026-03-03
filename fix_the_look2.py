import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix ANY remaining 4px 4px 0 #333 or 4px 4px 0 0 #333 to 8px 8px 0 0 #333 to match landing page chonkiness
css = re.sub(r'box-shadow:\s*4px 4px 0 #333[^;]*;', 'box-shadow: 8px 8px 0 0 #333;', css)
css = re.sub(r'box-shadow:\s*4px 4px 0 0 #333[^;]*;', 'box-shadow: 8px 8px 0 0 #333;', css)
css = re.sub(r'box-shadow:\s*6px 6px 0 #333[^;]*;', 'box-shadow: 8px 8px 0 0 #333;', css)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

