import { Gui } from './gui';

const gui = new Gui();
gui.window(240, 340, 'calc');
let show = '';
const main = gui.view(gui.matchParent, gui.matchParent);
const result = gui.button(224.0, 60.0, '');
const cls = gui.button(108.0, 50.0, 'CLS');
const percent = gui.button(50.0, 50.0, ' % ');
const div = gui.button(50.0, 50.0, '/');
const num7 = gui.button(50.0, 50.0, '7');
const num8 = gui.button(50.0, 50.0, '8');
const num9 = gui.button(50.0, 50.0, '9');
const num6 = gui.button(50.0, 50.0, '6');
const num5 = gui.button(50.0, 50.0, '5');
const num4 = gui.button(50.0, 50.0, '4');
const num3 = gui.button(50.0, 50.0, '3');
const num2 = gui.button(50.0, 50.0, '2');
const num1 = gui.button(50.0, 50.0, '1');
const num0 = gui.button(108.0, 50.0, '0');
const mul = gui.button(50.0, 50.0, '*');
const sub = gui.button(50.0, 50.0, '-');
const add = gui.button(50.0, 50.0, '+');
const ret = gui.button(50.0, 50.0, '=');
const dot = gui.button(50.0, 50.0, '.');

const arr = [
  result,
  cls,
  percent,
  div,
  num7,
  num8,
  num9,
  mul,
  num4,
  num5,
  num6,
  sub,
  num1,
  num2,
  num3,
  add,
  num0,
  dot,
  ret
];
[sub, mul, add, ret, div].forEach(e => {
  gui.setAttrs(e, 'background', 0xfff79231);
});
gui.setClick(num0, (widget, parent, type, data) => {
  show += gui.getText(widget);
  console.log('show=>',show);
  gui.setText(result, show);
});
arr.forEach(e => {
  gui.setMargin(e, 4.0, 4.0, 4.0, 4.0);
  gui.setAttrs(e, 'font-size', 24);
  gui.addChild(main, e);
});
gui.setAttrs(result, 'text-align', 'left');
gui.setAttrs(result, 'font-size', 50);
gui.addChild(main);
gui.loop();
