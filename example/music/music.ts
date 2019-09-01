import {
  Gui,
  SelectedButton,
  View,
  Image,
  Text,
  Bannar,
  Progress
} from '@duck/gui';

const resPath = __dirname;
const gui = new Gui();
gui.window(980, 660, '鸭子播放器');

const main = new View(gui.matchParent, gui.matchParent);
const left = new View(200, 600);
left.setAttrs('background', 0xfff6f6f6);

const bottom = new View(gui.matchParent, 60);
bottom.setAttrs('background', 0xffffffff);

const right = new View(gui.fillRest, 600);
right.setAttrs('background', 0xffffffff);

const avatar = new View(200, 160);
avatar.setAttrs('background', 0xfff6f6f6);
const img = new Image(60, 60, resPath+'/gaga.jpg');
img.setMargin(70.0, 60.0, 40.0, 40.0);
const nickname = new Text(gui.matchParent, 40.0, '嘎嘎');
nickname.setAttrs('color', 0xff000000);
avatar.addChild(img);
avatar.addChild(nickname);

const line = new View(200, 1);
line.setAttrs('background', 0xffeceaeb);

// category
const catName = new Text(200, 20, '音乐馆');
catName.setAttrs('text-align', 'left');
catName.setAttrs('color', 0xff9b9b9b);
catName.setAttrs('hover-color', 0xff9b9b9b);
catName.setAttrs('font-size', 18);
// gui.setAttrs(catName, 'padding-left', 10);
catName.setAttrs('padding-left', 20);
catName.setMargin(0, 0, 10, 10);

const cateButtons = [];
const myButtons = [];

const cateButtonsName = [
  {
    title: '精选',
    icon: [resPath + '/home_recommend.png', resPath + '/home_recommend_hl.png']
  },
  {
    title: '排行',
    icon: [resPath + '/home_ranking.png', resPath + '/home_ranking_hl.png']
  },
  {
    title: '歌单',
    icon: [
      resPath + '/home_choiceness.png',
      resPath + '/home_choiceness_hl.png'
    ]
  },
  {
    title: '电台',
    icon: [resPath + '/home_radio.png', resPath + '/home_radio_hl.png']
  },
  { title: 'MV', icon: [resPath + '/home_mv.png', resPath + '/home_mv_hl.png'] }
];

left.addChild(avatar);
left.addChild(line);
left.addChild(catName);

cateButtonsName.forEach(e => {
  const button = new SelectedButton(160, 30, e.title, e.icon, 20, 8, 6);
  button.setAttrs('font-size', 18);
  button.setAttrs('text-align', 'left');
  button.setAttrs('color', 0xff000000);
  button.setAttrs('hover-color', 0xffffffff);
  button.setAttrs('background', 0xfff6f6f6);
  button.setAttrs('hover-background', 0xffdcdcdc); //3acc81
  button.setAttrs('selected-background', 0xff3acc81);
  button.setMargin(20, 20, 0, 0);
  button.setAttrs('padding-left', 40);
  button.setClick((widget, parent, type, data) => {
    cateButtons.forEach(o => {
      o.isSelect = false;
    });
    myButtons.forEach(o => {
      o.isSelect = false;
    });
    button.isSelect = true;
  });
  left.addChild(button);
  cateButtons.push(button);
});
cateButtons[0].isSelect = true;

// my music
const myName = new Text(200, 20, '我的音乐');
myName.setAttrs('text-align', 'left');
myName.setAttrs('color', 0xff9b9b9b);
myName.setAttrs('hover-color', 0xff9b9b9b);
myName.setAttrs('padding-left', 20);
myName.setAttrs('font-size', 18);
myName.setMargin(0, 0, 10, 10);
left.addChild(myName);

const myButtonsName = [
  {
    title: '我喜欢',
    icon: [resPath + '/home_love.png', resPath + '/home_love_hl.png']
  },
  {
    title: '本地歌曲',
    icon: [
      resPath + '/localsong_Normal.png',
      resPath + '/localsong_Selected.png'
    ]
  },
  {
    title: '下载歌曲',
    icon: [resPath + '/home_download.png', resPath + '/home_download_hl.png']
  },
  {
    title: '播放历史',
    icon: [
      resPath + '/home_recentPlay.png',
      resPath + '/home_recentPlay_hl.png'
    ]
  }
];

