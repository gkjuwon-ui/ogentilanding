import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update buttons to match landing
css = re.sub(
    r'\.btn-primary\s*\{[^}]*\}',
    '''
.btn-primary {
    background: var(--red);
    color: #fff;
    border-color: #fff;
    text-shadow: 2px 2px 0 #000;
}
'''.strip(),
    css
)

css = re.sub(
    r'\.btn-primary:hover\s*\{[^}]*\}',
    '''
.btn-primary:hover {
    background: #ffaaaa;
    color: #000;
    text-shadow: none;
}
'''.strip(),
    css
)

css = re.sub(
    r'\.btn-secondary\s*\{[^}]*\}',
    '''
.btn-secondary {
    background: #000;
    color: #fff;
    border-color: #fff;
}
'''.strip(),
    css
)

css = re.sub(
    r'\.btn-secondary:hover\s*\{[^}]*\}',
    '''
.btn-secondary:hover {
    background: var(--cyan);
    color: #000;
}
'''.strip(),
    css
)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
