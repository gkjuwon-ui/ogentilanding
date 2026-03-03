import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove old dirty .crt overlay
css = re.sub(r'\.crt::before\s*\{[^}]*\}', '', css)

# Add exact scanlines from landing
scanlines = '''
.crt::before {
    content: " ";
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.2) 2px,
        rgba(0,0,0,0.2) 4px
    );
}
.crt::after {
    content: " ";
    position: fixed; inset: 0; pointer-events: none; z-index: 9998;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%);
}
'''
css += scanlines

# Fix Box Shadows to match landing (8px instead of 4px)
css = re.sub(r'box-shadow:\s*4px 4px 0 #333;', 'box-shadow: 8px 8px 0 0 #333;', css)
css = re.sub(r'box-shadow:\s*4px 4px 0 0 #333;', 'box-shadow: 8px 8px 0 0 #333;', css)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