myButtonsName.forEach(e => {
  const button = new SelectedButton(160, 30, e.title, e.icon, 20, 8, 6);
  button.setAttrs('font-size', 18);
  button.setAttrs('text-align', 'left');
  button.setAttrs('color', 0xff000000);
  button.setAttrs('hover-color', 0xffffffff);
  button.setAttrs('background', 0xfff6f6f6);
  button.setAttrs('hover-background', 0xffdcdcdc); //3acc81
  button.setAttrs('selected-background', 0xff3acc81);
  button.setMargin(20, 20, 0, 0);
  button.setAttrs('padding-left', 40);
  button.setClick((widget, parent, type, data) => {
    myButtons.forEach(o => {
      o.isSelect = false;
    });
    cateButtons.forEach(o => {
      o.isSelect = false;
    });
    button.isSelect = true;
  });
  left.addChild(button);
  myButtons.push(button);
});
// bottom
const prev = new Image(25, 25, resPath + '/playPreview.png');
const play = new Image(30, 30, resPath + '/play.png');
const next = new Image(25, 25, resPath + '/playNext.png');

prev.setMargin(20, 0, 20, 20);
play.setMargin(10, 10, 16, 10);
next.setMargin(0, 20, 20, 20);

const bottomLeft = new View(200, gui.matchParent);
bottomLeft.setAttrs('background', 0xffeaeaea);
bottomLeft.addChild(prev, play, next);
bottom.addChild(bottomLeft);

const bottomRight = new View(gui.fillRest, gui.matchParent);
bottomRight.setAttrs('background', 0xffeaeaea);
bottom.addChild(bottomRight);
const musicCover = new Image(40, 40, resPath + '/cover4.png');
musicCover.setMargin(20, 20, 10, 10);

const musicTitle = new Text(gui.matchParent, 20, 'Never Mean To Be');
musicTitle.setAttrs('text-align', 'left');
musicTitle.setAttrs('color', 0xff000000);
musicTitle.setMargin(0, 10, 10, 10);
const musicInfo = new View(gui.fillRest, gui.matchParent);
musicInfo.setMargin(0, 10, 0, 0);
const progress = new Progress(100, 4, 20);
musicInfo.addChild(musicTitle, progress);
progress.setAttrs('color', 0xff3acc81);
progress.setMargin(0, 0, 10, 0);
progress.setAttrs('background', 0xffe4e7ec);
bottomRight.addChild(musicCover, musicInfo);
musicInfo.setAttrs('background', 0xffeaeaea);

// recommend
const recommend = new View(gui.matchParent, 220);
const banner = new Bannar(gui.matchParent, gui.matchParent, [
  resPath + '/bannar1.png',
  resPath + '/bannar2.png',
  resPath + '/bannar3.png'
]);
banner.setAttrs('background', 0xffffffff);
recommend.addChild(banner);
recommend.setMargin(20, 20, 20, 20);
recommend.setAttrs('background', 0xffffffff);
right.addChild(recommend);

// 专辑首发
const first = new View(gui.matchParent, 300);
first.setAttrs('background', 0xffffffff);
first.setMargin(20, 20, 20, 20);

const firstTitle = new Text(gui.matchParent, 20.0, '专辑首发');
firstTitle.setAttrs('color', 0xff000000);
firstTitle.setMargin(0, 0, 20, 20);
firstTitle.setAttrs('text-align', 'left');
first.addChild(firstTitle);

const createItem = (cover, title, name) => {
  const firstItem = new View(120, 200);
  firstItem.setAttrs('background', 0xffffffff);
  const firstItemCover = new Image(120, 120, cover);
  const firstItemTitle = new Text(gui.matchParent, 40, title);
  firstItemTitle.setAttrs('color', 0xff000000);
  firstItemTitle.setAttrs('font-size', 18);
  firstItemTitle.setAttrs('text-align', 'left');
  const firstItemAuth = new Text(gui.matchParent, 40, name);
  firstItemAuth.setAttrs('color', 0xffd0d0d0);
  firstItemAuth.setAttrs('font-size', 16);
  firstItemAuth.setAttrs('text-align', 'left');
  firstItem.addChild(firstItemCover, firstItemTitle, firstItemAuth);
  firstItem.setMargin(0, 20, 10, 0);
  return firstItem;
};

first.addChild(createItem(resPath + '/cover1.png', '远山剑鸣', '叶炫清'));
first.addChild(createItem(resPath + '/cover2.png', '星舞者', '罗志祥'));
first.addChild(createItem(resPath + '/cover3.png', '千年等一回', '鞠婧祎'));
first.addChild(createItem(resPath + '/cover1.png', '远山剑鸣', '叶炫清'));
first.addChild(createItem(resPath + '/cover2.png', '星舞者', '罗志祥'));
first.addChild(createItem(resPath + '/cover3.png', '千年等一回', '鞠婧祎'));
first.addChild(createItem(resPath + '/cover1.png', '远山剑鸣', '叶炫清'));
first.addChild(createItem(resPath + '/cover2.png', '星舞者', '罗志祥'));
first.addChild(createItem(resPath + '/cover3.png', '千年等一回', '鞠婧祎'));

right.addChild(first);

main.addChild(left);
main.addChild(right);
main.addChild(bottom);
gui.addChild(main);
gui.loop();
