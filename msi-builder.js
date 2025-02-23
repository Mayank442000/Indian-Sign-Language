// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute
const APP_DIR = path.resolve(__dirname, 'indian-sign-language-learning-app-win32-x64');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(__dirname, 'windows_installer');

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,

  name: 'indian-sign-language-learning-app',
  exe: 'indian-sign-language-learning-app',
  description: 'Indian Sign Language learning app with AI',
  icon: './Project/Resources/images/favicon_io/favicon.ico',
  manufacturer: 'indian-sign-language-learning',
  version: '1.0.0',
});

// 4. Create a .wxs template file
msiCreator.create().then(function(){

  // Step 5: Compile the template to a .msi file
  msiCreator.compile();
});
