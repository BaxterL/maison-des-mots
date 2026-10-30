export const tones = [
  { id: 'tender', label: '温柔诗行', french: 'Tendre' },
  { id: 'romantic', label: '法式浪漫', french: 'Romantique' },
  { id: 'playful', label: '俏皮日常', french: 'Espiègle' },
];

export const examples = [
  { title: '给一家街角花店', topic: '街角花店的春日午后', tone: 'tender', label: '花店与春天' },
  { title: '给一瓶月光香水', topic: '带有茉莉与月光气息的香水', tone: 'romantic', label: '香水与月光' },
  { title: '给星期天的自己', topic: '睡到自然醒的星期天', tone: 'playful', label: '星期天与自己' },
];

const openings = {
  tender: ['把日子放慢一点', '愿寻常也有回响', '留一页给温柔'],
  romantic: ['今夜的月亮有名字', '浪漫不必等回信', '把心动藏进蓝色'],
  playful: ['今天也不赶时间', '生活刚刚翻到新一页', '先把快乐夹进书里'],
};

const closings = {
  tender: ['不必盛大，能够被轻轻记住，就已经很好。', '愿每一个平常的日子，都有一处值得珍藏的折角。', '让细碎的美慢慢靠近，让生活保留柔软的空白。'],
  romantic: ['像一封没有地址的信，风经过时，也替它心动。', '今晚会过去，但这一点微光，会替你留在故事里。', '让此刻成为以后想起时，仍然忍不住微笑的那一页。'],
  playful: ['如果快乐有声音，今天大概是纸张翻动时的沙沙声。', '先把烦恼留在上一页，这一页只负责好看和开心。', '不赶路的时光，连影子都走得比较可爱。'],
};

export function createCopy(topic, tone, variation = 0) {
  const subject = topic.trim().replace(/[。！？!?]+$/, '');
  const index = variation % 3;
  const title = openings[tone][index];
  const middle = {
    tender: `关于${subject}，我想留下这样一行字：光落下来的地方，时间也愿意坐一会儿。那些没有被说出的喜欢，正藏在花影、纸页与午后的微风里。`,
    romantic: `${subject}，像巴黎黄昏里的一次回眸。蓝色瓶塞藏起一缕香，旧信纸收好一句话，而我负责把这一瞬间，写成可以反复翻阅的浪漫。`,
    playful: `今天的主题很简单：${subject}。给咖啡多留一点热气，给花瓶换一个新位置，再把待办事项暂时压在那本很好看的书下面。`,
  }[tone];

  return {
    title,
    body: `${middle}${closings[tone][(index + 1) % 3]}`,
    note: `${tones.find((item) => item.id === tone)?.french} · Édition ${String(variation + 1).padStart(2, '0')}`,
    signature: 'avec tendresse,',
    custom: false,
  };
}

export const initialCopy = {
  title: '把日子放慢一点',
  body: '关于街角花店的春日午后，我想留下这样一行字：光落下来的地方，时间也愿意坐一会儿。那些没有被说出的喜欢，正藏在花影、纸页与午后的微风里。愿每一个平常的日子，都有一处值得珍藏的折角。',
  note: 'Tendre · Édition 01',
  signature: 'avec tendresse,',
  custom: false,
};
