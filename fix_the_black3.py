import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make .auth-wrap and .page-wrap background black to contrast the blue cards.
css = re.sub(
    r'\.page-wrap\s*\{[^}]*\}',
    '''
.page-wrap {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 20px;
    background: #000;
}
'''.strip(),
    css,
    flags=re.DOTALL
)

css = re.sub(
    r'\.auth-wrap\s*\{[^}]*\}',
    '''
.auth-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #000;
}
'''.strip(),
    css,
    flags=re.DOTALL
)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

