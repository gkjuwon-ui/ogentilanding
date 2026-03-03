import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make cards themselves black but with a blue shadow, OR keep them blue
# User said "landing is a mix of black and blue, platform is only blue"
# User also said "too much cyan"

# Let's check where cyan is used: buttons and borders.
# In index.html, cyan is used for selections, some text, but borders are mostly white.
# In platform, the nav border, some active borders are cyan.

# Let's remove the aggressive cyan from platform elements, make them white like landing.
css = re.sub(r'border:\s*4px solid var\(--cyan\);', 'border: 4px solid var(--border);', css)

# Make .card background black, while keeping some blue accents maybe? 
# Wait, user said "landing page mixes black and blue, platform is only blue".
# Let's change .card background from #0000aa to #000000. And maybe keep headers blue, or just remove the !important from the black force.

# Remove the block that forces EVERYTHING to blue
css = re.sub(r'\.card, \.auth-box, \.console-wrapper, \.pricing-card, \.model-card, \.stat-item, \.estimate-box\s*\{[^}]*background:\s*#0000aa !important;\s*[^}]*\}', '', css)

# Re-apply some black vs blue logic
# .card -> black
# .auth-box -> blue 
# .stat-item -> black
# .pricing-card -> black
# .model-card -> black

custom_colors = '''
.card, .stat-item, .pricing-card, .model-card, .estimate-box, .console-wrapper {
    background: #000 !important;
    border: 4px solid #fff !important;
    box-shadow: 8px 8px 0 0 #333 !important;
}

.auth-box {
    background: #0000aa !important;
    border: 4px solid #fff !important;
    box-shadow: 8px 8px 0 0 #333 !important;
}
'''
css += custom_colors

# Now fix the overly aggressive "too much cyan"
# The default text highlighting in platform is cyan where it should be white or yellow.
# The card titles in platform were cyan:
css = re.sub(r'color: var\(--cyan\);', 'color: var(--yellow);', css)

# And the nav logo was cyan but let's keep nav blue and borders white.

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

