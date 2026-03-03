import re
with open('platform/style.css', 'r', encoding='utf-8') as f:
    text = f.read()

# Make text #aaaaff to match index.html
text = re.sub(r'--text: #fff;', '--text: #aaaaff;', text)

# Replace any Consolas that isn't preceded by Press Start 2P
text = re.sub(r"font-family: Consolas, 'Cascadia Code', monospace;", "font-family: 'Press Start 2P', Consolas, monospace;", text)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(text)
