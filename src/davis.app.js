Davis.App = (function () {
  var klass = function () {
    this.foo = "bar"
    this.running = false;
  };

  klass.prototype = $.extend({

    configure: function (config) {
      config.call(this.settings);
    },

    settings: {
      linkSelector: 'a',
      formSelector: 'form',
      logger: Davis.logger
    },

    start: function () {
      var self = this;

      this
        .bind('runRoute', function (request) {
          self.settings.logger.info("runRoute: " + request.toString());
        })
        .bind('routeNotFound', function (request) {
          self.settings.logger.warn("routeNotFound: " + request.toString());
        })
        .bind('start', function () {
          self.settings.logger.info("application started")
        });

      this.listen();
      this.trigger('start')

      Davis.history.onChange(function (request) {
        self.trigger('lookupRoute', request);
        var route = Davis.Route.lookup(request.method, request.path);
        if (route) {
          self.trigger('runRoute', request);
          route.run(request);
        } else {
          self.trigger('routeNotFound', request);
        }
      })
      this.running = true;
    },

    stop: function () {
      this.unlisten();
      this.bind('stop')
    }
  }, Davis.listener, Davis.event);

  return klass;
})()