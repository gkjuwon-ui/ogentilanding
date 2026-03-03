import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# find all imports
imports = re.findall(r'@import url\([^)]+\);', css)

# remove imports from wherever they are
for imp in imports:
    css = css.replace(imp, '')

# add them at the very top
css = "\n".join(imports) + "\n\n" + css.lstrip()

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
