const head = require('./config/head.js');
const plugins = require('./config/plugins.js');
const themeConfig = require('./config/themeConfig.js');

module.exports = {
  theme: 'vdoing', // 使用依赖包主题
  // theme: require.resolve('../../theme-vdoing'), // 使用本地主题

  title: "Zeros Tech",
  description: '分享技术，Coding 世界',
  // base: '/', // 格式：'/<仓库名>/'， 默认'/'
  markdown: {
    lineNumbers: true, // 代码行号
  },

  head,
  plugins:[
    [
      'vuepress-plugin-comment',
      {
        choosen: 'gitalk', 
        options: {
          clientID: 'baa6cf87e091d19b9fec',
          clientSecret: 'e464ce048d93cd8c07c5f12bbbad3c03cf0711aa',
          repo: 'git@github.com:zoeminghong/zeros-tech.git',
          owner: 'zoeminghong',
          admin: ['zoeminghong'],
          distractionFreeMode: false 
        }
      }
    ]
  ],
  themeConfig,
}
