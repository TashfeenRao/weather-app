(function ($) {
  const _defaults = {
    onOpen: undefined,
    onClose: undefined,
  };

  /**
   * @class
   *
   */
  class TapTarget extends Component {
    /**
     * Construct TapTarget instance
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options) {
      super(TapTarget, el, options);

      this.el.M_TapTarget = this;

      /**
       * Options for the select
       * @member TapTarget#options
       * @prop {Function} onOpen - Callback function called when feature discovery is opened
       * @prop {Function} onClose - Callback function called when feature discovery is closed
       */
      this.options = $.extend({}, TapTarget.defaults, options);

      this.isOpen = false;

      // setup
      this.$origin = $(`#${this.$el.attr('data-target')}`);
      this._setup();

      this._calculatePositioning();
      this._setupEventHandlers();
    }

    static get defaults() {
      return _defaults;
    }

    static init(els, options) {
      return super.init(this, els, options);
    }

    /**
     * Get Instance
     */
    static getInstance(el) {
      const domElem = el.jquery ? el[0] : el;
      return domElem.M_TapTarget;
    }

    /**
     * Teardown component
     */
    destroy() {
      this._removeEventHandlers();
      this.el.TapTarget = undefined;
    }

    /**
     * Setup Event Handlers
     */
    _setupEventHandlers() {
      this._handleDocumentClickBound = this._handleDocumentClick.bind(this);
      this._handleTargetClickBound = this._handleTargetClick.bind(this);
      this._handleOriginClickBound = this._handleOriginClick.bind(this);

      this.el.addEventListener('click', this._handleTargetClickBound);
      this.originEl.addEventListener('click', this._handleOriginClickBound);

      // Resize
      const throttledResize = M.throttle(this._handleResize, 200);
      this._handleThrottledResizeBound = throttledResize.bind(this);

      window.addEventListener('resize', this._handleThrottledResizeBound);
    }

    /**
     * Remove Event Handlers
     */
    _removeEventHandlers() {
      this.el.removeEventListener('click', this._handleTargetClickBound);
      this.originEl.removeEventListener('click', this._handleOriginClickBound);
      window.removeEventListener('resize', this._handleThrottledResizeBound);
    }

    /**
     * Handle Target Click
     * @param {Event} e
     */
    _handleTargetClick(e) {
      this.open();
    }

    /**
     * Handle Origin Click
     * @param {Event} e
     */
    _handleOriginClick(e) {
      this.close();
    }

    /**
     * Handle Resize
     * @param {Event} e
     */
    _handleResize(e) {
      this._calculatePositioning();
    }

    /**
     * Handle Resize
     * @param {Event} e
     */
    _handleDocumentClick(e) {
      if (!$(e.target).closest('.tap-target-wrapper').length) {
        this.close();
        e.preventDefault();
        e.stopPropagation();
      }
    }

    /**
     * Setup Tap Target
     */
    _setup() {
      // Creating tap target
      this.wrapper = this.$el.parent()[0];
      this.waveEl = $(this.wrapper).find('.tap-target-wave')[0];
      this.originEl = $(this.wrapper).find('.tap-target-origin')[0];
      this.contentEl = this.$el.find('.tap-target-content')[0];

      // Creating wrapper
      if (!$(this.wrapper).hasClass('.tap-target-wrapper')) {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('tap-target-wrapper');
        this.$el.before($(this.wrapper));
        this.wrapper.append(this.el);
      }

      // Creating content
      if (!this.contentEl) {
        this.contentEl = document.createElement('div');
        this.contentEl.classList.add('tap-target-content');
        this.$el.append(this.contentEl);
      }

      // Creating foreground wave
      if (!this.waveEl) {
        this.waveEl = document.createElement('div');
        this.waveEl.classList.add('tap-target-wave');

        // Creating origin
        if (!this.originEl) {
          this.originEl = this.$origin.clone(true, true);
          this.originEl.addClass('tap-target-origin');
          this.originEl.removeAttr('id');
          this.originEl.removeAttr('style');
          this.originEl = this.originEl[0];
          this.waveEl.append(this.originEl);
        }

        this.wrapper.append(this.waveEl);
      }
    }

    /**
     * Calculate positioning
     */
    _calculatePositioning() {
      // Element or parent is fixed position?
      let isFixed = this.$origin.css('position') === 'fixed';
      if (!isFixed) {
        const parents = this.$origin.parents();
        for (let i = 0; i < parents.length; i++) {
          isFixed = $(parents[i]).css('position') == 'fixed';
          if (isFixed) {
            break;
          }
        }
      }

      // Calculating origin
      const originWidth = this.$origin.outerWidth();
      const originHeight = this.$origin.outerHeight();
      const originTop = isFixed
        ? this.$origin.offset().top - M.getDocumentScrollTop()
        : this.$origin.offset().top;
      const originLeft = isFixed
        ? this.$origin.offset().left - M.getDocumentScrollLeft()
        : this.$origin.offset().left;

      // Calculating screen
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const isLeft = originLeft <= centerX;
      const isRight = originLeft > centerX;
      const isTop = originTop <= centerY;
      const isBottom = originTop > centerY;
      const isCenterX = originLeft >= windowWidth * 0.25 && originLeft <= windowWidth * 0.75;

      // Calculating tap target
      const tapTargetWidth = this.$el.outerWidth();
      const tapTargetHeight = this.$el.outerHeight();
      const tapTargetTop = originTop + originHeight / 2 - tapTargetHeight / 2;
      const tapTargetLeft = originLeft + originWidth / 2 - tapTargetWidth / 2;
      const tapTargetPosition = isFixed ? 'fixed' : 'absolute';

      // Calculating content
      const tapTargetTextWidth = isCenterX ? tapTargetWidth : tapTargetWidth / 2 + originWidth;
      const tapTargetTextHeight = tapTargetHeight / 2;
      const tapTargetTextTop = isTop ? tapTargetHeight / 2 : 0;
      const tapTargetTextBottom = 0;
      const tapTargetTextLeft = isLeft && !isCenterX ? tapTargetWidth / 2 - originWidth : 0;
      const tapTargetTextRight = 0;
      const tapTargetTextPadding = originWidth;
      const tapTargetTextAlign = isBottom ? 'bottom' : 'top';

      // Calculating wave
      const tapTargetWaveWidth = originWidth > originHeight ? originWidth * 2 : originWidth * 2;
      const tapTargetWaveHeight = tapTargetWaveWidth;
      const tapTargetWaveTop = tapTargetHeight / 2 - tapTargetWaveHeight / 2;
      const tapTargetWaveLeft = tapTargetWidth / 2 - tapTargetWaveWidth / 2;

      // Setting tap target
      const tapTargetWrapperCssObj = {};
      tapTargetWrapperCssObj.top = isTop ? `${tapTargetTop}px` : '';
      tapTargetWrapperCssObj.right = isRight
        ? `${windowWidth - tapTargetLeft - tapTargetWidth}px`
        : '';
      tapTargetWrapperCssObj.bottom = isBottom
        ? `${windowHeight - tapTargetTop - tapTargetHeight}px`
        : '';
      tapTargetWrapperCssObj.left = isLeft ? `${tapTargetLeft}px` : '';
      tapTargetWrapperCssObj.position = tapTargetPosition;
      $(this.wrapper).css(tapTargetWrapperCssObj);

      // Setting content
      $(this.contentEl).css({
        width: `${tapTargetTextWidth}px`,
        height: `${tapTargetTextHeight}px`,
        top: `${tapTargetTextTop}px`,
        right: `${tapTargetTextRight}px`,
        bottom: `${tapTargetTextBottom}px`,
        left: `${tapTargetTextLeft}px`,
        padding: `${tapTargetTextPadding}px`,
        verticalAlign: tapTargetTextAlign,
      });

      // Setting wave
      $(this.waveEl).css({
        top: `${tapTargetWaveTop}px`,
        left: `${tapTargetWaveLeft}px`,
        width: `${tapTargetWaveWidth}px`,
        height: `${tapTargetWaveHeight}px`,
      });
    }

    /**
     * Open TapTarget
     */
    open() {
      if (this.isOpen) {
        return;
      }

      // onOpen callback
      if (typeof this.options.onOpen === 'function') {
        this.options.onOpen.call(this, this.$origin[0]);
      }

      this.isOpen = true;
      this.wrapper.classList.add('open');

      document.body.addEventListener('click', this._handleDocumentClickBound, true);
      document.body.addEventListener('touchend', this._handleDocumentClickBound);
    }

    /**
     * Close Tap Target
     */
    close() {
      if (!this.isOpen) {
        return;
      }

      // onClose callback
      if (typeof this.options.onClose === 'function') {
        this.options.onClose.call(this, this.$origin[0]);
      }

      this.isOpen = false;
      this.wrapper.classList.remove('open');

      document.body.removeEventListener('click', this._handleDocumentClickBound, true);
      document.body.removeEventListener('touchend', this._handleDocumentClickBound);
    }
  }

  M.TapTarget = TapTarget;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(TapTarget, 'tapTarget', 'M_TapTarget');
  }
}(cash));
