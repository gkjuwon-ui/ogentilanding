import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace any font-family declarations 
css = re.sub(r"font-family:\s*['\"]?Press Start 2P['\"]?[^;]*;", "font-family: var(--font-pixel);", css)
css = re.sub(r"font-family:\s*Consolas[^;]*;", "font-family: var(--font-pixel);", css)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
