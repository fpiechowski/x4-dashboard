async function loadState() {
  const state = await window.x4Desktop.getState()

  const localUrl = state.localUrl || '-'
  const lanUrl = state.lanUrl || 'Unavailable on this machine'

  document.getElementById('local-url').textContent = localUrl
  document.getElementById('lan-url').textContent = lanUrl
  document.getElementById('log-path').textContent = state.logPath || '-'

  const statusNode = document.getElementById('server-status')
  statusNode.textContent = state.serverRunning ? 'Online' : 'Offline'
  statusNode.className = `status-pill ${state.serverRunning ? 'online' : 'offline'}`

  document.getElementById('open-local').disabled = !state.localUrl
  document.getElementById('copy-local').disabled = !state.localUrl
  document.getElementById('open-lan').disabled = !state.lanUrl
  document.getElementById('copy-lan').disabled = !state.lanUrl
}

function bindAction(id, handler) {
  document.getElementById(id).addEventListener('click', handler)
}

bindAction('refresh-status', () => {
  void loadState()
})

bindAction('open-local', async () => {
  const state = await window.x4Desktop.getState()
  if (state.localUrl) await window.x4Desktop.openUrl(state.localUrl)
})

bindAction('copy-local', async () => {
  const state = await window.x4Desktop.getState()
  if (state.localUrl) await window.x4Desktop.copyText(state.localUrl)
})

bindAction('open-lan', async () => {
  const state = await window.x4Desktop.getState()
  if (state.lanUrl) await window.x4Desktop.openUrl(state.lanUrl)
})

bindAction('copy-lan', async () => {
  const state = await window.x4Desktop.getState()
  if (state.lanUrl) await window.x4Desktop.copyText(state.lanUrl)
})

bindAction('open-log', () => {
  void window.x4Desktop.showLogLocation()
})

void loadState()
