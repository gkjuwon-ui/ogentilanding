import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix nav brand color (should be white, not yellow or cyan)
css = re.sub(r'(\.nav-brand\s*\{[^}]*color:)[^;]*;', r'\1 #fff;', css)
css = re.sub(r'(\.nav-brand\s*\{[^}]*text-shadow:)[^;]*;', '', css) # remove old so we can safely add
css = re.sub(r'(\.nav-brand\s*\{)', r'\1\n    text-shadow: 2px 2px 0 #000;', css)

# Fix nav bar border (should be white, not cyan)
css = re.sub(r'(\.nav\s*\{[^}]*border-bottom:\s*[^;]*;)var\(--cyan\);', r'\1var(--border);', css)

# Make page body actually use the mixed background
# Wait, body is #000, nav is #0000aa. That's fine.
# But auth boxes should be #000 inside an #0000aa wrap, exactly like landing page cards.

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

