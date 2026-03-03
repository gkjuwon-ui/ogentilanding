import re

# Fix platform/style.css
with open('platform/style.css', 'r', encoding='utf-8') as f:
    pcss = f.read()

# 1. Update text colors and body font-family to match landing page
pcss = re.sub(r'--text: #fff;', '--text: #aaaaff;', pcss)

pcss = re.sub(
    r"font-family: Consolas, 'Cascadia Code', monospace;",
    "font-family: 'Press Start 2P', Consolas, monospace;",
    pcss
)

# 2. Force the cursor everywhere in platform/style.css
# We'll just append it to the universal selector or body, and add * { cursor: ... !important; }
cursor_css = '''
* {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect x='0' y='0' width='8' height='12' fill='%2355ffff'/%3E%3C/svg%3E") 0 0, auto !important;
}
'''
if '* {' not in pcss or 'cursor: url' not in pcss:
    pcss = css = cursor_css + pcss

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(pcss)

# Fix index.html CSS
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace any cursor: pointer; or anything that overrides the block cursor
html = re.sub(r'cursor:\s*pointer;', '/* cursor: pointer overridden */', html)

# Inject global cursor into index.html
if '* { cursor: url' not in html:
    html = html.replace('</style>', f"{cursor_css}\n    </style>")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Sync complete')
