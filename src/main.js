const app = document.querySelector('#app')

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="AURA home">
        <span class="brand-mark" aria-hidden="true"><span></span></span>
        <span><strong>AURA</strong><small>assistive cursor</small></span>
      </a>
      <div class="top-actions">
        <span class="system-status"><i></i> System ready</span>
        <button class="icon-button" type="button" aria-label="Open settings" data-action="settings">⚙</button>
        <div class="profile-dot" aria-label="Profile: Alex">A</div>
      </div>
    </header>

    <section class="welcome" id="top">
      <div>
        <p class="eyebrow">Tuesday, September 23 <span class="rule"></span> 09:41</p>
        <h1>Good morning,<br /><em>Alex.</em></h1>
        <p class="lede">I’m here to make your screen feel a little more yours.</p>
      </div>
      <div class="ambient-status" aria-label="AURA is active">
        <span class="status-pulse"></span>
        <div><b>Listening for you</b><small>Press <kbd>V</kbd> to speak</small></div>
      </div>
    </section>

    <section class="command-deck" aria-label="AURA command center">
      <div class="deck-header">
        <span class="section-kicker">Command center</span>
        <span class="shortcut"><kbd>V</kbd> hold to talk</span>
      </div>
      <div class="voice-row">
        <button class="voice-orb" id="voiceButton" type="button" aria-label="Start voice command">
          <span class="orb-ring ring-one"></span><span class="orb-ring ring-two"></span><span class="mic">●</span>
        </button>
        <div class="voice-copy">
          <span class="voice-label" id="voiceLabel">Ready when you are</span>
          <p id="voiceTranscript">“What would you like me to do?”</p>
        </div>
        <button class="read-button" id="readButton" type="button"><span aria-hidden="true">◉</span> Read screen</button>
      </div>
      <form class="command-form" id="commandForm">
        <label for="commandInput">Try a command</label>
        <div class="input-wrap"><input id="commandInput" autocomplete="off" placeholder="e.g. Open my calendar" /><button type="submit" aria-label="Send command">↗</button></div>
      </form>
    </section>

    <section class="content-grid">
      <div class="main-column">
        <div class="section-heading"><div><span class="section-kicker">Quick actions</span><h2>Make it happen</h2></div><span class="action-count">04 available</span></div>
        <div class="action-grid">
          <button class="action-card coral magnetic" data-command="Open my calendar" type="button"><span class="card-icon">▦</span><span class="card-text"><b>Open calendar</b><small>See what’s ahead</small></span><span class="arrow">↗</span></button>
          <button class="action-card mint magnetic" data-command="Read this page aloud" type="button"><span class="card-icon">◉</span><span class="card-text"><b>Read this page</b><small>Hear it out loud</small></span><span class="arrow">↗</span></button>
          <button class="action-card yellow magnetic" data-command="Find my files" type="button"><span class="card-icon">⌕</span><span class="card-text"><b>Find my files</b><small>Search your computer</small></span><span class="arrow">↗</span></button>
          <button class="action-card lilac magnetic" data-command="Guide me to settings" type="button"><span class="card-icon">◎</span><span class="card-text"><b>Guide me</b><small>Navigate step by step</small></span><span class="arrow">↗</span></button>
        </div>
        <div class="tip-line"><span>✦</span> Tip: say “What’s on my screen?” whenever you need a quick description.</div>
      </div>

      <aside class="side-column">
        <div class="section-heading compact"><div><span class="section-kicker">Your companion</span><h2>Orbit</h2></div><span class="live-tag"><i></i> live</span></div>
        <div class="companion-card">
          <div class="avatar-stage"><div class="sonar sonar-a"></div><div class="sonar sonar-b"></div><div class="avatar-face"><span class="eye left"></span><span class="eye right"></span><span class="smile"></span></div><span class="orbit-dot dot-a"></span><span class="orbit-dot dot-b"></span></div>
          <div class="companion-copy"><b>All clear around you.</b><p>Nothing is asking for your attention right now.</p></div>
          <div class="radar-row"><span><i class="legend mint-dot"></i>Audio radar</span><strong>On</strong><button class="toggle on" data-toggle="radar" type="button" aria-label="Toggle audio radar"><span></span></button></div>
          <div class="radar-row"><span><i class="legend coral-dot"></i>Magnetic snap</span><strong>On</strong><button class="toggle on" data-toggle="magnetic" type="button" aria-label="Toggle magnetic snap"><span></span></button></div>
        </div>
        <div class="recent-panel"><div class="panel-title"><span class="section-kicker">Recently used</span><button type="button" class="more-button" aria-label="More recent commands">•••</button></div><button class="recent-item" data-command="Read this page aloud" type="button"><span class="recent-icon">◉</span><span><b>Read this page</b><small>Just now</small></span><span class="recent-arrow">↗</span></button><button class="recent-item" data-command="Open my calendar" type="button"><span class="recent-icon">▦</span><span><b>Open calendar</b><small>Yesterday</small></span><span class="recent-arrow">↗</span></button></div>
      </aside>
    </section>
    <footer><span>Designed for more independent moments.</span><span>AURA v0.1 <span class="footer-dot">●</span></span></footer>
  </main>
  <div class="cursor-halo" aria-hidden="true"><span></span></div>
