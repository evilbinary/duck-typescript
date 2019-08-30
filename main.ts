// duck gui
import { Gui } from './gui';

const gui = new Gui();
gui.window(400, 300, 'hello gui');
const dialog = gui.dialog(10.0, 10.0, 200.0, 160.0, 'hello测试');

const text = gui.text(200.0, 300.0, 'test');
const button = gui.button(80.0, 30.0, 'button');
gui.setAttrs(button, 'background', 0xffff0000);
gui.setClick(button, (widget, parent, type, data) => {
  console.log('click here');
  console.log(widget, parent, type, data);
});
gui.addChild(dialog, button);

const image = gui.image(80.0, 80.0, './gaga.jpg');
gui.addChild(dialog, image);

gui.addDraw(dialog,(widget,parent)=>{
  const x=gui.getAttr(widget,'%gx');
  const y=gui.getAttr(widget,'%gy');
  gui.drawRect(x+40.0,y+90.0,10,10,0xffff0000);
})

// const edit=gui.edit(400.0,400.0,"edit");
// gui.addChild(dialog,edit);
// const video=gui.video(400.0,400.0,"http://vfx.mtime.cn/Video/2019/02/04/mp4/190204084208765161.mp4");
// gui.addChild(dialog,video);

gui.loop();
