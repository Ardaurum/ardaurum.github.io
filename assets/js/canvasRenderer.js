import * as PIXI from '../vendor/pixi.min.js'
import { canvasScripts } from './canvasScripts.js'
import { Event } from './core/events.js'

var CanvasRenderer = {
  gfxContexts: [],

  init: function () {
    const views = document.getElementsByClassName("canvas-view");

    for (const view of views) {
      let gfxContext = {};
      gfxContext.view = view;
      gfxContext.app = new PIXI.Application({
        antialias: true,
        resizeTo: view,
        backgroundColor: 0x1D1F1D,
        resolution: 1
      });
			gfxContext.app.onResize = new Event();
			var _appResize = gfxContext.app.resize;
			gfxContext.app.resize = function(width, height) {
				_appResize(width, height);
				this.onResize.dispatch(width, height);
			}

      gfxContext.scriptSrc = view.getAttribute("script-src-id");

      gfxContext.data = {};
      gfxContext.data.screen = gfxContext.app.screen;

      canvasScripts.get(gfxContext.scriptSrc).init(gfxContext.app);

      gfxContext.app.ticker.add((dt) => {
        canvasScripts.get(gfxContext.scriptSrc).render(gfxContext.app, dt);
      });

      this.gfxContexts.push(gfxContext);
      view.appendChild(gfxContext.app.view);
    }
  }
}

CanvasRenderer.init();