`

const voiceButton = document.querySelector('#voiceButton')
const voiceLabel = document.querySelector('#voiceLabel')
const transcript = document.querySelector('#voiceTranscript')
const commandInput = document.querySelector('#commandInput')
const commandForm = document.querySelector('#commandForm')
let listening = false
let radarOn = true
let magneticOn = true

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
  }
}

function beep() {
  if (!radarOn) return
  const context = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = 620
  gain.gain.setValueAtTime(0.04, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.18)
}

function runCommand(command) {
  const cleanCommand = command.trim()
  if (!cleanCommand) return
  voiceLabel.textContent = 'Command complete'
  transcript.textContent = `“${cleanCommand}”`
  commandInput.value = ''
  beep()
  speak(`I’ll ${cleanCommand.toLowerCase()}.`)
  document.body.classList.add('command-fired')
  setTimeout(() => document.body.classList.remove('command-fired'), 850)
}

voiceButton.addEventListener('click', () => {
  listening = !listening
  voiceButton.classList.toggle('listening', listening)
  voiceLabel.textContent = listening ? 'I’m listening…' : 'Ready when you are'
  transcript.textContent = listening ? 'Tell me what you need.' : '“What would you like me to do?”'
  if (listening) { beep(); speak('I’m listening.') }
})

commandForm.addEventListener('submit', (event) => { event.preventDefault(); runCommand(commandInput.value) })
document.querySelectorAll('[data-command]').forEach((button) => button.addEventListener('click', () => runCommand(button.dataset.command)))
document.querySelector('#readButton').addEventListener('click', () => runCommand('Read this page aloud'))
document.querySelector('[data-action="settings"]').addEventListener('click', () => { document.body.classList.toggle('high-contrast'); speak('Visual contrast updated') })

document.querySelectorAll('[data-toggle]').forEach((toggle) => toggle.addEventListener('click', () => {
  const type = toggle.dataset.toggle
  if (type === 'radar') radarOn = !radarOn
  if (type === 'magnetic') magneticOn = !magneticOn
  toggle.classList.toggle('on')
  toggle.closest('.radar-row').querySelector('strong').textContent = toggle.classList.contains('on') ? 'On' : 'Off'
  if (type === 'magnetic') document.body.classList.toggle('magnetic-off', !magneticOn)
}))

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'v' && document.activeElement !== commandInput) voiceButton.click()
})

document.addEventListener('mousemove', (event) => {
  const halo = document.querySelector('.cursor-halo')
  halo.style.left = `${event.clientX}px`
  halo.style.top = `${event.clientY}px`
  if (!magneticOn) return
  const target = event.target.closest('.magnetic')
  document.querySelectorAll('.magnetic').forEach((card) => card.classList.remove('magnetic-focus'))
  if (target) target.classList.add('magnetic-focus')
})
