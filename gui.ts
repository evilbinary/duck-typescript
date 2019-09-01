import { Duck } from './duck';
let fnCount = 0;
export class Gui extends Duck {
  freeLayout;
  linearLayout;
  frameLayout;
  flowLayout;
  popLayout;
  matchParent;
  wrapContent;
  matchRest;
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
        (gui stb)
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
    this.eval('(window-loop window)');
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
      `(progress ${width.toFixed(2)} ${height.toFixed(2)} ${percent.toFixed(2)} )`
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
    if (parent instanceof Widget) {
      parent = parent.widget;
    }
    if (child == null) {
      return this.call1('widget-add', parent);
    } else {
      if (child instanceof Widget) {
        child = child.widget;
      }
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
      val = this.symbol(value);
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
    if (this.is_fixnum(value)) {
      return this.fixnum_value(value);
    } else if (this.is_flonum(value)) {
      return this.flonum_value(value);
    } else if (this.is_symbol(value)) {
      return this.get_string(value);
    } else if (this.is_string(value)) {
      return this.get_string(value);
    } else if (this.is_vector(value)) {
      return this.get_vector_array(value);
    } else if (this.is_nil(value)) {
      return 0;
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
    const ret = this.call2('widget-get-attrs', widget, this.symbol(name));
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
      `click.${fnCount++}`,
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
      `draw.${fnCount++}`,
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
      `draw.${fnCount++}`,
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
  isSetStatus(widget, status) {
    const ret = this.call2(
      'widget-status-is-set',
      widget,
      this.top_value(this.symbol(status))
    );
    return this.fixnum_value(ret);
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
  drawImage(x, y, w, h, src) {
    this.eval(
      `(draw-image ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(
        2
      )} ${src})`
    );
  }
  loadImage(src) {
    const id = this.eval(`(load-texture "${src}")`);
    return this.fixnum_value(id);
  }
}

export class Widget extends Gui {
  widget;
  constructor() {
    super();
  }
  setLayout(layout) {
    super.setLayout(this.widget, layout);
  }
  setClick(clickFn) {
    super.setClick(this.widget, clickFn);
  }
  addChild(child, ...childs: any[]) {
    super.addChild(this.widget, child.widget);
    if (childs && childs.length > 0) {
      childs.forEach(e => {
        super.addChild(this.widget, e.widget);
      });
    }
  }
  setAttr(attr, value) {
    super.setAttr(this.widget, attr, value);
  }
  setAttrs(attr, value) {
    super.setAttrs(this.widget, attr, value);
  }
  setMargin(left, right, top, bottom) {
    super.setMargin(this.widget, left, right, top, bottom);
  }
  addDraw(drawFn) {
    super.addDraw(this.widget, drawFn);
  }
  getAttr(attr) {
    return super.getAttr(this.widget, attr);
  }
  getAttrs(attr) {
    return super.getAttrs(this.widget, attr);
  }
  getText() {
    return super.getText(this.widget);
  }
  setText(text) {
    super.setText(this.widget, text);
  }
  isSetStatus(status) {
    return super.isSetStatus(this.widget, status);
  }
}

export class View extends Widget {
  constructor(w: number, h: number) {
    super();
    this.widget = this.view(w, h);
  }
}

export class Image extends Widget {
  constructor(w: number, h: number, src: string) {
    super();
    this.widget = this.image(w, h, src);
  }
}

export class Text extends Widget {
  constructor(w: number, h: number, title: string) {
    super();
    this.widget = this.text(w, h, title);
  }
}

export class Button extends Widget {
  constructor(w: number, h: number, title) {
    super();
    this.widget = this.button(w, h, title);
  }
}

export class Progress extends Widget {
  constructor(w: number, h: number, percent:number) {
    super();
    this.widget = this.progress(w, h, percent);
  }
}

export class Bannar extends Widget {
  widget;
  images = [];
  current;
  constructor(w: number, h: number, images) {
    super();
    this.widget = this.view(w, h);
    images.forEach((e, i) => {
      this.images[i] = this.loadImage(e);
    });
    this.current = images.length >= 2 ? 1 : 1;
    this.addDraw((widget, parent) => {
      const x = this.getAttr('%gx');
      const y = this.getAttr('%gy');
      const w = this.getAttr('%w');
      const h = this.getAttr('%h');

      this.drawImage(
        x,
        y+(h * 1) / 10,
        (w * 4) / 6,
        (h * 8) / 10,
        this.images[this.current - 1]
      );
      this.drawImage(
        x + (w * 4) / 6,
        y+(h * 1) / 10,
        (w * 4) / 6,
        (h * 8) / 10,
        this.images[this.current + 1]
      );
      this.drawImage(
        x + (w * 1) / 6,
        y,
        (w * 4) / 6,
        h,
        this.images[this.current]
      );
    });
  }
}

export class SelectedButton extends Widget {
  icons = [];
  _isSelect = false;
  color;
  bg;
  set isSelect(val) {
    if (!this.color) {
      this.color = this.getAttrs('color');
    }
    if (!this.bg) {
      this.bg = this.getAttrs('background');
    }
    if (val) {
      const color = this.getAttrs('hover-color');
      const bg = this.getAttrs('selected-background');
      this.setAttrs('color', color);
      this.setAttrs('background', bg);
    } else {
      this.setAttrs('color', this.color);
      this.setAttrs('background', this.bg);
    }
    this._isSelect = val;
  }
  get isSelect() {
    return this._isSelect;
  }
  constructor(
    w: number,
    h: number,
    title: string,
    iconPath: string | Array<string>,
    size: number,
    iconLeft: number = 0,
    iconTop: number = 0
  ) {
    super();
    if (typeof iconPath === 'string') {
      this.icons[0] = this.loadImage(iconPath);
      this.icons[1] = this.icons[0];
    } else {
      iconPath.forEach((e, i) => {
        this.icons[i] = this.loadImage(e);
      });
    }
    this.widget = this.button(w, h, title);

    this.addDraw((widget, parent) => {
      const x = this.getAttr('%gx');
      const y = this.getAttr('%gy');
      if (this.isSelect) {
        this.drawImage(iconLeft + x, y + iconTop, size, size, this.icons[1]);
      } else {
        if (this.isSetStatus('%status-hover') === 1) {
          this.drawImage(iconLeft + x, y + iconTop, size, size, this.icons[1]);
        } else {
          this.drawImage(iconLeft + x, y + iconTop, size, size, this.icons[0]);
        }
      }
    });
  }
  setSelect(val) {
    this.isSelect = val;
  }
}
