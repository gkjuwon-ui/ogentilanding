import re

with open('platform/style.css', 'r', encoding='utf-8') as f:
    pcss = f.read()

# Make sure inputs use Press Start 2P too.
pcss = re.sub(
    r"font-family: 'Press Start 2P', Consolas, monospace;",
    "font-family: 'Press Start 2P', monospace;",
    pcss
)
pcss = re.sub(
    r"font-family: Consolas, 'Cascadia Code', monospace;",
    "font-family: 'Press Start 2P', monospace;",
    pcss
)

# And ANY other pointer/inherit in buttons that override
pcss = re.sub(r'cursor: inherit;', '/* cursor overridden */', pcss)
pcss = re.sub(r'cursor: not-allowed;', '/* cursor overridden */', pcss)
pcss = re.sub(r'cursor: pointer;', '/* cursor overridden */', pcss)

# Unify background of cards/nav to match landing
pcss = re.sub(r'--bg2: #0000aa; /\* C64 BLUE \*/', '--bg2: #0000aa;', pcss)
pcss = re.sub(r'--bg3: #0000aa; /\* C64 BLUE \*/', '--bg3: #0000aa;', pcss)

with open('platform/style.css', 'w', encoding='utf-8') as f:
    f.write(pcss)

