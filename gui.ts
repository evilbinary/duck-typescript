import { Duck } from './duck';

export class Gui extends Duck {
  clickCount = 0;
  freeLayout;
  linearLayout;
  frameLayout;
  flowLayout;
  popLayout;
  matchParent;
  constructor() {
    super();
    const ret = this.eval(
      `(import  (scheme) 
        (gui duck) 
        (gui window) 
        (gui widget) 
        (glfw glfw) 
        (gui layout)
        (utils trace) ) 
        (stack-trace-exception)  
        `
    );
    this.freeLayout = this.eval(`free-layout`);
    this.linearLayout = this.eval(`linear-layout`);
    this.frameLayout = this.eval(`frame-layout`);
    this.flowLayout = this.eval(`flow-layout`);
    this.popLayout = this.eval(`pop-layout`);
    this.matchParent = this.top_value(this.symbol('%match-parent'));
  }
  setLayout(widget, layout) {
    this.call2('widget-set-layout', widget, layout);
  }
  window(width, height, title) {
    const str = `(set! window (window-create ${width} ${height} "${title}")) window`;
    return this.eval(str);
  }
  loop() {
    this.eval(' (window-loop window)');
  }
  text(width, height, title) {
    return this.eval(
      `(text ${width.toFixed(2)} ${height.toFixed(2)} "${title}" )`
    );
    // return this.call3('text',this.float(width),this.float(height),this.string(title));
  }
  button(width, height, title) {
    return this.eval(
      `(button ${width.toFixed(2)} ${height.toFixed(2)} "${title}" )`
    );
  }
  scroll(width, height) {
    return this.eval(`(image ${width.toFixed(2)} ${height.toFixed(2)} )`);
  }
  view(width, height) {
    return this.eval(`(view ${width.toFixed(2)} ${height.toFixed(2)} )`);
  }
  pop(width, height, title) {
    return this.eval(
      `(view ${width.toFixed(2)} ${height.toFixed(2)} "${title}" )`
    );
  }
  progress(width, height, percent) {
    return this.eval(
      `(view ${width.toFixed(2)} ${height.toFixed(2)} ${percent.toFixed(2)} )`
    );
  }
  edit(width, height, title) {
    return this.eval(
      `(edit ${width.toFixed(2)} ${height.toFixed(2)} "${title}" )`
    );
  }
  tree(width, height, title) {
    return this.eval(
      `(tree ${width.toFixed(2)} ${height.toFixed(2)} "${title}" )`
    );
  }
  video(width, height, src) {
    return this.eval(
      `(edit ${width.toFixed(2)} ${height.toFixed(2)} "${src}" )`
    );
  }
  image(width, height, src) {
    return this.eval(
      `(image ${width.toFixed(2)} ${height.toFixed(2)} "${src}" )`
    );
  }
  dialog(x, y, width, height, title) {
    const ret = this.eval(
      `(dialog ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(
        2
      )} ${height.toFixed(2)} "${title}" )`
    );
    return ret;
  }
  addChild(parent, child = null) {
    if (child == null) {
      return this.call1('widget-add', parent);
    }
    return this.call2('widget-add', parent, child);
  }
  getAttr(widget, index) {
    const ret = this.call2(
      'widget-get-attr',
      widget,
      this.top_value(this.symbol(index))
    );
    return ret;
  }
  getAttrs(widget, name) {
    return this.call2('widget-get-attrs', widget, this.string(name));
  }
  getText(widget) {
    return this.getAttr(widget, '%text');
  }
  setClick(widget, clickFn) {
    const exp = this.make_callback_exp(
      `${this.get_string(this.getAttr(widget, '%text'))}.click.${this
        .clickCount++}`,
      (widget, parent, type, data) => {
        clickFn(widget, parent, type, this.get_vector_array(data));
      },
      ['pointer', 'pointer', 'int', 'pointer'],
      'void'
    );
    const call = this.eval(exp);
    this.call3('widget-set-events', widget, this.symbol('click'), call);
  }
}
