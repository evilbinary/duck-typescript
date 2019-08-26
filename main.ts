// duck gui
import { Gui } from './gui';

const gui = new Gui();
gui.window(400, 300, 'hello gui');
const t = gui.text(200.0, 300.0, 'test');
const d = gui.dialog(10.0, 10.0, 200.0, 160.0, "hello 测试");
const button =gui.button(80.0,30.0,"button");
const image=gui.image(80.0,80.0,"./gaga.jpg");
gui.addChild(d,button);
gui.addChild(d,image);

gui.loop();
