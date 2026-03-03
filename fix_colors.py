import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

root_str = '''
:root {
    --bg: #000000;
    --bg2: #0000aa;
    --bg3: #0000aa;
    --surface: #0000aa;
    --border: #ffffff;
    --border-hi: #aaaaaa;
    --text: #aaaaff;
    --text-dim: #aaaaaa;
    --text-muted: #555555;
    --cyan: #55ffff;
    --cyan-dim: #00aaaa;
    --purple: #ff55ff;
    --green: #55ff55;
    --yellow: #ffff55;
    --red: #ff5555;
    --orange: #ffaa55;
    --pink: #ff55ff;
    --font-pixel: 'Press Start 2P', monospace;
    --font-silk: 'Press Start 2P', monospace;
    --pixel-border: 4px solid #ffffff;
    --px: 4px;
}
'''
css = re.sub(r':root\s*\{[^}]+\}', root_str.strip(), css)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
