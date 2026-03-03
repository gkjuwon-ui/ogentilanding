import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace QWEN2.5-3B
html = re.sub(
    r'<h4>QWEN2\.5-3B</h4>\s*<p>Base model for encoder and decoder agents\. Small enough to train, capable enough to learn\.</p>\s*<span class="tech-tag">LLM BACKBONE</span>',
    '''<h4>MULTI-MODEL BACKBONE</h4>
                <p>Train protocol agents on Llama-3, Qwen-2.5, Mistral, and Gemma. Choose the capacity that fits your budget and use case.</p>
                <span class="tech-tag">AGNOSTIC LLM</span>''',
    html,
    flags=re.IGNORECASE
)

# Replace MARL + QWEN... in footer
html = re.sub(
    r'// MARL \+ QWEN2\.5-3B \+ LORA',
    '// MARL + MULTI-MODEL + LORA',
    html,
    flags=re.IGNORECASE
)

# Replace 58,000 episodes
html = re.sub(
    r'58,000 episodes\. One universal protocol adapter\.',
    'Dynamic epochs. Train on your custom datasets through our platform dashboard.',
    html,
    flags=re.IGNORECASE
)

# Replace ~ Cost
html = re.sub(
    r'<div class="result-val">\</div>\s*<div class="result-label">COST</div>\s*<div class="result-sub">A100 x 24hr</div>',
    '''<div class="result-val">FLEX</div>
                <div class="result-label">PRICING</div>
                <div class="result-sub">cloud compute</div>''',
    html,
    flags=re.IGNORECASE
)

# Add Platform Section before CTA
platform_section = '''
<!-- Platform Section -->
<section class="platform-section" id="platform" style="padding: 100px 20px; text-align: center;">
    <div class="section-wrap reveal">
        <span class="section-tag">// PLATFORM</span>
        <h2 class="section-title">THE OGENTI CLOUD PLATFORM</h2>
        <p class="section-desc">
            No need to maintain your own cluster. Build, manage, and deploy your custom AI communication protocols purely via our web dashboard.
        </p>
        <div class="results-grid" style="margin-top: 40px;">
            <div class="result-tile">
                <div class="result-label">DATASET MANAGER</div>
                <div class="result-sub">Upload raw text</div>
            </div>
            <div class="result-tile">
                <div class="result-label">1-CLICK TRAIN</div>
                <div class="result-sub">Auto GPU scaling</div>
            </div>
            <div class="result-tile">
                <div class="result-label">API</div>
                <div class="result-sub">Endpoint inference</div>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
'''
html = re.sub(r'<!-- CTA -->', platform_section, html, count=1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
