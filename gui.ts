import { Duck } from './duck';

export class Gui extends Duck {
  clickCount = 0;
  freeLayout;
  linearLayout;
  frameLayout;
  flowLayout;
  popLayout;
  matchParent;
  wrapContent;
  fillRest;
  constructor() {
    super();
    const ret = this.eval(
      `(import  (scheme) 
        (gui duck) 
        (gui window) 
        (gui widget) 
        (glfw glfw) 
        (gui layout)
        (gui draw)
        (utils trace) ) 
        (stack-trace-exception)  
        `
    );
    this.freeLayout = this.eval(`free-layout`);
    this.linearLayout = this.eval(`linear-layout`);
    this.frameLayout = this.eval(`frame-layout`);
    this.flowLayout = this.eval(`flow-layout`);
    this.popLayout = this.eval(`pop-layout`);
    this.matchParent = -1.0;
    this.wrapContent = 0;
    this.fillRest = -2.0;
    this.prepare();
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
    this.end();
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
  setAttrs(widget, attr, value) {
    const val = this.makeVal(value);
    this.call3('widget-set-attrs', widget, this.symbol(attr), val);
  }
  makeVal(value) {
    let val = null;
    if (typeof value === 'number') {
      val = this.fixnum(value);
    } else if (typeof value === 'string') {
      val = this.string(value);
    } else {
      val = this.symbol(value);
    }
    return val;
  }
  setAttr(widget, attr, value) {
    const val = this.makeVal(value);
    this.call3(
      'widget-set-attr',
      widget,
      this.top_value(this.symbol(attr)),
      val
    );
  }
  getVal(value) {
    if(this.is_fixnum(value)){
      return this.fixnum_value(value);
    }else if(this.is_flonum(value)){
      return this.flonum_value(value);
    }else if(this.is_symbol(value)){
      return value;
    }else if( this.is_string(value)){
      return this.get_string(value);
    }else if(this.is_vector(value)){
      return this.get_vector_array(value);
    }
    return value;
  }
  getAttr(widget, index) {
    const ret = this.call2(
      'widget-get-attr',
      widget,
      this.top_value(this.symbol(index))
    );
    return this.getVal(ret);
  }
  getAttrs(widget, name) {
    const ret=this.call2(
      'widget-get-attrs',
      widget,
      this.top_value(this.symbol(name))
    );
    return this.getVal(ret);
  }
  getText(widget) {
    const text = this.get_string(this.getAttr(widget, '%text'));
    return text;
  }
  setText(widget, text) {
    this.setAttr(widget, '%text', text);
  }
  setClick(widget, clickFn) {
    const exp = this.make_callback_exp(
      `click.${this.clickCount++}`,
      (widget, parent, type, data) => {
        clickFn(widget, parent, type, this.get_vector_array(data));
      },
      ['pointer', 'pointer', 'int', 'pointer'],
      'void'
    );
    const call = this.eval(exp);
    this.call3('widget-set-events', widget, this.symbol('click'), call);
  }
  setDraw(widget, drawFn) {
    const exp = this.make_callback_exp(
      `draw.${this.clickCount++}`,
      (widget, parent) => {
        drawFn(widget, parent);
      },
      ['pointer', 'pointer'],
      'void'
    );
    const call = this.eval(exp);
    this.call2('widget-set-draw', widget, call);
  }
  addDraw(widget, drawFn) {
    const exp = this.make_callback_exp(
      `draw.${this.clickCount++}`,
      (widget, parent) => {
        drawFn(widget, parent);
      },
      ['pointer', 'pointer'],
      'void'
    );
    const call = this.eval(exp);
    this.call2('widget-add-draw', widget, call);
  }
  setMargin(widget, left, right, top, bottom) {
    this.call5(
      'widget-set-margin',
      widget,
      this.flonum(left),
      this.flonum(right),
      this.flonum(top),
      this.flonum(bottom)
    );
  }
  drawLine(x1, y1, x2, y2, color) {
    this.eval(
      `(draw-line ${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(
        2
      )} ${y2.toFixed(2)} ${color})`
    );
  }
  drawRect(x1, y1, w, h, color) {
    this.eval(
      `(draw-rect ${x1.toFixed(2)} ${y1.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(
        2
      )} ${color})`
    );
  }
}
