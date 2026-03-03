import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

expanded_platform_cards = '''
        <div class="tech-grid">
            <div class="tech-card">
                <h4>DATASET MANAGER</h4>
                <p>Upload your own conversation logs, code repositories, or domain-specific text. Ogenti automatically cleans and formats it for multi-agent training.</p>
                <span class="tech-tag">INGESTION</span>
            </div>
            <div class="tech-card">
                <h4>1-CLICK MARL PIPELINE</h4>
                <p>Select your base LLM (Llama, Qwen, Gemma) and hit train. The platform automatically provisions A100 clusters, handles ZeRO-2 optimization, and runs the entire PPO pipeline.</p>
                <span class="tech-tag">TRAINING</span>
            </div>
            <div class="tech-card">
                <h4>LIVE TELEMETRY</h4>
                <p>Watch your agents learn in real-time. WebSocket connections stream live token compression ratios, reward curves, and PPO loss metrics directly to your dashboard.</p>
                <span class="tech-tag">MONITORING</span>
            </div>
            <div class="tech-card">
                <h4>.OGT PROTOCOL FORMAT</h4>
                <p>Export your trained protocols as standard .OGT files via our Distillation Engine. A universal ~3MB format that any compatible LLM can load to speak your custom protocol.</p>
                <span class="tech-tag">EXPORT</span>
            </div>
            <div class="tech-card">
                <h4>API ENDPOINTS & ROUTING</h4>
                <p>Deploy .OGT files instantly. Every trained model gets a scalable REST API endpoint. A built-in Router Agent automatically sends requests to the cheapest/fastest compatible model.</p>
                <span class="tech-tag">DEPLOYMENT</span>
            </div>
             <div class="tech-card">
                <h4>PAY-PER-TOKEN PRICING</h4>
                <p>No expensive GPU lock-in. You only pay for the compressed protocol tokens generated during inference. Massive scale means massive savings through token reduction.</p>
                <span class="tech-tag">BILLING</span>
            </div>
        </div>
'''

html = re.sub(
    r'<div class="tech-grid">\s*<div class="tech-card">\s*<h4>DATASET MANAGER</h4>.*?</div>\s*</div>\s*</div>',
    expanded_platform_cards.strip() + '\n    </div>',
    html,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
