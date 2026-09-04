const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const pty = require('node-pty');

let win;
let shell;

function createShell(cols, rows) {
  if (shell) return;
  shell = pty.spawn(
    'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    ['-NoLogo', '-NoExit', '-File', path.join(__dirname, 'retro-profile.ps1')],
    {
      name: 'xterm-256color', cols, rows,
      cwd: process.env.USERPROFILE,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor',
        TERM_PROGRAM: 'RasterGlowTerminal',
        TERM_PROGRAM_VERSION: '1.0.3',
        COLUMNS: String(cols),
        LINES: String(rows)
      },
      useConpty: true,
      useConptyDll: true
    }
  );
  shell.onData(data => {
    if (win && !win.isDestroyed()) win.webContents.send('terminal:data', data);
  });
  shell.onExit(() => {
    if (win && !win.isDestroyed()) win.webContents.send('terminal:exit');
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 850,
    minWidth: 800,
    minHeight: 500,
    backgroundColor: '#010503',
    title: 'RasterGlow Terminal — Real Afterglow',
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });
  win.webContents.on('render-process-gone', (_event, details) => console.error('Renderer gone:', details));
  win.webContents.on('did-fail-load', (_event, code, description) => console.error('Load failed:', code, description));

  win.loadFile('index.html');

}

ipcMain.on('terminal:input', (_event, data) => shell?.write(data));
ipcMain.on('window:fullscreen', () => win?.setFullScreen(!win.isFullScreen()));
ipcMain.on('terminal:resize', (_event, { cols, rows }) => {
  if (cols <= 1 || rows <= 1) return;
  if (!shell) createShell(cols, rows);
  else shell.resize(cols, rows);
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  shell?.kill();
  app.quit();
});
