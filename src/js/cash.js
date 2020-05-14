/*! cash-dom 1.3.5, https://github.com/kenwheeler/cash @license MIT */
(function (factory) {
  window.cash = factory();
}(() => {
  const doc = document; const win = window; const ArrayProto = Array.prototype; const { slice } = ArrayProto; const { filter } = ArrayProto; const
    { push } = ArrayProto;

  const noop = function () {}; const isFunction = function (item) {
    // @see https://crbug.com/568448
    return typeof item === typeof noop && item.call;
  }; const
    isString = function (item) {
      return typeof item === typeof '';
    };

  const idMatch = /^#[\w-]*$/; const classMatch = /^\.[\w-]*$/; const htmlMatch = /<.+>/; const
    singlet = /^\w+$/;

  function find(selector, context) {
    context = context || doc;
    const elems = (classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
    return elems;
  }

  let frag;
  function parseHTML(str) {
    if (!frag) {
      frag = doc.implementation.createHTMLDocument(null);
      const base = frag.createElement('base');
      base.href = doc.location.href;
      frag.head.appendChild(base);
    }

    frag.body.innerHTML = str;

    return frag.body.childNodes;
  }

  function onReady(fn) {
    if (doc.readyState !== 'loading') {
      fn();
    } else {
      doc.addEventListener('DOMContentLoaded', fn);
    }
  }

  function Init(selector, context) {
    if (!selector) {
      return this;
    }

    // If already a cash collection, don't do any further processing
    if (selector.cash && selector !== win) {
      return selector;
    }

    let elems = selector; let i = 0; let
      length;

    if (isString(selector)) {
      elems = (idMatch.test(selector)
      // If an ID use the faster getElementById check
        ? doc.getElementById(selector.slice(1)) : htmlMatch.test(selector)
        // If HTML, parse it into real elements
          ? parseHTML(selector)
        // else use `find`
          : find(selector, context));

      // If function, use as shortcut for DOM ready
    } else if (isFunction(selector)) {
      onReady(selector); return this;
    }

    if (!elems) {
      return this;
    }

    // If a single DOM element is passed in or received via ID, return the single element
    if (elems.nodeType || elems === win) {
      this[0] = elems;
      this.length = 1;
    } else {
      // Treat like an array and loop through each item.
      length = this.length = elems.length;
      for (; i < length; i++) {
        this[i] = elems[i];
      }
    }

    return this;
  }

  function cash(selector, context) {
    return new Init(selector, context);
  }

  const fn = cash.fn = cash.prototype = Init.prototype = { // jshint ignore:line
    cash: true,
    length: 0,
    push,
    splice: ArrayProto.splice,
    map: ArrayProto.map,
    init: Init,
  };

  Object.defineProperty(fn, 'constructor', { value: cash });

  cash.parseHTML = parseHTML;
  cash.noop = noop;
  cash.isFunction = isFunction;
  cash.isString = isString;

  cash.extend = fn.extend = function (target) {
    target = target || {};

    const args = slice.call(arguments); const { length } = args; let
      i = 1;

    if (args.length === 1) {
      target = this;
      i = 0;
    }

    for (; i < length; i++) {
      if (!args[i]) {
        continue;
      }
      for (const key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          target[key] = args[i][key];
        }
      }
    }

    return target;
  };

  function each(collection, callback) {
    const l = collection.length; let
      i = 0;

    for (; i < l; i++) {
      if (callback.call(collection[i], collection[i], i, collection) === false) {
        break;
      }
    }
  }

  function matches(el, selector) {
    const m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
    return !!m && m.call(el, selector);
  }

  function getCompareFunction(selector) {
    return (
    /* Use browser's `matches` function if string */
      isString(selector) ? matches
      /* Match a cash element */
        : selector.cash ? function (el) {
          return selector.is(el);
        }
        /* Direct comparison */
          : function (el, selector) {
            return el === selector;
          });
  }

  function unique(collection) {
    return cash(slice.call(collection).filter((item, index, self) => self.indexOf(item) === index));
  }

  cash.extend({
    merge(first, second) {
      const len = +second.length; let i = first.length; let
        j = 0;

      for (; j < len; i++, j++) {
        first[i] = second[j];
      }

      first.length = i;
      return first;
    },

    each,
    matches,
    unique,
    isArray: Array.isArray,
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

  });

  const uid = cash.uid = `_cash${Date.now()}`;

  function getDataCache(node) {
    return (node[uid] = node[uid] || {});
  }

  function setData(node, key, value) {
    return (getDataCache(node)[key] = value);
  }

  function getData(node, key) {
    const c = getDataCache(node);
    if (c[key] === undefined) {
      c[key] = node.dataset ? node.dataset[key] : cash(node).attr(`data-${key}`);
    }
    return c[key];
  }

  function removeData(node, key) {
    const c = getDataCache(node);
    if (c) {
      delete c[key];
    } else if (node.dataset) {
      delete node.dataset[key];
    } else {
      cash(node).removeAttr(`data-${name}`);
    }
  }

  fn.extend({
    data(name, value) {
      if (isString(name)) {
        return (value === undefined ? getData(this[0], name) : this.each((v) => setData(v, name, value)));
      }

      for (const key in name) {
        this.data(key, name[key]);
      }

      return this;
    },

    removeData(key) {
      return this.each((v) => removeData(v, key));
    },

  });

  const notWhiteMatch = /\S+/g;

  function getClasses(c) {
    return isString(c) && c.match(notWhiteMatch);
  }

  function hasClass(v, c) {
    return (v.classList ? v.classList.contains(c) : new RegExp(`(^| )${c}( |$)`, 'gi').test(v.className));
  }

  function addClass(v, c, spacedName) {
    if (v.classList) {
      v.classList.add(c);
    } else if (spacedName.indexOf(` ${c} `)) {
      v.className += ` ${c}`;
    }
  }

  function removeClass(v, c) {
    if (v.classList) {
      v.classList.remove(c);
    } else {
      v.className = v.className.replace(c, '');
    }
  }

  fn.extend({
    addClass(c) {
      const classes = getClasses(c);

      return (classes ? this.each((v) => {
        const spacedName = ` ${v.className} `;
        each(classes, (c) => {
          addClass(v, c, spacedName);
        });
      }) : this);
    },

    attr(name, value) {
      if (!name) {
        return undefined;
      }

      if (isString(name)) {
        if (value === undefined) {
          return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
        }

        return this.each((v) => {
          if (v.setAttribute) {
            v.setAttribute(name, value);
          } else {
            v[name] = value;
          }
        });
      }

      for (const key in name) {
        this.attr(key, name[key]);
      }

      return this;
    },

    hasClass(c) {
      let check = false; const
        classes = getClasses(c);
      if (classes && classes.length) {
        this.each((v) => {
          check = hasClass(v, classes[0]);
          return !check;
        });
      }
      return check;
    },

    prop(name, value) {
      if (isString(name)) {
        return (value === undefined ? this[0][name] : this.each((v) => {
          v[name] = value;
        }));
      }

      for (const key in name) {
        this.prop(key, name[key]);
      }

      return this;
    },

    removeAttr(name) {
      return this.each((v) => {
        if (v.removeAttribute) {
          v.removeAttribute(name);
        } else {
          delete v[name];
        }
      });
    },

    removeClass(c) {
      if (!arguments.length) {
        return this.attr('class', '');
      }
      const classes = getClasses(c);
      return (classes ? this.each((v) => {
        each(classes, (c) => {
          removeClass(v, c);
        });
      }) : this);
    },

    removeProp(name) {
      return this.each((v) => {
        delete v[name];
      });
    },

    toggleClass(c, state) {
      if (state !== undefined) {
        return this[state ? 'addClass' : 'removeClass'](c);
      }
      const classes = getClasses(c);
      return (classes ? this.each((v) => {
        const spacedName = ` ${v.className} `;
        each(classes, (c) => {
          if (hasClass(v, c)) {
            removeClass(v, c);
          } else {
            addClass(v, c, spacedName);
          }
        });
      }) : this);
    },
  });

  fn.extend({
    add(selector, context) {
      return unique(cash.merge(this, cash(selector, context)));
    },

    each(callback) {
      each(this, callback);
      return this;
    },

    eq(index) {
      return cash(this.get(index));
    },

    filter(selector) {
      if (!selector) {
        return this;
      }

      const comparator = (isFunction(selector) ? selector : getCompareFunction(selector));

      return cash(filter.call(this, (e) => comparator(e, selector)));
    },

    first() {
      return this.eq(0);
    },

    get(index) {
      if (index === undefined) {
        return slice.call(this);
      }
      return (index < 0 ? this[index + this.length] : this[index]);
    },

    index(elem) {
      const child = elem ? cash(elem)[0] : this[0]; const
        collection = elem ? this : cash(child).parent().children();
      return slice.call(collection).indexOf(child);
    },

    last() {
      return this.eq(-1);
    },

  });

  const camelCase = (function () {
    const camelRegex = /(?:^\w|[A-Z]|\b\w)/g; const
      whiteSpace = /[\s-_]+/g;
    return function (str) {
      return str.replace(camelRegex, (letter, index) => letter[index === 0 ? 'toLowerCase' : 'toUpperCase']()).replace(whiteSpace, '');
    };
  }());

  const getPrefixedProp = (function () {
    const cache = {}; const doc = document; const div = doc.createElement('div'); const
      { style } = div;

    return function (prop) {
      prop = camelCase(prop);
      if (cache[prop]) {
        return cache[prop];
      }

      const ucProp = prop.charAt(0).toUpperCase() + prop.slice(1); const prefixes = ['webkit', 'moz', 'ms', 'o']; const
        props = (`${prop} ${(prefixes).join(`${ucProp} `)}${ucProp}`).split(' ');

      each(props, (p) => {
        if (p in style) {
          cache[p] = prop = cache[prop] = p;
          return false;
        }
      });

      return cache[prop];
    };
  }());

  cash.prefixedProp = getPrefixedProp;
  cash.camelCase = camelCase;

  fn.extend({
    css(prop, value) {
      if (isString(prop)) {
        prop = getPrefixedProp(prop);
        return (arguments.length > 1 ? this.each((v) => v.style[prop] = value) : win.getComputedStyle(this[0])[prop]);
      }

      for (const key in prop) {
        this.css(key, prop[key]);
      }

      return this;
    },

  });

  function compute(el, prop) {
    return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
  }

  each(['Width', 'Height'], (v) => {
    const lower = v.toLowerCase();

    fn[lower] = function () {
      return this[0].getBoundingClientRect()[lower];
    };

    fn[`inner${v}`] = function () {
      return this[0][`client${v}`];
    };

    fn[`outer${v}`] = function (margins) {
      return this[0][`offset${v}`] + (margins ? compute(this, `margin${v === 'Width' ? 'Left' : 'Top'}`) + compute(this, `margin${v === 'Width' ? 'Right' : 'Bottom'}`) : 0);
    };
  });

  function registerEvent(node, eventName, callback) {
    const eventCache = getData(node, '_cashEvents') || setData(node, '_cashEvents', {});
    eventCache[eventName] = eventCache[eventName] || [];
    eventCache[eventName].push(callback);
    node.addEventListener(eventName, callback);
  }

  function removeEvent(node, eventName, callback) {
    const events = getData(node, '_cashEvents'); let eventCache = (events && events[eventName]); let
      index;

    if (!eventCache) {
      return;
    }

    if (callback) {
      node.removeEventListener(eventName, callback);
      index = eventCache.indexOf(callback);
      if (index >= 0) {
        eventCache.splice(index, 1);
      }
    } else {
      each(eventCache, (event) => {
        node.removeEventListener(eventName, event);
      });
      eventCache = [];
    }
  }

  fn.extend({
    off(eventName, callback) {
      return this.each((v) => removeEvent(v, eventName, callback));
    },

    on(eventName, delegate, callback, runOnce) {
      // jshint ignore:line
      let originalCallback;
      if (!isString(eventName)) {
        for (const key in eventName) {
          this.on(key, delegate, eventName[key]);
        }
        return this;
      }

      if (isFunction(delegate)) {
        callback = delegate;
        delegate = null;
      }

      if (eventName === 'ready') {
        onReady(callback);
        return this;
      }

      if (delegate) {
        originalCallback = callback;
        callback = function (e) {
          let t = e.target;
          while (!matches(t, delegate)) {
            if (t === this || t === null) {
              return (t = false);
            }

            t = t.parentNode;
          }

          if (t) {
            originalCallback.call(t, e);
          }
        };
      }

      return this.each((v) => {
        let finalCallback = callback;
        if (runOnce) {
          finalCallback = function () {
            callback.apply(this, arguments);
            removeEvent(v, eventName, finalCallback);
          };
        }
        registerEvent(v, eventName, finalCallback);
      });
    },

    one(eventName, delegate, callback) {
      return this.on(eventName, delegate, callback, true);
    },

    ready: onReady,

    /**
     * Modified
     * Triggers browser event
     * @param String eventName
     * @param Object data - Add properties to event object
     */
    trigger(eventName, data) {
      if (document.createEvent) {
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, false);
        evt = this.extend(evt, data);
        return this.each((v) => v.dispatchEvent(evt));
      }
    },

  });

  function encode(name, value) {
    return `&${encodeURIComponent(name)}=${encodeURIComponent(value).replace(/%20/g, '+')}`;
  }

  function getSelectMultiple_(el) {
    const values = [];
    each(el.options, (o) => {
      if (o.selected) {
        values.push(o.value);
      }
    });
    return values.length ? values : null;
  }

  function getSelectSingle_(el) {
    const { selectedIndex } = el;
    return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
  }

  function getValue(el) {
    const { type } = el;
    if (!type) {
      return null;
    }
    switch (type.toLowerCase()) {
      case 'select-one':
        return getSelectSingle_(el);
      case 'select-multiple':
        return getSelectMultiple_(el);
      case 'radio':
        return (el.checked) ? el.value : null;
      case 'checkbox':
        return (el.checked) ? el.value : null;
      default:
        return el.value ? el.value : null;
    }
  }

  fn.extend({
    serialize() {
      let query = '';

      each(this[0].elements || this, (el) => {
        if (el.disabled || el.tagName === 'FIELDSET') {
          return;
        }
        const { name } = el;
        switch (el.type.toLowerCase()) {
          case 'file':
          case 'reset':
          case 'submit':
          case 'button':
            break;
          case 'select-multiple':
            var values = getValue(el);
            if (values !== null) {
              each(values, (value) => {
                query += encode(name, value);
              });
            }
            break;
          default:
            var value = getValue(el);
            if (value !== null) {
              query += encode(name, value);
            }
        }
      });

      return query.substr(1);
    },

    val(value) {
      if (value === undefined) {
        return getValue(this[0]);
      }

      return this.each((v) => v.value = value);
    },

  });

  function insertElement(el, child, prepend) {
    if (prepend) {
      const first = el.childNodes[0];
      el.insertBefore(child, first);
    } else {
      el.appendChild(child);
    }
  }

  function insertContent(parent, child, prepend) {
    const str = isString(child);

    if (!str && child.length) {
      each(child, (v) => insertContent(parent, v, prepend));
      return;
    }

    each(parent, str ? (v) => v.insertAdjacentHTML(prepend ? 'afterbegin' : 'beforeend', child) : (v, i) => insertElement(v, (i === 0 ? child : child.cloneNode(true)), prepend));
  }

  fn.extend({
    after(selector) {
      cash(selector).insertAfter(this);
      return this;
    },

    append(content) {
      insertContent(this, content);
      return this;
    },

    appendTo(parent) {
      insertContent(cash(parent), this);
      return this;
    },

    before(selector) {
      cash(selector).insertBefore(this);
      return this;
    },

    clone() {
      return cash(this.map((v) => v.cloneNode(true)));
    },

    empty() {
      this.html('');
      return this;
    },

    html(content) {
      if (content === undefined) {
        return this[0].innerHTML;
      }
      const source = (content.nodeType ? content[0].outerHTML : content);
      return this.each((v) => v.innerHTML = source);
    },

    insertAfter(selector) {
      const _this = this;


      cash(selector).each((el, i) => {
        const parent = el.parentNode; const
          sibling = el.nextSibling;
        _this.each((v) => {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), sibling);
        });
      });

      return this;
    },

    insertBefore(selector) {
      const _this2 = this;
      cash(selector).each((el, i) => {
        const parent = el.parentNode;
        _this2.each((v) => {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), el);
        });
      });
      return this;
    },

    prepend(content) {
      insertContent(this, content, true);
      return this;
    },

    prependTo(parent) {
      insertContent(cash(parent), this, true);
      return this;
    },

    remove() {
      return this.each((v) => {
        if (v.parentNode) {
          return v.parentNode.removeChild(v);
        }
      });
    },

    text(content) {
      if (content === undefined) {
        return this[0].textContent;
      }
      return this.each((v) => v.textContent = content);
    },

  });

  const docEl = doc.documentElement;

  fn.extend({
    position() {
      const el = this[0];
      return {
        left: el.offsetLeft,
        top: el.offsetTop,
      };
    },

    offset() {
      const rect = this[0].getBoundingClientRect();
      return {
        top: rect.top + win.pageYOffset - docEl.clientTop,
        left: rect.left + win.pageXOffset - docEl.clientLeft,
      };
    },

    offsetParent() {
      return cash(this[0].offsetParent);
    },

  });

  fn.extend({
    children(selector) {
      let elems = [];
      this.each((el) => {
        push.apply(elems, el.children);
      });
      elems = unique(elems);

      return (!selector ? elems : elems.filter((v) => matches(v, selector)));
    },

    closest(selector) {
      if (!selector || this.length < 1) {
        return cash();
      }
      if (this.is(selector)) {
        return this.filter(selector);
      }
      return this.parent().closest(selector);
    },

    is(selector) {
      if (!selector) {
        return false;
      }

      let match = false; const
        comparator = getCompareFunction(selector);

      this.each((el) => {
        match = comparator(el, selector);
        return !match;
      });

      return match;
    },

    find(selector) {
      if (!selector || selector.nodeType) {
        return cash(selector && this.has(selector).length ? selector : null);
      }

      const elems = [];
      this.each((el) => {
        push.apply(elems, find(selector, el));
      });

      return unique(elems);
    },

    has(selector) {
      const comparator = (isString(selector) ? function (el) {
        return find(selector, el).length !== 0;
      } : function (el) {
        return el.contains(selector);
      });

      return this.filter(comparator);
    },

    next() {
      return cash(this[0].nextElementSibling);
    },

    not(selector) {
      if (!selector) {
        return this;
      }

      const comparator = getCompareFunction(selector);

      return this.filter((el) => !comparator(el, selector));
    },

    parent() {
      const result = [];

      this.each((item) => {
        if (item && item.parentNode) {
          result.push(item.parentNode);
        }
      });

      return unique(result);
    },

    parents(selector) {
      let last; const
        result = [];

      this.each((item) => {
        last = item;

        while (last && last.parentNode && last !== doc.body.parentNode) {
          last = last.parentNode;

          if (!selector || (selector && matches(last, selector))) {
            result.push(last);
          }
        }
      });

      return unique(result);
    },

    prev() {
      return cash(this[0].previousElementSibling);
    },

    siblings(selector) {
      const collection = this.parent().children(selector); const
        el = this[0];

      return collection.filter((i) => i !== el);
    },

  });


  return cash;
}));
