import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'cursor: inherit;', '/* inherited */', text)
text = re.sub(r'cursor: pointer;', '/* pointer */', text)
text = re.sub(r'cursor: not-allowed;', '/* not-allowed */', text)

cursor_rule = '''
* {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect x='0' y='0' width='8' height='12' fill='%2355ffff'/%3E%3C/svg%3E") 0 0, auto !important;
}
'''
text = cursor_rule + "\n" + text

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(text)

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'cursor:\s*pointer;', '/* pointer overridden */', text)
text = text.replace('cursor: crosshair;', '/* crosshair overridden */')
if '* { cursor: url' not in text:
    text = text.replace('</style>', cursor_rule + "\n</style>")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
