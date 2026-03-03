import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

expanded_platform = '''
<!-- Platform Section -->
<section class="tech-section" id="platform" style="padding: 100px 20px;">
    <div class="section-wrap reveal">
        <span class="section-tag" style="text-align:center; display:block;">// PLATFORM</span>
        <h2 class="section-title" style="text-align:center;">THE OGENTI CLOUD PLATFORM</h2>
        <p class="section-desc" style="text-align:center; max-width: 800px; margin: 0 auto 60px;">
            No need to maintain your own cluster. Build, manage, and deploy your custom AI communication protocols purely via our web dashboard. Everything from dataset ingestion to multi-agent RL training is fully managed.
        </p>
        
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
                <h4>DISTILLATION ENGINE</h4>
                <p>Once MARL is complete, our distillation engine extracts the emergent protocol into a highly portable ~3MB LoRA adapter.</p>
                <span class="tech-tag">EXPORT</span>
            </div>
            <div class="tech-card">
                <h4>API ENDPOINTS</h4>
                <p>Deploy your finished protocol instantly. Every trained model gets a dedicated, scalable REST API endpoint for zero-latency AI-to-AI inference.</p>
                <span class="tech-tag">DEPLOYMENT</span>
            </div>
             <div class="tech-card">
                <h4>ROUTER AGENT</h4>
                <p>A built-in global router analyzes incoming requests and routes them to the cheapest/fastest protocol model optimized for your specific task.</p>
                <span class="tech-tag">INFERENCE</span>
            </div>
        </div>
    </div>
</section>
'''

html = re.sub(
    r'<!-- Platform Section -->.*?</div>\s*</section>',
    expanded_platform.strip(),
    html,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
