const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 720, show: false, webPreferences: { backgroundThrottling: false } })
  await win.loadURL('http://127.0.0.1:4173/rasterglow-terminal/')
  await new Promise(resolve => setTimeout(resolve, 1800))
  const image = await win.webContents.capturePage()
  fs.writeFileSync(path.resolve(__dirname, '../../docs/rasterglow-terminal-web-demo.png'), image.toPNG())
  app.quit()
})
