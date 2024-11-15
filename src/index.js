const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Load the template JSON data
function loadTemplateData() {
  const dataPath = path.join(__dirname, 'config.json');
  return JSON.parse(fs.readFileSync(dataPath));
}

// Create the main window
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile('index.html');
}

// Event listener to save modified config.json
ipcMain.on('save-config', (event, newConfig) => {
  const savePath = dialog.showSaveDialogSync({
    title: 'Save Config File',
    defaultPath: path.join(__dirname, 'config.json'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  
  if (savePath) {
    fs.writeFileSync(savePath, JSON.stringify(newConfig, null, 2));
    event.sender.send('save-success', 'Configuration saved successfully!');
  }
});

// Initialize the Electron app
app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
