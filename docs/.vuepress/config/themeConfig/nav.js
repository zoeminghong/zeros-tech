// nav
module.exports = [
  { text: '首页', link: '/' },
  {
    text: '架构',
    link: '/architecture/', //目录页链接，此处link是vdoing主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
    items: [
    ],
  },
  {
    text: '大数据',
    link: '/bigdata/',
    items: [
      
    ],
  },
  {
    text: '数据库',
    link: '/database/',
    items: [
      
    ],
  },
  {
    text: '技术',
    link: '/technology/',
    items: [
      { 
        text: '面试', 
        link: '/technology/interview/',
        items: [
          { text: 'Java面试', link: '/pages/71d5e1/' },
          { text: '大数据面试', link: '/pages/b45305/' },
          { text: '架构面试', link: '/pages/9390e0/' },
        ],
     },
    ],
  },
  {
    text: '语言',
    link: '/language/',
    items: [
    
    ],
  },
  {
    text: '运维',
    link: '/ops/',
    items: [
    
    ],
  },
  { text: '关于', link: '/about/' },
  {
    text: '收藏',
    link: '/pages/beb6c0bd8a66cea6/',
    items: [
      { text: '网站', link: '/pages/beb6c0bd8a66cea6/' },
      { text: '资源', link: '/pages/eee83a9211a70f9d/' },
      { text: 'Vue资源', link: '/pages/12df8ace52d493f6/' },
    ],
  },
  {
    text: '索引',
    link: '/archives/',
    items: [
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
    ],
  },
]
