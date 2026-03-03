import re
with open('platform/style.css', 'r', encoding='utf-8') as f:
    text = f.read()

# Make card text white/yellow rather than cyan
text = text.replace('color: var(--cyan);', 'color: #fff;')

# Ensure titles are yellow
text = re.sub(r'(\.page-title\s*\{[^}]*color:)[^;]+;', r'\1 var(--yellow); text-shadow: 2px 2px 0 #000;', text)
text = re.sub(r'(\.card-title\s*\{[^}]*color:)[^;]+;', r'\1 var(--yellow); text-shadow: 2px 2px 0 #000;', text)

# The console output might have been too cyan. 
# Keep syntax highlighting out of default cyan.
text = re.sub(r'border: 4px solid var\(--cyan\);', 'border: 4px solid #fff;', text)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(text)
