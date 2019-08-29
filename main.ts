// duck gui
import { Gui } from './gui';

const gui = new Gui();
gui.window(400, 300, 'hello gui');
const dialog = gui.dialog(10.0, 10.0, 200.0, 160.0, 'hello 测试');
const text = gui.text(200.0, 300.0, 'test');
const button = gui.button(80.0, 30.0, 'button');
gui.setClick(button, (widget, p, type, data) => {
  console.log('click here');
  console.log(widget, p, type, data);
});
gui.addChild(dialog, button);

const image = gui.image(80.0, 80.0, './gaga.jpg');
gui.addChild(dialog, image);
console.log('free layout', gui.freeLayout);

// const edit=gui.edit(400.0,400.0,"edit");
// gui.addChild(d,edit);
// const video=gui.video(400.0,400.0,"http://vfx.mtime.cn/Video/2019/02/04/mp4/190204084208765161.mp4");
// gui.addChild(d,video);

gui.loop();
