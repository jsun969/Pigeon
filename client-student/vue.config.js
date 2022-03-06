module.exports = {
  pages: {
    index: 'src/main.js',
    popup: 'src/popup.js',
  },
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.electron.pigeon',
      },
    },
  },
};
