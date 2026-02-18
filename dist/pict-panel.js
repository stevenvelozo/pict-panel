"use strict";

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.PictPanel = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      module.exports = {
        "name": "fable-serviceproviderbase",
        "version": "3.0.18",
        "description": "Simple base classes for fable services.",
        "main": "source/Fable-ServiceProviderBase.js",
        "scripts": {
          "start": "node source/Fable-ServiceProviderBase.js",
          "test": "npx mocha -u tdd -R spec",
          "tests": "npx mocha -u tdd --exit -R spec --grep",
          "coverage": "npx nyc --reporter=lcov --reporter=text-lcov npx mocha -- -u tdd -R spec",
          "build": "npx quack build",
          "types": "tsc -p ./tsconfig.build.json",
          "check": "tsc -p . --noEmit"
        },
        "types": "types/source/Fable-ServiceProviderBase.d.ts",
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase.git"
        },
        "keywords": ["entity", "behavior"],
        "author": "Steven Velozo <steven@velozo.com> (http://velozo.com/)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/fable-serviceproviderbase/issues"
        },
        "homepage": "https://github.com/stevenvelozo/fable-serviceproviderbase",
        "devDependencies": {
          "@types/mocha": "^10.0.10",
          "fable": "^3.1.55",
          "quackage": "^1.0.51",
          "typescript": "^5.9.3"
        }
      };
    }, {}],
    2: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @author <steven@velozo.com>
      */

      const libPackage = require('../package.json');
      class FableServiceProviderBase {
        /**
         * The constructor can be used in two ways:
         * 1) With a fable, options object and service hash (the options object and service hash are optional)a
         * 2) With an object or nothing as the first parameter, where it will be treated as the options object
         *
         * @param {import('fable')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
         * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
         * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
         */
        constructor(pFable, pOptions, pServiceHash) {
          /** @type {import('fable')} */
          this.fable;
          /** @type {string} */
          this.UUID;
          /** @type {Record<string, any>} */
          this.options;
          /** @type {Record<string, any>} */
          this.services;
          /** @type {Record<string, any>} */
          this.servicesMap;

          // Check if a fable was passed in; connect it if so
          if (typeof pFable === 'object' && pFable.isFable) {
            this.connectFable(pFable);
          } else {
            this.fable = false;
          }

          // Initialize the services map if it wasn't passed in
          /** @type {Record<string, any>} */
          this._PackageFableServiceProvider = libPackage;

          // initialize options and UUID based on whether the fable was passed in or not.
          if (this.fable) {
            this.UUID = pFable.getUUID();
            this.options = typeof pOptions === 'object' ? pOptions : {};
          } else {
            // With no fable, check to see if there was an object passed into either of the first two
            // Parameters, and if so, treat it as the options object
            this.options = typeof pFable === 'object' && !pFable.isFable ? pFable : typeof pOptions === 'object' ? pOptions : {};
            this.UUID = "CORE-SVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
          }

          // It's expected that the deriving class will set this
          this.serviceType = "Unknown-".concat(this.UUID);

          // The service hash is used to identify the specific instantiation of the service in the services map
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : !this.fable && typeof pOptions === 'string' ? pOptions : "".concat(this.UUID);
        }

        /**
         * @param {import('fable')} pFable
         */
        connectFable(pFable) {
          if (typeof pFable !== 'object' || !pFable.isFable) {
            let tmpErrorMessage = "Fable Service Provider Base: Cannot connect to Fable, invalid Fable object passed in.  The pFable parameter was a [".concat(typeof pFable, "].}");
            console.log(tmpErrorMessage);
            return new Error(tmpErrorMessage);
          }
          if (!this.fable) {
            this.fable = pFable;
          }
          if (!this.log) {
            this.log = this.fable.Logging;
          }
          if (!this.services) {
            this.services = this.fable.services;
          }
          if (!this.servicesMap) {
            this.servicesMap = this.fable.servicesMap;
          }
          return true;
        }
      }
      _defineProperty(FableServiceProviderBase, "isFableService", true);
      module.exports = FableServiceProviderBase;

      // This is left here in case we want to go back to having different code/base class for "core" services
      module.exports.CoreServiceProviderBase = FableServiceProviderBase;
    }, {
      "../package.json": 1
    }],
    3: [function (require, module, exports) {
      module.exports = {
        "name": "pict-provider",
        "version": "1.0.10",
        "description": "Pict Provider Base Class",
        "main": "source/Pict-Provider.js",
        "scripts": {
          "start": "node source/Pict-Provider.js",
          "test": "npx mocha -u tdd -R spec",
          "tests": "npx mocha -u tdd --exit -R spec --grep",
          "coverage": "npx nyc --reporter=lcov --reporter=text-lcov npx mocha -- -u tdd -R spec",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-provider-image:local",
          "docker-dev-run": "docker run -it -d --name pict-provider-dev -p 24125:8080 -p 30027:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-provider\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-provider-image:local",
          "docker-dev-shell": "docker exec -it pict-provider-dev /bin/bash",
          "lint": "eslint source/**",
          "types": "tsc -p ."
        },
        "types": "types/source/Pict-Provider.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-provider.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-provider/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-provider#readme",
        "devDependencies": {
          "@eslint/js": "^9.39.1",
          "eslint": "^9.39.1",
          "pict": "^1.0.348",
          "quackage": "^1.0.51",
          "typescript": "^5.9.3"
        },
        "dependencies": {
          "fable-serviceproviderbase": "^3.0.18"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        }
      };
    }, {}],
    4: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictProviderSettings = {
        ProviderIdentifier: false,
        // If this is set to true, when the App initializes this will.
        // After the App initializes, initialize will be called as soon as it's added.
        AutoInitialize: true,
        AutoInitializeOrdinal: 0,
        AutoLoadDataWithApp: true,
        AutoSolveWithApp: true,
        AutoSolveOrdinal: 0,
        Manifests: {},
        Templates: []
      };
      class PictProvider extends libFableServiceBase {
        /**
         * @param {import('fable')} pFable - The Fable instance.
         * @param {Record<string, any>} [pOptions] - The options for the provider.
         * @param {string} [pServiceHash] - The service hash for the provider.
         */
        constructor(pFable, pOptions, pServiceHash) {
          // Intersect default options, parent constructor, service information
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictProviderSettings)), pOptions);
          super(pFable, tmpOptions, pServiceHash);

          /** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */
          this.fable;
          /** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */
          this.pict;
          /** @type {any} */
          this.log;
          /** @type {Record<string, any>} */
          this.options;
          /** @type {string} */
          this.UUID;
          /** @type {string} */
          this.Hash;
          if (!this.options.ProviderIdentifier) {
            this.options.ProviderIdentifier = "AutoProviderID-".concat(this.fable.getUUID());
          }
          this.serviceType = 'PictProvider';
          /** @type {Record<string, any>} */
          this._Package = libPackage;

          // Convenience and consistency naming
          this.pict = this.fable;

          // Wire in the essential Pict application state
          /** @type {Record<string, any>} */
          this.AppData = this.pict.AppData;
          /** @type {Record<string, any>} */
          this.Bundle = this.pict.Bundle;
          this.initializeTimestamp = false;
          this.lastSolvedTimestamp = false;
          for (let i = 0; i < this.options.Templates.length; i++) {
            let tmpDefaultTemplate = this.options.Templates[i];
            if (!tmpDefaultTemplate.hasOwnProperty('Postfix') || !tmpDefaultTemplate.hasOwnProperty('Template')) {
              this.log.error("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " could not load Default Template ").concat(i, " in the options array."), tmpDefaultTemplate);
            } else {
              if (!tmpDefaultTemplate.Source) {
                tmpDefaultTemplate.Source = "PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix, tmpDefaultTemplate.Postfix, tmpDefaultTemplate.Template, tmpDefaultTemplate.Source);
            }
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                        Code Section: Initialization                        */
        /* -------------------------------------------------------------------------- */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onBeforeInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-pinitialization.
         *
         * @return {void}
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            this.onInitialize();
            this.onAfterInitialize();
            this.initializeTimestamp = this.pict.log.getTimeStamp();
            return true;
          } else {
            this.log.warn("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initializeAsync:"));
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 0) {
              this.log.info("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " beginning initialization..."));
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            tmpAnticipate.wait(pError => {
              this.initializeTimestamp = this.pict.log.getTimeStamp();
              if (pError) {
                this.log.error("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialization failed: ").concat(pError.message || pError), {
                  Stack: pError.stack
                });
              } else if (this.pict.LogNoisiness > 0) {
                this.log.info("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " initialization complete."));
              }
              return fCallback();
            });
          } else {
            this.log.warn("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return fCallback();
          }
        }
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onAfterInitialize:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
         *
         * @return {void}
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }
        onPreRender() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onPreRender:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-render.
         *
         * @return {void}
         */
        onPreRenderAsync(fCallback) {
          this.onPreRender();
          return fCallback();
        }
        render() {
          return this.onPreRender();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after render.
         *
         * @return {void}
         */
        renderAsync(fCallback) {
          this.onPreRender();
          return fCallback();
        }
        onPreSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onPreSolve:"));
          }
          return true;
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after pre-solve.
         *
         * @return {void}
         */
        onPreSolveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }
        solve() {
          return this.onPreSolve();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after solve.
         *
         * @return {void}
         */
        solveAsync(fCallback) {
          this.onPreSolve();
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
         */
        onBeforeLoadDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * Hook to allow the provider to load data during application data load.
         *
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
         */
        onLoadDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onLoadDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
         */
        onAfterLoadDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
         *
         * @return {void}
         */
        onBeforeSaveDataAsync(fCallback) {
          return fCallback();
        }

        /**
         * Hook to allow the provider to load data during application data load.
         *
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
         *
         * @return {void}
         */
        onSaveDataAsync(fCallback) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictProvider [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ProviderIdentifier, " onSaveDataAsync:"));
          }
          return fCallback();
        }

        /**
         * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
         *
         * @return {void}
         */
        onAfterSaveDataAsync(fCallback) {
          return fCallback();
        }
      }
      module.exports = PictProvider;
    }, {
      "../package.json": 3,
      "fable-serviceproviderbase": 2
    }],
    5: [function (require, module, exports) {
      module.exports = {
        "name": "pict-template",
        "version": "1.0.14",
        "description": "Pict Template Base Class",
        "main": "source/Pict-Template.js",
        "scripts": {
          "start": "node source/Pict-Template.js",
          "test": "npx mocha -u tdd -R spec",
          "tests": "npx mocha -u tdd --exit -R spec --grep",
          "coverage": "npx nyc --reporter=lcov --reporter=text-lcov npx mocha -- -u tdd -R spec",
          "build": "npx quack build",
          "types": "tsc -p ."
        },
        "types": "types/source/Pict-Template.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-view.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-view/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-view#readme",
        "devDependencies": {
          "pict": "^1.0.348",
          "quackage": "^1.0.51",
          "typescript": "^5.9.3"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "dependencies": {
          "fable-serviceproviderbase": "^3.0.18"
        }
      };
    }, {}],
    6: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');

      /** @typedef {import('pict') & {
       *     [key: string]: any, // represent services for now as a workaround
       * }} Pict */
      /**
       * @class PictTemplateExpression
       * @classdesc The PictTemplateExpression class is a service provider for the pict anti-framework that provides template rendering services.
       */
      class PictTemplateExpression extends libFableServiceBase {
        /**
         * @param {Pict} pFable - The Fable Framework instance
         * @param {Record<string, any>} [pOptions] - The options for the service
         * @param {string} [pServiceHash] - The hash of the service
         */
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);

          /** @type {Pict} */
          this.fable;

          /** @type {Pict} */
          this.pict = this.fable;
          this.serviceType = 'PictTemplate';
          /** @type {Record<string, any>} */
          this._Package = libPackage;
        }

        /**
         * Render a template expression, returning a string with the resulting content.
         *
         * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
         * @param {any} pRecord - The json object to be used as the Record for the template render
         * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
         * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
         * @param {any} [pState] - A catchall state object for plumbing data through template processing.
         *
         * @return {string} The rendered template
         */
        render(pTemplateHash, pRecord, pContextArray, pScope, pState) {
          return '';
        }

        /**
         * Render a template expression, deliver a string with the resulting content to a callback function.
         *
         * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
         * @param {any} pRecord - The json object to be used as the Record for the template render
         * @param {(error?: Error, content?: String) => void} fCallback - callback function invoked with the rendered template, or an error
         * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
         * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
         * @param {any} [pState] - A catchall state object for plumbing data through template processing.
         *
         * @return {void}
         */
        renderAsync(pTemplateHash, pRecord, fCallback, pContextArray, pScope, pState) {
          return fCallback(null, this.render(pTemplateHash, pRecord, pContextArray, pScope, pState));
        }

        /**
         * Provide a match criteria for a template expression.  Anything between these two values is returned as the template hash.
         *
         * @param {string} pMatchStart - The string pattern to start a match in the template trie
         * @param {string} pMatchEnd  - The string pattern to stop a match in the trie acyclic graph
         *
         * @return {void}
         */
        addPattern(pMatchStart, pMatchEnd) {
          return this.pict.MetaTemplate.addPatternBoth(pMatchStart, pMatchEnd, this.render, this.renderAsync, this);
        }

        /**
         * Read a value from a nested object using a dot notation string.
         *
         * @param {string} pAddress - The address to resolve
         * @param {Record<string, any>} pRecord - The record to resolve
         * @param {Array<any>} [pContextArray] - The context array to resolve (optional)
         * @param {Record<string, any>} [pRootDataObject] - The root data object to resolve (optional)
         * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
         * @param {any} [pState] - A catchall state object for plumbing data through template processing.
         *
         * @return {any} The value at the given address, or undefined
         */
        resolveStateFromAddress(pAddress, pRecord, pContextArray, pRootDataObject, pScope, pState) {
          return this.pict.resolveStateFromAddress(pAddress, pRecord, pContextArray, pRootDataObject, pScope, pState);
        }
      }
      module.exports = PictTemplateExpression;
      module.exports.template_hash = 'Default';
    }, {
      "../package.json": 5,
      "fable-serviceproviderbase": 2
    }],
    7: [function (require, module, exports) {
      module.exports = {
        "name": "pict-view",
        "version": "1.0.66",
        "description": "Pict View Base Class",
        "main": "source/Pict-View.js",
        "scripts": {
          "test": "mocha -u tdd -R spec",
          "tests": "mocha -u tdd -R spec -g",
          "start": "node source/Pict-View.js",
          "coverage": "nyc --reporter=lcov --reporter=text-lcov npm test",
          "build": "npx quack build",
          "docker-dev-build": "docker build ./ -f Dockerfile_LUXURYCode -t pict-view-image:local",
          "docker-dev-run": "docker run -it -d --name pict-view-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-view\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-view-image:local",
          "docker-dev-shell": "docker exec -it pict-view-dev /bin/bash",
          "types": "tsc -p .",
          "lint": "eslint source/**"
        },
        "types": "types/source/Pict-View.d.ts",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stevenvelozo/pict-view.git"
        },
        "author": "steven velozo <steven@velozo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/stevenvelozo/pict-view/issues"
        },
        "homepage": "https://github.com/stevenvelozo/pict-view#readme",
        "devDependencies": {
          "@eslint/js": "^9.39.1",
          "browser-env": "^3.3.0",
          "eslint": "^9.39.1",
          "pict": "^1.0.348",
          "quackage": "^1.0.51",
          "typescript": "^5.9.3"
        },
        "mocha": {
          "diff": true,
          "extension": ["js"],
          "package": "./package.json",
          "reporter": "spec",
          "slow": "75",
          "timeout": "5000",
          "ui": "tdd",
          "watch-files": ["source/**/*.js", "test/**/*.js"],
          "watch-ignore": ["lib/vendor"]
        },
        "dependencies": {
          "fable": "^3.1.57",
          "fable-serviceproviderbase": "^3.0.18"
        }
      };
    }, {}],
    8: [function (require, module, exports) {
      const libFableServiceBase = require('fable-serviceproviderbase');
      const libPackage = require('../package.json');
      const defaultPictViewSettings = {
        DefaultRenderable: false,
        DefaultDestinationAddress: false,
        DefaultTemplateRecordAddress: false,
        ViewIdentifier: false,
        // If this is set to true, when the App initializes this will.
        // After the App initializes, initialize will be called as soon as it's added.
        AutoInitialize: true,
        AutoInitializeOrdinal: 0,
        // If this is set to true, when the App autorenders (on load) this will.
        // After the App initializes, render will be called as soon as it's added.
        AutoRender: true,
        AutoRenderOrdinal: 0,
        AutoSolveWithApp: true,
        AutoSolveOrdinal: 0,
        CSSHash: false,
        CSS: false,
        CSSProvider: false,
        CSSPriority: 500,
        Templates: [],
        DefaultTemplates: [],
        Renderables: [],
        Manifests: {}
      };

      /** @typedef {(error?: Error) => void} ErrorCallback */
      /** @typedef {number | boolean} PictTimestamp */

      /**
       * @typedef {'replace' | 'append' | 'prepend' | 'append_once' | 'virtual-assignment'} RenderMethod
       */
      /**
       * @typedef {Object} Renderable
       *
       * @property {string} RenderableHash - A unique hash for the renderable.
       * @property {string} TemplateHash - The hash of the template to use for rendering this renderable.
       * @property {string} [DefaultTemplateRecordAddress] - The default address for resolving the data record for this renderable.
       * @property {string} [ContentDestinationAddress] - The default address (DOM CSS selector) for rendering the content of this renderable.
       * @property {RenderMethod} [RenderMethod=replace] - The method to use when projecting the renderable to the DOM ('replace', 'append', 'prepend', 'append_once', 'virtual-assignment').
       * @property {string} [TestAddress] - The address to use for testing the renderable.
       * @property {string} [TransactionHash] - The transaction hash for the root renderable.
       * @property {string} [RootRenderableViewHash] - The hash of the root renderable.
       * @property {string} [Content] - The rendered content for this renderable, if applicable.
       */

      /**
       * Represents a view in the Pict ecosystem.
       */
      class PictView extends libFableServiceBase {
        /**
         * @param {any} pFable - The Fable object that this service is attached to.
         * @param {any} [pOptions] - (optional) The options for this service.
         * @param {string} [pServiceHash] - (optional) The hash of the service.
         */
        constructor(pFable, pOptions, pServiceHash) {
          // Intersect default options, parent constructor, service information
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultPictViewSettings)), pOptions);
          super(pFable, tmpOptions, pServiceHash);
          //FIXME: add types to fable and ancillaries
          /** @type {any} */
          this.fable;
          /** @type {any} */
          this.options;
          /** @type {String} */
          this.UUID;
          /** @type {String} */
          this.Hash;
          /** @type {any} */
          this.log;
          const tmpHashIsUUID = this.Hash === this.UUID;
          //NOTE: since many places are using the view UUID as the HTML element ID, we prefix it to avoid starting with a number
          this.UUID = "V-".concat(this.UUID);
          if (tmpHashIsUUID) {
            this.Hash = this.UUID;
          }
          if (!this.options.ViewIdentifier) {
            this.options.ViewIdentifier = "AutoViewID-".concat(this.fable.getUUID());
          }
          this.serviceType = 'PictView';
          /** @type {Record<string, any>} */
          this._Package = libPackage;
          // Convenience and consistency naming
          /** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, instantiateServiceProviderIfNotExists: (hash: string) => any, TransactionTracking: import('pict/types/source/services/Fable-Service-TransactionTracking') }} */
          this.pict = this.fable;
          // Wire in the essential Pict application state
          this.AppData = this.pict.AppData;
          this.Bundle = this.pict.Bundle;

          /** @type {PictTimestamp} */
          this.initializeTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastSolvedTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastRenderedTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastMarshalFromViewTimestamp = false;
          /** @type {PictTimestamp} */
          this.lastMarshalToViewTimestamp = false;
          this.pict.instantiateServiceProviderIfNotExists('TransactionTracking');

          // Load all templates from the array in the options
          // Templates are in the form of {Hash:'Some-Template-Hash',Template:'Template content',Source:'TemplateSource'}
          for (let i = 0; i < this.options.Templates.length; i++) {
            let tmpTemplate = this.options.Templates[i];
            if (!('Hash' in tmpTemplate) || !('Template' in tmpTemplate)) {
              this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Template ").concat(i, " in the options array."), tmpTemplate);
            } else {
              if (!tmpTemplate.Source) {
                tmpTemplate.Source = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addTemplate(tmpTemplate.Hash, tmpTemplate.Template, tmpTemplate.Source);
            }
          }

          // Load all default templates from the array in the options
          // Templates are in the form of {Prefix:'',Postfix:'-List-Row',Template:'Template content',Source:'TemplateSourceString'}
          for (let i = 0; i < this.options.DefaultTemplates.length; i++) {
            let tmpDefaultTemplate = this.options.DefaultTemplates[i];
            if (!('Postfix' in tmpDefaultTemplate) || !('Template' in tmpDefaultTemplate)) {
              this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Default Template ").concat(i, " in the options array."), tmpDefaultTemplate);
            } else {
              if (!tmpDefaultTemplate.Source) {
                tmpDefaultTemplate.Source = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " options object.");
              }
              this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix, tmpDefaultTemplate.Postfix, tmpDefaultTemplate.Template, tmpDefaultTemplate.Source);
            }
          }

          // Load the CSS if it's available
          if (this.options.CSS) {
            let tmpCSSHash = this.options.CSSHash ? this.options.CSSHash : "View-".concat(this.options.ViewIdentifier);
            let tmpCSSProvider = this.options.CSSProvider ? this.options.CSSProvider : tmpCSSHash;
            this.pict.CSSMap.addCSS(tmpCSSHash, this.options.CSS, tmpCSSProvider, this.options.CSSPriority);
          }

          // Load all renderables
          // Renderables are launchable renderable instructions with templates
          // They look as such: {Identifier:'ContentEntry', TemplateHash:'Content-Entry-Section-Main', ContentDestinationAddress:'#ContentSection', RecordAddress:'AppData.Content.DefaultText', ManifestTransformation:'ManyfestHash', ManifestDestinationAddress:'AppData.Content.DataToTransformContent'}
          // The only parts that are necessary are Identifier and Template
          // A developer can then do render('ContentEntry') and it just kinda works.  Or they can override the ContentDestinationAddress
          /** @type {Record<String, Renderable>} */
          this.renderables = {};
          for (let i = 0; i < this.options.Renderables.length; i++) {
            /** @type {Renderable} */
            let tmpRenderable = this.options.Renderables[i];
            this.addRenderable(tmpRenderable);
          }
        }

        /**
         * Adds a renderable to the view.
         *
         * @param {string | Renderable} pRenderableHash - The hash of the renderable, or a renderable object.
         * @param {string} [pTemplateHash] - (optional) The hash of the template for the renderable.
         * @param {string} [pDefaultTemplateRecordAddress] - (optional) The default data address for the template.
         * @param {string} [pDefaultDestinationAddress] - (optional) The default destination address for the renderable.
         * @param {RenderMethod} [pRenderMethod=replace] - (optional) The method to use when rendering the renderable (ex. 'replace').
         */
        addRenderable(pRenderableHash, pTemplateHash, pDefaultTemplateRecordAddress, pDefaultDestinationAddress, pRenderMethod) {
          /** @type {Renderable} */
          let tmpRenderable;
          if (typeof pRenderableHash == 'object') {
            // The developer passed in the renderable as an object.
            // Use theirs instead!
            tmpRenderable = pRenderableHash;
          } else {
            /** @type {RenderMethod} */
            let tmpRenderMethod = typeof pRenderMethod !== 'string' ? pRenderMethod : 'replace';
            tmpRenderable = {
              RenderableHash: pRenderableHash,
              TemplateHash: pTemplateHash,
              DefaultTemplateRecordAddress: pDefaultTemplateRecordAddress,
              ContentDestinationAddress: pDefaultDestinationAddress,
              RenderMethod: tmpRenderMethod
            };
          }
          if (typeof tmpRenderable.RenderableHash != 'string' || typeof tmpRenderable.TemplateHash != 'string') {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not load Renderable; RenderableHash or TemplateHash are invalid."), tmpRenderable);
          } else {
            if (this.pict.LogNoisiness > 0) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " adding renderable [").concat(tmpRenderable.RenderableHash, "] pointed to template ").concat(tmpRenderable.TemplateHash, "."));
            }
            this.renderables[tmpRenderable.RenderableHash] = tmpRenderable;
          }
        }

        /* -------------------------------------------------------------------------- */
        /*                        Code Section: Initialization                        */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is initialized.
         */
        onBeforeInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeInitializeAsync(fCallback) {
          this.onBeforeInitialize();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when the view is initialized.
         */
        onInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onInitializeAsync(fCallback) {
          this.onInitialize();
          return fCallback();
        }

        /**
         * Performs view initialization.
         */
        initialize() {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialize:"));
          }
          if (!this.initializeTimestamp) {
            this.onBeforeInitialize();
            this.onInitialize();
            this.onAfterInitialize();
            this.initializeTimestamp = this.pict.log.getTimeStamp();
            return true;
          } else {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialize called but initialization is already completed.  Aborting."));
            return false;
          }
        }

        /**
         * Performs view initialization (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        initializeAsync(fCallback) {
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initializeAsync:"));
          }
          if (!this.initializeTimestamp) {
            let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');
            if (this.pict.LogNoisiness > 0) {
              this.log.info("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " beginning initialization..."));
            }
            tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));
            tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));
            tmpAnticipate.wait( /** @param {Error} pError */
            pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialization failed: ").concat(pError.message || pError), {
                  stack: pError.stack
                });
              }
              this.initializeTimestamp = this.pict.log.getTimeStamp();
              if (this.pict.LogNoisiness > 0) {
                this.log.info("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " initialization complete."));
              }
              return fCallback();
            });
          } else {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " async initialize called but initialization is already completed.  Aborting."));
            // TODO: Should this be an error?
            return fCallback();
          }
        }
        onAfterInitialize() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterInitialize:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is initialized (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterInitializeAsync(fCallback) {
          this.onAfterInitialize();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                            Code Section: Render                            */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is rendered.
         *
         * @param {Renderable} pRenderable - The renderable that will be rendered.
         */
        onBeforeRender(pRenderable) {
          // Overload this to mess with stuff before the content gets generated from the template
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeRender:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is rendered (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that will be rendered.
         */
        onBeforeRenderAsync(fCallback, pRenderable) {
          this.onBeforeRender(pRenderable);
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers before the view is projected into the DOM.
         *
         * @param {Renderable} pRenderable - The renderable that will be projected.
         */
        onBeforeProject(pRenderable) {
          // Overload this to mess with stuff before the content gets generated from the template
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeProject:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is projected into the DOM (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that will be projected.
         */
        onBeforeProjectAsync(fCallback, pRenderable) {
          this.onBeforeProject(pRenderable);
          return fCallback();
        }

        /**
         * Builds the render options for a renderable.
         *
         * For DRY purposes on the three flavors of render.
         *
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          let tmpRenderOptions = {
            Valid: true
          };
          tmpRenderOptions.RenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;
          if (!tmpRenderOptions.RenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not find a suitable RenderableHash ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable."));
            tmpRenderOptions.Valid = false;
          }
          tmpRenderOptions.Renderable = this.renderables[tmpRenderOptions.RenderableHash];
          if (!tmpRenderOptions.Renderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            tmpRenderOptions.Valid = false;
          }
          tmpRenderOptions.DestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderOptions.Renderable.ContentDestinationAddress === 'string' ? tmpRenderOptions.Renderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : false;
          if (!tmpRenderOptions.DestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderOptions.RenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address (param ").concat(pRenderDestinationAddress, ")."));
            tmpRenderOptions.Valid = false;
          }
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRenderOptions.RecordAddress = 'Passed in as object';
            tmpRenderOptions.Record = pTemplateRecordAddress;
          } else {
            tmpRenderOptions.RecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderOptions.Renderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderOptions.Renderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRenderOptions.Record = typeof tmpRenderOptions.RecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRenderOptions.RecordAddress) : undefined;
          }
          return tmpRenderOptions;
        }

        /**
         * Assigns the content to the destination address.
         *
         * For DRY purposes on the three flavors of render.
         *
         * @param {Renderable} pRenderable - The renderable to render.
         * @param {string} pRenderDestinationAddress - The address where the renderable will be rendered.
         * @param {string} pContent - The content to render.
         * @returns {boolean} - Returns true if the content was assigned successfully.
         * @memberof PictView
         */
        assignRenderContent(pRenderable, pRenderDestinationAddress, pContent) {
          return this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod, pRenderDestinationAddress, pContent, pRenderable.TestAddress);
        }

        /**
         * Render a renderable from this view.
         *
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @return {boolean}
         */
        render(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable) {
          return this.renderWithScope(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable);
        }

        /**
         * Render a renderable from this view, providing a specifici scope for the template.
         *
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @return {boolean}
         */
        renderWithScope(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable) {
          let tmpRenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;
          if (!tmpRenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it is not a valid renderable."));
            return false;
          }

          /** @type {Renderable} */
          let tmpRenderable;
          if (tmpRenderableHash == '__Virtual') {
            tmpRenderable = {
              RenderableHash: '__Virtual',
              TemplateHash: this.renderables[this.options.DefaultRenderable].TemplateHash,
              ContentDestinationAddress: typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null,
              RenderMethod: 'virtual-assignment',
              TransactionHash: pRootRenderable && pRootRenderable.TransactionHash,
              RootRenderableViewHash: pRootRenderable && pRootRenderable.RootRenderableViewHash
            };
          } else {
            tmpRenderable = Object.assign({}, this.renderables[tmpRenderableHash]);
            tmpRenderable.ContentDestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null;
          }
          if (!tmpRenderable.TransactionHash) {
            tmpRenderable.TransactionHash = "ViewRender-V-".concat(this.options.ViewIdentifier, "-R-").concat(tmpRenderableHash, "-U-").concat(this.pict.getUUID());
            tmpRenderable.RootRenderableViewHash = this.Hash;
            this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);
          }
          if (!tmpRenderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            return false;
          }
          if (!tmpRenderable.ContentDestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address."));
            return false;
          }
          let tmpRecordAddress;
          let tmpRecord;
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRecord = pTemplateRecordAddress;
            tmpRecordAddress = 'Passed in as object';
          } else {
            tmpRecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRecord = typeof tmpRecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRecordAddress) : undefined;
          }

          // Execute the developer-overridable pre-render behavior
          this.onBeforeRender(tmpRenderable);
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderable.ContentDestinationAddress, "] TemplateRecordAddress[").concat(tmpRecordAddress, "] render:"));
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Beginning Render of Renderable[").concat(tmpRenderableHash, "] to Destination [").concat(tmpRenderable.ContentDestinationAddress, "]..."));
          }
          // Generate the content output from the template and data
          tmpRenderable.Content = this.pict.parseTemplateByHash(tmpRenderable.TemplateHash, tmpRecord, null, [this], pScope, {
            RootRenderable: typeof pRootRenderable === 'object' ? pRootRenderable : tmpRenderable
          });
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Assigning Renderable[").concat(tmpRenderableHash, "] content length ").concat(tmpRenderable.Content.length, " to Destination [").concat(tmpRenderable.ContentDestinationAddress, "] using render method [").concat(tmpRenderable.RenderMethod, "]."));
          }
          this.onBeforeProject(tmpRenderable);
          this.onProject(tmpRenderable);
          if (tmpRenderable.RenderMethod !== 'virtual-assignment') {
            this.onAfterProject(tmpRenderable);

            // Execute the developer-overridable post-render behavior
            this.onAfterRender(tmpRenderable);
          }
          return true;
        }

        /**
         * Render a renderable from this view.
         *
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         *
         * @return {void}
         */
        renderAsync(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback) {
          return this.renderWithScopeAsync(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback);
        }

        /**
         * Render a renderable from this view.
         *
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
         * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         *
         * @return {void}
         */
        renderWithScopeAsync(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, pRootRenderable, fCallback) {
          let tmpRenderableHash = typeof pRenderableHash === 'string' ? pRenderableHash : typeof this.options.DefaultRenderable == 'string' ? this.options.DefaultRenderable : false;

          // Allow the callback to be passed in as the last parameter no matter what
          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateRecordAddress === 'function' ? pTemplateRecordAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : typeof pRootRenderable === 'function' ? pRootRenderable : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " renderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          if (!tmpRenderableHash) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not asynchronously render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable."));
            return tmpCallback(new Error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not asynchronously render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, "because it is not a valid renderable.")));
          }

          /** @type {Renderable} */
          let tmpRenderable;
          if (tmpRenderableHash == '__Virtual') {
            tmpRenderable = {
              RenderableHash: '__Virtual',
              TemplateHash: this.renderables[this.options.DefaultRenderable].TemplateHash,
              ContentDestinationAddress: typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null,
              RenderMethod: 'virtual-assignment',
              TransactionHash: pRootRenderable && typeof pRootRenderable !== 'function' && pRootRenderable.TransactionHash,
              RootRenderableViewHash: pRootRenderable && typeof pRootRenderable !== 'function' && pRootRenderable.RootRenderableViewHash
            };
          } else {
            tmpRenderable = Object.assign({}, this.renderables[tmpRenderableHash]);
            tmpRenderable.ContentDestinationAddress = typeof pRenderDestinationAddress === 'string' ? pRenderDestinationAddress : typeof tmpRenderable.ContentDestinationAddress === 'string' ? tmpRenderable.ContentDestinationAddress : typeof this.options.DefaultDestinationAddress === 'string' ? this.options.DefaultDestinationAddress : null;
          }
          if (!tmpRenderable.TransactionHash) {
            tmpRenderable.TransactionHash = "ViewRender-V-".concat(this.options.ViewIdentifier, "-R-").concat(tmpRenderableHash, "-U-").concat(this.pict.getUUID());
            tmpRenderable.RootRenderableViewHash = this.Hash;
            this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);
          }
          if (!tmpRenderable) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist."));
            return tmpCallback(new Error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not exist.")));
          }
          if (!tmpRenderable.ContentDestinationAddress) {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it does not have a valid destination address."));
            return tmpCallback(new Error("Could not render ".concat(tmpRenderableHash)));
          }
          let tmpRecordAddress;
          let tmpRecord;
          if (typeof pTemplateRecordAddress === 'object') {
            tmpRecord = pTemplateRecordAddress;
            tmpRecordAddress = 'Passed in as object';
          } else {
            tmpRecordAddress = typeof pTemplateRecordAddress === 'string' ? pTemplateRecordAddress : typeof tmpRenderable.DefaultTemplateRecordAddress === 'string' ? tmpRenderable.DefaultTemplateRecordAddress : typeof this.options.DefaultTemplateRecordAddress === 'string' ? this.options.DefaultTemplateRecordAddress : false;
            tmpRecord = typeof tmpRecordAddress === 'string' ? this.pict.DataProvider.getDataByAddress(tmpRecordAddress) : undefined;
          }
          if (this.pict.LogControlFlow) {
            this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID, "]::[").concat(this.Hash, "] Renderable[").concat(tmpRenderableHash, "] Destination[").concat(tmpRenderable.ContentDestinationAddress, "] TemplateRecordAddress[").concat(tmpRecordAddress, "] renderAsync:"));
          }
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Beginning Asynchronous Render (callback-style)..."));
          }
          let tmpAnticipate = this.fable.newAnticipate();
          tmpAnticipate.anticipate(fOnBeforeRenderCallback => {
            this.onBeforeRenderAsync(fOnBeforeRenderCallback, tmpRenderable);
          });
          tmpAnticipate.anticipate(fAsyncTemplateCallback => {
            // Render the template (asynchronously)
            this.pict.parseTemplateByHash(tmpRenderable.TemplateHash, tmpRecord, (pError, pContent) => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render (asynchronously) ").concat(tmpRenderableHash, " (param ").concat(pRenderableHash, ") because it did not parse the template."), pError);
                return fAsyncTemplateCallback(pError);
              }
              tmpRenderable.Content = pContent;
              return fAsyncTemplateCallback();
            }, [this], pScope, {
              RootRenderable: typeof pRootRenderable === 'object' ? pRootRenderable : tmpRenderable
            });
          });
          tmpAnticipate.anticipate(fNext => {
            this.onBeforeProjectAsync(fNext, tmpRenderable);
          });
          tmpAnticipate.anticipate(fNext => {
            this.onProjectAsync(fNext, tmpRenderable);
          });
          if (tmpRenderable.RenderMethod !== 'virtual-assignment') {
            tmpAnticipate.anticipate(fNext => {
              this.onAfterProjectAsync(fNext, tmpRenderable);
            });

            // Execute the developer-overridable post-render behavior
            tmpAnticipate.anticipate(fNext => {
              this.onAfterRenderAsync(fNext, tmpRenderable);
            });
          }
          tmpAnticipate.wait(tmpCallback);
        }

        /**
         * Renders the default renderable.
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        renderDefaultAsync(fCallback) {
          // Render the default renderable
          this.renderAsync(fCallback);
        }

        /**
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        basicRender(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          return this.basicRenderWithScope(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
        }

        /**
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string} [pRenderableHash] - The hash of the renderable to render.
         * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         */
        basicRenderWithScope(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress) {
          let tmpRenderOptions = this.buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
          if (tmpRenderOptions.Valid) {
            this.assignRenderContent(tmpRenderOptions.Renderable, tmpRenderOptions.DestinationAddress, this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash, tmpRenderOptions.Record, null, [this], pScope, {
              RootRenderable: tmpRenderOptions.Renderable
            }));
            return true;
          } else {
            this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash, " because it is not valid."));
            return false;
          }
        }

        /**
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         */
        basicRenderAsync(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback) {
          return this.basicRenderWithScopeAsync(this, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback);
        }

        /**
         * @param {any} pScope - The scope to use for the template rendering.
         * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
         * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
         * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
         * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
         */
        basicRenderWithScopeAsync(pScope, pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress, fCallback) {
          // Allow the callback to be passed in as the last parameter no matter what
          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : typeof pTemplateRecordAddress === 'function' ? pTemplateRecordAddress : typeof pRenderDestinationAddress === 'function' ? pRenderDestinationAddress : typeof pRenderableHash === 'function' ? pRenderableHash : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " basicRenderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " basicRenderAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          const tmpRenderOptions = this.buildRenderOptions(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress);
          if (tmpRenderOptions.Valid) {
            this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash, tmpRenderOptions.Record,
            /**
             * @param {Error} [pError] - The error that occurred during template parsing.
             * @param {string} [pContent] - The content that was rendered from the template.
             */
            (pError, pContent) => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not render (asynchronously) ").concat(tmpRenderOptions.RenderableHash, " because it did not parse the template."), pError);
                return tmpCallback(pError);
              }
              this.assignRenderContent(tmpRenderOptions.Renderable, tmpRenderOptions.DestinationAddress, pContent);
              return tmpCallback();
            }, [this], pScope, {
              RootRenderable: tmpRenderOptions.Renderable
            });
          } else {
            let tmpErrorMessage = "PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash, " because it is not valid.");
            this.log.error(tmpErrorMessage);
            return tmpCallback(new Error(tmpErrorMessage));
          }
        }

        /**
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onProject(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onProject:"));
          }
          if (pRenderable.RenderMethod === 'virtual-assignment') {
            this.pict.TransactionTracking.pushToTransactionQueue(pRenderable.TransactionHash, {
              ViewHash: this.Hash,
              Renderable: pRenderable
            }, 'Deferred-Post-Content-Assignment');
          }
          if (this.pict.LogNoisiness > 0) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " Assigning Renderable[").concat(pRenderable.RenderableHash, "] content length ").concat(pRenderable.Content.length, " to Destination [").concat(pRenderable.ContentDestinationAddress, "] using Async render method ").concat(pRenderable.RenderMethod, "."));
          }

          // Assign the content to the destination address
          this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod, pRenderable.ContentDestinationAddress, pRenderable.Content, pRenderable.TestAddress);
          this.lastRenderedTimestamp = this.pict.log.getTimeStamp();
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
         *
         * @param {(error?: Error, content?: string) => void} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that is being projected.
         */
        onProjectAsync(fCallback, pRenderable) {
          this.onProject(pRenderable);
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers after the view is rendered.
         *
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onAfterRender(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRender:"));
          }
          if (pRenderable && pRenderable.RootRenderableViewHash === this.Hash) {
            const tmpTransactionQueue = this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash) || [];
            for (const tmpEvent of tmpTransactionQueue) {
              const tmpView = this.pict.views[tmpEvent.Data.ViewHash];
              if (!tmpView) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRender: Could not find view for transaction hash ").concat(pRenderable.TransactionHash, " and ViewHash ").concat(tmpEvent.Data.ViewHash, "."));
                continue;
              }
              tmpView.onAfterProject();

              // Execute the developer-overridable post-render behavior
              tmpView.onAfterRender(tmpEvent.Data.Renderable);
            }
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is rendered (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that was rendered.
         */
        onAfterRenderAsync(fCallback, pRenderable) {
          this.onAfterRender(pRenderable);
          const tmpAnticipate = this.fable.newAnticipate();
          if (pRenderable && pRenderable.RootRenderableViewHash === this.Hash) {
            const queue = this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash) || [];
            for (const event of queue) {
              /** @type {PictView} */
              const tmpView = this.pict.views[event.Data.ViewHash];
              if (!tmpView) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterRenderAsync: Could not find view for transaction hash ").concat(pRenderable.TransactionHash, " and ViewHash ").concat(event.Data.ViewHash, "."));
                continue;
              }
              tmpAnticipate.anticipate(tmpView.onAfterProjectAsync.bind(tmpView));
              tmpAnticipate.anticipate(fNext => {
                tmpView.onAfterRenderAsync(fNext, event.Data.Renderable);
              });

              // Execute the developer-overridable post-render behavior
            }
          }
          return tmpAnticipate.wait(fCallback);
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM.
         *
         * @param {Renderable} pRenderable - The renderable that was projected.
         */
        onAfterProject(pRenderable) {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterProject:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         * @param {Renderable} pRenderable - The renderable that was projected.
         */
        onAfterProjectAsync(fCallback, pRenderable) {
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                            Code Section: Solver                            */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before the view is solved.
         */
        onBeforeSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeSolveAsync(fCallback) {
          this.onBeforeSolve();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when the view is solved.
         */
        onSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onSolveAsync(fCallback) {
          this.onSolve();
          return fCallback();
        }

        /**
         * Performs view solving and triggers lifecycle hooks.
         *
         * @return {boolean} - True if the view was solved successfully, false otherwise.
         */
        solve() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeSolve();
          this.onSolve();
          this.onAfterSolve();
          this.lastSolvedTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Performs view solving and triggers lifecycle hooks (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        solveAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " solveAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onSolveAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " solveAsync() complete."));
            }
            this.lastSolvedTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after the view is solved.
         */
        onAfterSolve() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterSolve:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after the view is solved (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterSolveAsync(fCallback) {
          this.onAfterSolve();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal From View                        */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before data is marshaled from the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        onBeforeMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeMarshalFromViewAsync(fCallback) {
          this.onBeforeMarshalFromView();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when data is marshaled from the view.
         */
        onMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onMarshalFromViewAsync(fCallback) {
          this.onMarshalFromView();
          return fCallback();
        }

        /**
         * Marshals data from the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        marshalFromView() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeMarshalFromView();
          this.onMarshalFromView();
          this.onAfterMarshalFromView();
          this.lastMarshalFromViewTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Marshals data from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        marshalFromViewAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalFromViewAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalFromViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onMarshalFromViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalFromViewAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " marshalFromViewAsync() complete."));
            }
            this.lastMarshalFromViewTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after data is marshaled from the view.
         */
        onAfterMarshalFromView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterMarshalFromView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after data is marshaled from the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterMarshalFromViewAsync(fCallback) {
          this.onAfterMarshalFromView();
          return fCallback();
        }

        /* -------------------------------------------------------------------------- */
        /*                     Code Section: Marshal To View                          */
        /* -------------------------------------------------------------------------- */
        /**
         * Lifecycle hook that triggers before data is marshaled into the view.
         */
        onBeforeMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onBeforeMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers before data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onBeforeMarshalToViewAsync(fCallback) {
          this.onBeforeMarshalToView();
          return fCallback();
        }

        /**
         * Lifecycle hook that triggers when data is marshaled into the view.
         */
        onMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers when data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onMarshalToViewAsync(fCallback) {
          this.onMarshalToView();
          return fCallback();
        }

        /**
         * Marshals data into the view.
         *
         * @return {boolean} - True if the operation was successful, false otherwise.
         */
        marshalToView() {
          if (this.pict.LogNoisiness > 2) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " executing solve() function..."));
          }
          this.onBeforeMarshalToView();
          this.onMarshalToView();
          this.onAfterMarshalToView();
          this.lastMarshalToViewTimestamp = this.pict.log.getTimeStamp();
          return true;
        }

        /**
         * Marshals data into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        marshalToViewAsync(fCallback) {
          let tmpAnticipate = this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');

          /** @type {ErrorCallback} */
          let tmpCallback = typeof fCallback === 'function' ? fCallback : null;
          if (!tmpCallback) {
            this.log.warn("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));
            tmpCallback = pError => {
              if (pError) {
                this.log.error("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.Name, " marshalToViewAsync Auto Callback Error: ").concat(pError), pError);
              }
            };
          }
          tmpAnticipate.anticipate(this.onBeforeMarshalToViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onMarshalToViewAsync.bind(this));
          tmpAnticipate.anticipate(this.onAfterMarshalToViewAsync.bind(this));
          tmpAnticipate.wait(pError => {
            if (this.pict.LogNoisiness > 2) {
              this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " marshalToViewAsync() complete."));
            }
            this.lastMarshalToViewTimestamp = this.pict.log.getTimeStamp();
            return tmpCallback(pError);
          });
        }

        /**
         * Lifecycle hook that triggers after data is marshaled into the view.
         */
        onAfterMarshalToView() {
          if (this.pict.LogNoisiness > 3) {
            this.log.trace("PictView [".concat(this.UUID, "]::[").concat(this.Hash, "] ").concat(this.options.ViewIdentifier, " onAfterMarshalToView:"));
          }
          return true;
        }

        /**
         * Lifecycle hook that triggers after data is marshaled into the view (async flow).
         *
         * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
         */
        onAfterMarshalToViewAsync(fCallback) {
          this.onAfterMarshalToView();
          return fCallback();
        }

        /** @return {boolean} - True if the object is a PictView. */
        get isPictView() {
          return true;
        }
      }
      module.exports = PictView;
    }, {
      "../package.json": 7,
      "fable-serviceproviderbase": 2
    }],
    9: [function (require, module, exports) {
      const libPictProvider = require('pict-provider');
      const libPPRouter = require('./providers/PP-Router.js');
      const libPPCSSHotloader = require('./providers/PP-CSS-Hotloader.js');
      const libPPConfigStorage = require('./providers/PP-ConfigStorage.js');
      const libPPTemplateOverrideStorage = require('./providers/PP-TemplateOverrideStorage.js');
      const libPPContainer = require('./views/PP-Container.js');
      const libPPMain = require('./views/PP-Main.js');
      const libPPNav = require('./views/PP-Navigation.js');
      const libPPADB = require('./views/PP-View-AppDataBrowser.js');
      const libPPTB = require('./views/PP-View-TemplateBrowser.js');
      const libPPVB = require('./views/PP-View-ViewBrowser.js');
      const libPPPB = require('./views/PP-View-ProviderBrowser.js');
      const libPPTO = require('./views/PP-View-TemplateOverrides.js');
      const _DefaultProviderConfiguration = {
        "ProviderIdentifier": "Pict-Panel",
        "AutoInitialize": false,
        "AutoSolveWithApp": false
      };
      class PictPanel extends libPictProvider {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultProviderConfiguration)), pOptions);
          super(pFable, tmpOptions, pServiceHash);
        }
        show() {
          if (!('PP-Panel' in this.pict.views)) {
            this.pict.addProvider('PP-Router', libPPRouter.default_configuration, libPPRouter);
            this.pict.addProvider('PP-CSS-Hotloader', libPPCSSHotloader.default_configuration, libPPCSSHotloader);
            this.pict.addProvider('PP-ConfigStorage', libPPConfigStorage.default_configuration, libPPConfigStorage);
            this.pict.addProvider('PP-TemplateOverrideStorage', libPPTemplateOverrideStorage.default_configuration, libPPTemplateOverrideStorage);

            // TODO: Discuss whether this should load them all or children should load their parts (e.g. this loads Main/Nav, Main or Nav loads the next bits)
            let tmpRootPanelView = this.pict.addView('PP-Panel', libPPContainer.default_configuration, libPPContainer);
            let tmpMainView = this.pict.addView('PP-Main', libPPMain.default_configuration, libPPMain);
            this.pict.addView('PP-Nav', libPPNav.default_configuration, libPPNav);
            this.pict.addView('PP-ADB', libPPADB.default_configuration, libPPADB);
            this.pict.addView('PP-TB', libPPTB.default_configuration, libPPTB);
            this.pict.addView('PP-VB', libPPVB.default_configuration, libPPVB);
            this.pict.addView('PP-PB', libPPPB.default_configuration, libPPPB);
            this.pict.addView('PP-TO', libPPTO.default_configuration, libPPTO);

            // Load saved config into uiState before rendering
            let tmpSavedConfig = this.pict.providers['PP-ConfigStorage'].load();
            if (tmpSavedConfig && tmpSavedConfig.Behaviors) {
              let tmpKeys = Object.keys(tmpSavedConfig.Behaviors);
              for (let i = 0; i < tmpKeys.length; i++) {
                if (tmpKeys[i] in tmpMainView.uiState.Behaviors) {
                  tmpMainView.uiState.Behaviors[tmpKeys[i]] = tmpSavedConfig.Behaviors[tmpKeys[i]];
                }
              }
            }
            tmpRootPanelView.render();

            // Apply saved position/size and visual state after DOM exists
            this.pict.providers['PP-ConfigStorage'].applyConfig(tmpMainView);

            // Apply any persisted template overrides
            this.pict.providers['PP-TemplateOverrideStorage'].applyOverrides();
          } else {
            // Toggle the show/hide for the main view.
            this.pict.views['PP-Main'].toggleUIBehavior('visible');
          }
        }
      }

      /**
       * Auto-inject into a running pict app when the script is loaded via eval/script tag.
       *
       * When hotloaded (e.g. via fetch+eval or a script tag), this detects the global
       * _Pict instance, registers PictPanel as a provider, and shows the panel.
       *
       * Simple console one-liner to inject from CDN:
       *   fetch('https://cdn.jsdelivr.net/npm/pict-panel/dist/pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
       *
       * Or from a local dev server:
       *   fetch('http://localhost:9998/pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
       */
      PictPanel.inject = function (pPictInstance) {
        let tmpPict = pPictInstance || (typeof _Pict !== 'undefined' ? _Pict : null);
        if (!tmpPict) {
          console.error('PictPanel.inject: No Pict instance found. Pass one as PictPanel.inject(myPictInstance) or ensure _Pict is global.');
          return;
        }
        if (!tmpPict.providers.PictPanel) {
          tmpPict.addProvider('PictPanel', {}, PictPanel);
        }
        tmpPict.providers.PictPanel.show();
      };
      module.exports = PictPanel;
      module.exports.default_configuration = _DefaultProviderConfiguration;
    }, {
      "./providers/PP-CSS-Hotloader.js": 19,
      "./providers/PP-ConfigStorage.js": 20,
      "./providers/PP-Router.js": 21,
      "./providers/PP-TemplateOverrideStorage.js": 22,
      "./views/PP-Container.js": 23,
      "./views/PP-Main.js": 24,
      "./views/PP-Navigation.js": 25,
      "./views/PP-View-AppDataBrowser.js": 26,
      "./views/PP-View-ProviderBrowser.js": 27,
      "./views/PP-View-TemplateBrowser.js": 28,
      "./views/PP-View-TemplateOverrides.js": 29,
      "./views/PP-View-ViewBrowser.js": 30,
      "pict-provider": 4
    }],
    10: [function (require, module, exports) {
      module.exports = {
        CSS: /*CSS*/"\n\n/* AppData Browser */\n\n.pp_adb_container {\n\tpadding: 4px;\n}\n\n.pp_adb_header {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n\tpadding: 4px 8px;\n\tborder-bottom: 2px solid var(--pal-acc);\n\tmargin-bottom: 4px;\n}\n\n.pp_adb_header_label {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.9rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-pri);\n}\n\n.pp_adb_header_actions {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n}\n\n.pp_adb_action_btn {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.7rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-pri);\n\ttext-decoration: none;\n\tcursor: pointer;\n\tpadding: 1px 4px;\n\tborder-radius: 3px;\n\tdisplay: flex;\n\talign-items: center;\n}\n\n.pp_adb_action_btn:hover {\n\tcolor: var(--pal-acc-bri);\n\tbackground: rgba(0,0,0,0.05);\n}\n\n/* Editor */\n.pp_adb_editor {\n\tpadding: 4px 8px;\n\tborder-bottom: 1px solid rgba(0,48,73, 0.15);\n\tmargin-bottom: 4px;\n}\n\n.pp_adb_editor_textarea {\n\twidth: 100%;\n\tmin-height: 200px;\n\tmax-height: 60vh;\n\tfont-family: Courier, monospace;\n\tfont-size: 0.75rem;\n\tline-height: 1.3;\n\tpadding: 4px;\n\tborder: 1px solid var(--pal-pri);\n\tborder-radius: 3px;\n\tbackground: #fff;\n\tcolor: var(--pal-pri);\n\tresize: vertical;\n\tbox-sizing: border-box;\n\ttab-size: 4;\n}\n\n.pp_adb_editor_textarea:focus {\n\toutline: 2px solid var(--pal-acc-bri);\n\toutline-offset: -1px;\n}\n\n.pp_adb_editor_textarea.pp_adb_editor_error {\n\toutline: 2px solid #c1121f;\n\tbackground: #fff1f1;\n}\n\n.pp_adb_editor_actions {\n\tdisplay: flex;\n\tgap: 8px;\n\tjustify-content: flex-end;\n\tmargin-top: 4px;\n}\n\n.pp_adb_editor_save {\n\tcolor: #067d17 !important;\n}\n\n.pp_adb_editor_cancel {\n\tcolor: var(--pal-acc) !important;\n}\n\n/* Tree entries */\n.pp_adb_entry {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.8rem;\n\tline-height: 1.4;\n}\n\n.pp_adb_leaf .pp_adb_datarow {\n\tdisplay: flex;\n\talign-items: baseline;\n\tpadding: 1px 4px 1px 8px;\n\tborder-left: 2px solid transparent;\n}\n\n.pp_adb_leaf .pp_adb_datarow:hover {\n\tbackground: rgba(0,48,73, 0.06);\n\tborder-left-color: var(--pal-pri);\n}\n\n.pp_adb_branch > .pp_adb_datarow {\n\tdisplay: flex;\n\talign-items: baseline;\n\tpadding: 2px 4px;\n\tcursor: pointer;\n\tborder-left: 2px solid transparent;\n\tuser-select: none;\n}\n\n.pp_adb_branch > .pp_adb_datarow:hover {\n\tbackground: rgba(0,48,73, 0.08);\n\tborder-left-color: var(--pal-acc-bri);\n}\n\n.pp_adb_record_metadata {\n\tdisplay: flex;\n\talign-items: baseline;\n\tgap: 4px;\n\tflex-shrink: 0;\n}\n\n.pp_adb_record_data {\n\tmargin-left: 4px;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\tflex: 1;\n\tmin-width: 0;\n}\n\n.pp_adb_key {\n\tcolor: var(--pal-acc);\n\tfont-weight: bold;\n}\n\n.pp_adb_leaf .pp_adb_key::after {\n\tcontent: ':';\n\tcolor: var(--pal-pri);\n}\n\n.pp_adb_type {\n\tfont-size: 0.7rem;\n\tfont-style: italic;\n\tcolor: #888;\n}\n\n.pp_adb_count {\n\tfont-size: 0.7rem;\n\tcolor: #888;\n}\n\n/* Leaf value styling by type */\n.pp_adb_value {\n\tcolor: var(--pal-pri);\n}\n\n.pp_adb_value_string {\n\tcolor: #067d17;\n}\n\n.pp_adb_value_string::before {\n\tcontent: '\"';\n\tcolor: #888;\n}\n\n.pp_adb_value_string::after {\n\tcontent: '\"';\n\tcolor: #888;\n}\n\n.pp_adb_value_number {\n\tcolor: #1750eb;\n}\n\n.pp_adb_value_boolean {\n\tcolor: #9c27b0;\n\tfont-weight: bold;\n}\n\n.pp_adb_value_null,\n.pp_adb_value_undefined {\n\tcolor: #888;\n\tfont-style: italic;\n}\n\n/* Expand/collapse icon */\n.pp_adb_expand_icon {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 14px;\n\theight: 14px;\n\ttransition: transform 0.15s ease;\n\tflex-shrink: 0;\n}\n\n.pp_adb_expand_icon.pp_adb_collapsed {\n\ttransform: rotate(0deg);\n}\n\n.pp_adb_expand_icon.pp_adb_expanded {\n\ttransform: rotate(90deg);\n}\n\n.pp_adb_expand_icon svg {\n\tcolor: var(--pal-pri);\n}\n\n/* Child container indentation */\n.pp_adb_children {\n\tmargin-left: 12px;\n\tborder-left: 1px solid rgba(0,48,73, 0.15);\n}\n\n.pp_adb_scalar_value {\n\tpadding: 4px 8px;\n\tfont-family: Courier, monospace;\n\tfont-size: 0.8rem;\n\tcolor: var(--pal-pri);\n}\n\n"
      };
    }, {}],
    11: [function (require, module, exports) {
      module.exports = {
        CSS: /*CSS*/"\n\n/* Logo SVG Colors */\n.pplg_earth path { display: block; fill: #b48d49; stroke-width: 0; }\n.pplg_sky path { display: block; fill: #d19ac4; stroke-width: 0; }\n.pplg_border_outer { display: block; fill: #312514; stroke-width: 0; }\n.pplg_border_inner { display: block; fill: #dcd6c1; stroke-width: 0; }\n.pplg_mtn { display: block; fill: #8a847b; stroke-width: 0; }\n.pplg_star { display: block; fill: #f6f6f6; stroke-width: 0; }\n.pplg_ceres { display: block; fill: #b5b597; stroke-width: 0; }\n.pplg_crater { display: block; fill: #e8e5dd; stroke-width: 0; fill-opacity: 0.55; }\n\n"
      };
    }, {}],
    12: [function (require, module, exports) {
      module.exports = {
        CSS: /*CSS*/"\n\n/* CSS Color Palettes .. for bein' modern? */\n\n/*\nrgb(255, 252, 64),\nrgb(250, 186, 97),\nrgb(255, 129, 114),\nrgb(255, 47, 169),\nrgb(58, 87, 154),\nrgb(54, 36, 79)\n\n#fffc40\n#faba61\n#ff8172\n#ff2fa9\n#3a579a\n#36244f\n*/\n\n:root { \n\t--pal-bg: #fdf0d5;\n    --pal-pri: #003049;\n\t--pal-pri-brt: #669bbc;\n    --pal-acc: #780000;\n    --pal-acc-bri: #c1121f;\n\n\t--win-bg: var(--pal-bg);\n\t--win-fg: var(--pal-pri);\n\t--win-border: var(--pal-acc);\n\n\t--hd-bg: var(--win-bg);\n\t--hd-logotext: var(--pal-acc);\n\n\t--hd-sz-con: rgba(210,210,210, 0.2);\n\t--hd-sz-con-border: rgba(235,235,235, 0.4);\n\t--hd-sz-con-hover: rgba(210,210,210, 0.9);\n\t--hd-sz-con-border-hover: var(--pal-acc-bri);\n}\n\n/* Dark mode overrides */\n#Pict-Panel.pp_dark_mode {\n\t--pal-bg: #1e1e2e;\n\t--pal-pri: #cdd6f4;\n\t--pal-pri-brt: #89b4fa;\n\t--pal-acc: #f38ba8;\n\t--pal-acc-bri: #eba0ac;\n\n\t--win-bg: var(--pal-bg);\n\t--win-fg: var(--pal-pri);\n\t--win-border: var(--pal-acc);\n\n\t--hd-bg: var(--win-bg);\n\t--hd-logotext: var(--pal-acc);\n\n\t--hd-sz-con: rgba(80,80,80, 0.3);\n\t--hd-sz-con-border: rgba(100,100,100, 0.4);\n\t--hd-sz-con-hover: rgba(80,80,80, 0.8);\n\t--hd-sz-con-border-hover: var(--pal-acc-bri);\n}\n\n#Pict-Panel.pp_dark_mode .pp_adb_value_string {\n\tcolor: #a6e3a1;\n}\n\n#Pict-Panel.pp_dark_mode .pp_adb_value_number {\n\tcolor: #89b4fa;\n}\n\n#Pict-Panel.pp_dark_mode .pp_adb_value_boolean {\n\tcolor: #cba6f7;\n}\n\n#Pict-Panel.pp_dark_mode .pp_adb_editor_textarea {\n\tbackground: #313244;\n\tcolor: #cdd6f4;\n\tborder-color: #585b70;\n}\n\n#Pict-Panel.pp_dark_mode .pp_adb_editor_save {\n\tcolor: #a6e3a1 !important;\n}\n\n"
      };
    }, {}],
    13: [function (require, module, exports) {
      module.exports = {
        CSS: /*CSS*/"\n\n/* Panel Styling */\n\n#Pict-Panel {\n\tz-index: 900;\n\tposition: fixed;\n\ttop: 15px;\n\tright: 15px;\n\n\tmin-height: 24px;\n\tmax-height: 98%;\n\tmin-width: 300px;\n\tmax-width: 98%;\n\n\twidth: 300px;\n\n\toverflow: hidden;\n\tresize: both;\n\n\tdisplay: flex;\n\tflex-direction: column;\n\n\tcolor: var(--win-fg);\n\tbackground: var(--win-bg);\n\tborder: 3px double var(--win-border);\n\tborder-radius: 5px;\n}\n\n.pp_content {\n\tflex: 1;\n\toverflow: auto;\n\tmin-height: 0;\n}\n\n#Pict-Panel.pp_no_resize {\n\tresize: none;\n}\n\n/* Tab mode: collapse to just the logo */\n#Pict-Panel.pp_tab_mode {\n\ttop: -3px;\n\tright: 60px;\n\tleft: auto;\n\twidth: auto;\n\tmin-width: 0;\n\tmax-width: none;\n\theight: auto;\n\tmin-height: 0;\n\tmax-height: none;\n\tresize: none;\n\toverflow: visible;\n\tpadding: 0;\n}\n\n#Pict-Panel.pp_tab_mode .pp_hd {\n\tdisplay: block;\n\tpadding: 2px;\n}\n\n#Pict-Panel.pp_tab_mode .pp_hd_pict,\n#Pict-Panel.pp_tab_mode .pp_hd_control,\n#Pict-Panel.pp_tab_mode .pp_nav,\n#Pict-Panel.pp_tab_mode .pp_content {\n\tdisplay: none !important;\n}\n\n#Pict-Panel.pp_tab_mode .pp_hd_logo {\n\tcursor: grab;\n}\n\n#Pict-Panel.pp_tab_mode .pp_hd_logo:active {\n\tcursor: grabbing;\n}\n\n#Pict-Panel.pp_tab_mode .pp_hd_logo svg {\n\twidth: 36px;\n\theight: 36px;\n\tdisplay: block;\n}\n\n#Pict-Panel-Drag {\n\tz-index: 910;\n\tcursor: move;\n}\n\n.pp_hd {\n\tdisplay: grid;\n\tgrid-template-columns: 70px 1fr 70px;\n\tgrid-template-areas: \"logo title controls\";\n\talign-content: stretch;\n\n\tpadding: 4px;\n\tfill: var(--hd-bg);\n}\n\n.pp_hd_logo {\n\tgrid-area: logo;\n}\n\n.pp_hd_pict {\n\tgrid-area: title;\n\tfont-family: Verdana;\n\tfont-size: 48px;\n\tfont-weight: bold;\n\tcolor: --hd-logotext;\n\tuser-select: none;\n}\n\n.pp_hd_control {\n\tgrid-area: controls;\n\tjustify-self: end;\n}\n\n\n/* UI size/etc. toggle Controls */\n.pp_sz_con {\n\tdisplay: grid;\n\tgrid-template-columns: 20px 20px 20px;\n\tgrid-template-rows: 20px 20px 20px;\n\talign-content: stretch;\n\n\ttext-align: right;\n}\n\n.pp_sz_con > div {\n\tbackground-color: var(--hd-sz-con);\n\tborder-color: var(--hd-sz-con-border);\n\tborder-style: dotted;\n\tcursor: pointer;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\toverflow: hidden;\n}\n\n.pp_sz_con > div:hover {\n\tbackground-color: var(--hd-sz-con-hover);\n\tborder-color: var(--hd-sz-con-border-hover);\n\tborder-style: solid;\n}\n\n.pp_sz_con svg\n{\n\twidth: 16px;\n\theight: 16px;\n\tcolor: var(--pal-pri);\n\tfill: var(--pal-pri);\n}\n\n.pp_sz_con > div:hover svg\n{\n\tcolor: var(--pal-acc-bri);\n\tfill: var(--pal-acc-bri);\n}\n\n/* Toggle icon visibility: unchecked shows .off, checked shows .on */\n.pp_sz_con .checked .off,\n.pp_sz_con .checked .hover_on\n{\n\tdisplay: none !important;\n}\n.pp_sz_con .unchecked .on,\n.pp_sz_con .unchecked .hover_off\n{\n\tdisplay: none !important;\n}\n.pp_sz_con .checked .on,\n.pp_sz_con .checked .hover_off\n{\n\tdisplay: inline-flex !important;\n}\n.pp_sz_con .unchecked .off,\n.pp_sz_con .unchecked .hover_on\n{\n\tdisplay: inline-flex !important;\n}\n\n/* Navigation */\n.pp_nav {\n\tpadding: 2px 8px;\n\tborder-bottom: 1px solid var(--pal-acc);\n\tfont-family: Courier, monospace;\n\tfont-size: 0.8rem;\n}\n\n.pp_nav a {\n\tcolor: var(--pal-acc);\n\ttext-decoration: none;\n}\n\n.pp_nav a:hover {\n\tcolor: var(--pal-acc-bri);\n}\n\n.pp_nav_short {\n\tfont-weight: 800;\n\tletter-spacing: -0.5px;\n\ttext-transform: uppercase;\n\tfont-style: normal;\n}\n\n.pp_nav_long {\n\tfont-weight: 400;\n\tfont-style: normal;\n\tdisplay: none;\n}\n\n.pp_nav_active .pp_nav_short {\n\tdisplay: none;\n}\n\n.pp_nav_active .pp_nav_long {\n\tdisplay: inline;\n\topacity: 0.6;\n}\n\n"
      };
    }, {}],
    14: [function (require, module, exports) {
      module.exports = {
        CSS: /*CSS*/"\n\n/* Shared Service Browser (Views + Providers) */\n\n.pp_sb_container {\n\tpadding: 4px;\n}\n\n/* List entries */\n.pp_sb_entry {\n\tpadding: 3px 8px;\n\tborder-left: 2px solid transparent;\n}\n\n.pp_sb_entry:hover {\n\tbackground: rgba(0,48,73, 0.06);\n\tborder-left-color: var(--pal-pri);\n}\n\n.pp_sb_entry_row {\n\tdisplay: flex;\n\talign-items: baseline;\n\tgap: 6px;\n\tposition: relative;\n}\n\n.pp_sb_entry_hash {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.8rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-acc);\n\ttext-decoration: none;\n\tflex-shrink: 0;\n\tcursor: pointer;\n}\n\n.pp_sb_entry_hash:hover {\n\tcolor: var(--pal-acc-bri);\n}\n\n.pp_sb_entry_info {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.65rem;\n\tcolor: #999;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\tflex: 1;\n\tmin-width: 0;\n}\n\n/* Action icons (render/renderAsync) in list */\n.pp_sb_action_icon {\n\tdisplay: none;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 18px;\n\theight: 18px;\n\tpadding: 2px;\n\tborder-radius: 3px;\n\tcolor: var(--pal-pri);\n\ttext-decoration: none;\n\tcursor: pointer;\n\tposition: absolute;\n\tright: 0;\n\ttop: 0;\n\tbackground: var(--win-bg);\n}\n\n.pp_sb_action_icon + .pp_sb_action_icon {\n\tright: 20px;\n}\n\n.pp_sb_entry:hover .pp_sb_action_icon {\n\tdisplay: inline-flex;\n}\n\n.pp_sb_action_icon:hover {\n\tcolor: var(--pal-acc-bri);\n\tbackground: rgba(0,0,0,0.05);\n}\n\n.pp_sb_action_icon svg {\n\twidth: 12px;\n\theight: 12px;\n}\n\n/* Detail view */\n.pp_sb_detail {\n\tpadding: 0 4px;\n}\n\n.pp_sb_detail_header {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n\tpadding: 4px 4px 6px;\n\tborder-bottom: 2px solid var(--pal-acc);\n\tmargin-bottom: 4px;\n}\n\n.pp_sb_back_btn {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 18px;\n\theight: 18px;\n\tcolor: var(--pal-pri);\n\ttext-decoration: none;\n\tborder-radius: 3px;\n\tflex-shrink: 0;\n}\n\n.pp_sb_back_btn:hover {\n\tcolor: var(--pal-acc-bri);\n\tbackground: rgba(0,0,0,0.05);\n}\n\n.pp_sb_back_btn svg {\n\twidth: 14px;\n\theight: 14px;\n}\n\n.pp_sb_detail_hash {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.9rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-acc);\n}\n\n/* Vitals */\n.pp_sb_vitals {\n\tpadding: 2px 8px;\n}\n\n.pp_sb_vital_row {\n\tdisplay: flex;\n\talign-items: baseline;\n\tgap: 6px;\n\tpadding: 1px 0;\n\tfont-family: Courier, monospace;\n\tfont-size: 0.75rem;\n\tline-height: 1.4;\n}\n\n.pp_sb_vital_key {\n\tcolor: var(--pal-acc);\n\tfont-weight: bold;\n\tflex-shrink: 0;\n\tmin-width: 90px;\n}\n\n.pp_sb_vital_key::after {\n\tcontent: ':';\n\tcolor: var(--pal-pri);\n}\n\n.pp_sb_vital_val {\n\tcolor: var(--pal-pri);\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\tflex: 1;\n\tmin-width: 0;\n}\n\n/* Action buttons in detail view */\n.pp_sb_detail_actions {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 4px;\n\tpadding: 6px 8px;\n\tborder-top: 1px solid rgba(0,48,73, 0.1);\n\tborder-bottom: 1px solid rgba(0,48,73, 0.1);\n\tmargin: 4px 0;\n}\n\n.pp_sb_detail_action_btn {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.7rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-pri);\n\ttext-decoration: none;\n\tcursor: pointer;\n\tpadding: 2px 6px;\n\tborder: 1px solid var(--pal-pri);\n\tborder-radius: 3px;\n}\n\n.pp_sb_detail_action_btn:hover {\n\tcolor: var(--pal-acc-bri);\n\tborder-color: var(--pal-acc-bri);\n\tbackground: rgba(0,0,0,0.05);\n}\n\n/* Section labels */\n.pp_sb_detail_section_label {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.75rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-pri);\n\tpadding: 4px 8px 2px;\n\topacity: 0.6;\n}\n\n/* Template entries in detail */\n.pp_sb_detail_tpl_entry {\n\tpadding: 2px 8px;\n\tborder-left: 2px solid transparent;\n}\n\n.pp_sb_detail_tpl_entry:hover {\n\tbackground: rgba(0,48,73, 0.04);\n\tborder-left-color: var(--pal-pri-brt);\n}\n\n.pp_sb_detail_tpl_hash {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.75rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-acc);\n}\n\n.pp_sb_detail_tpl_preview {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.65rem;\n\tcolor: var(--pal-pri);\n\topacity: 0.5;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\tpadding-left: 8px;\n}\n\n/* Options list in provider detail */\n.pp_sb_detail_opts_list {\n\tpadding: 2px 8px;\n}\n\n"
      };
    }, {}],
    15: [function (require, module, exports) {
      module.exports = {
        CSS: /*CSS*/"\n\n/* Template Browser */\n\n.pp_tb_container {\n\tpadding: 4px;\n}\n\n.pp_tb_filter {\n\tpadding: 2px 8px 4px;\n}\n\n.pp_tb_filter_input {\n\twidth: 100%;\n\tbox-sizing: border-box;\n\tfont-family: Courier, monospace;\n\tfont-size: 0.75rem;\n\tpadding: 3px 6px;\n\tborder: 1px solid var(--pal-pri);\n\tborder-radius: 3px;\n\tbackground: transparent;\n\tcolor: var(--pal-pri);\n}\n\n.pp_tb_filter_input:focus {\n\toutline: 2px solid var(--pal-acc-bri);\n\toutline-offset: -1px;\n}\n\n.pp_tb_filter_input::placeholder {\n\tcolor: #999;\n}\n\n/* Editor area */\n.pp_tb_editor {\n\tpadding: 4px 8px;\n\tborder-bottom: 1px solid rgba(0,48,73, 0.15);\n\tmargin-bottom: 4px;\n}\n\n.pp_tb_editor_header {\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n\tmargin-bottom: 4px;\n}\n\n.pp_tb_editor_hash {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.8rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-acc);\n}\n\n.pp_tb_editor_textarea {\n\tmin-height: 120px;\n}\n\n/* Template list */\n.pp_tb_entry {\n\tpadding: 3px 8px;\n\tborder-left: 2px solid transparent;\n}\n\n.pp_tb_entry:hover {\n\tbackground: rgba(0,48,73, 0.06);\n\tborder-left-color: var(--pal-pri);\n}\n\n.pp_tb_entry_row {\n\tdisplay: flex;\n\talign-items: baseline;\n\tgap: 6px;\n}\n\n.pp_tb_entry_hash {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.8rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-acc);\n\tflex-shrink: 0;\n}\n\n.pp_tb_entry_source {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.65rem;\n\tcolor: #999;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\tflex: 1;\n\tmin-width: 0;\n}\n\n.pp_tb_entry_preview {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.7rem;\n\tcolor: var(--pal-pri);\n\topacity: 0.6;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\tpadding-left: 8px;\n}\n\n.pp_tb_empty {\n\tpadding: 8px;\n\tfont-family: Courier, monospace;\n\tfont-size: 0.8rem;\n\tcolor: #999;\n\tfont-style: italic;\n}\n\n"
      };
    }, {}],
    16: [function (require, module, exports) {
      module.exports = {
        CSS: /*CSS*/"\n\n/* Template Overrides View */\n\n.pp_to_container {\n\tpadding: 4px;\n}\n\n.pp_to_entry {\n\tpadding: 3px 8px;\n\tborder-left: 2px solid transparent;\n}\n\n.pp_to_entry:hover {\n\tbackground: rgba(0,48,73, 0.06);\n}\n\n.pp_to_active {\n\tborder-left-color: var(--pal-acc);\n}\n\n.pp_to_inactive {\n\tborder-left-color: transparent;\n\topacity: 0.6;\n}\n\n.pp_to_entry_row {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n}\n\n.pp_to_toggle {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 16px;\n\theight: 16px;\n\tcolor: var(--pal-pri);\n\ttext-decoration: none;\n\tcursor: pointer;\n\tflex-shrink: 0;\n}\n\n.pp_to_toggle:hover {\n\tcolor: var(--pal-acc-bri);\n}\n\n.pp_to_entry_hash {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.75rem;\n\tfont-weight: bold;\n\tcolor: var(--pal-acc);\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n\tflex: 1;\n\tmin-width: 0;\n}\n\n.pp_to_remove {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 16px;\n\theight: 16px;\n\tcolor: var(--pal-pri);\n\ttext-decoration: none;\n\tcursor: pointer;\n\tflex-shrink: 0;\n\topacity: 0;\n}\n\n.pp_to_entry:hover .pp_to_remove {\n\topacity: 1;\n}\n\n.pp_to_remove:hover {\n\tcolor: #c44;\n}\n\n.pp_to_empty {\n\tfont-family: Courier, monospace;\n\tfont-size: 0.75rem;\n\tcolor: var(--pal-pri);\n\topacity: 0.5;\n\tpadding: 8px;\n}\n\n"
      };
    }, {}],
    17: [function (require, module, exports) {
      module.exports = {
        HTML: /*html*/"\n\n\t\t<div id=\"Pict-Panel\">\n\t\t\t<div class=\"pp_hd\">\n\t\t\t\t<div class=\"pp_hd_logo\" id=\"Pict-Panel-Drag\">\n\t\t\t\t\t<svg version=\"1.1\" style=\"display: block\" viewBox=\"0 0 62.3 63\" width=\"62.3\" height=\"63\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\" > <g class=\"pplg_border\" transform=\"translate(-0.926,-0.465)\"> <ellipse cx=\"32.1\" cy=\"32\" rx=\"31.1\" ry=\"31.5\" class=\"pplg_border_outer\" /> <ellipse cx=\"32.1\" cy=\"32\" rx=\"29.3\" ry=\"29.6\" class=\"pplg_border_inner\" /> </g> <g class=\"pplg_earth\" transform=\"translate(-0.926,-0.465)\"> <path d=\"m 24.1,58.6 c 5.6,0 11.3,-0.1 16.9,0 -1,0.8 -3,0.8 -4.3,1.2 -4.3,1 -8.7,0.2 -12.8,-0.9 -0.7,-0.3 -0.2,-0.2 0.2,-0.3 z\" /> <path d=\"m 16.8,55.1 c 10.3,0 20.5,0.1 30.8,0 -0.9,0.8 -1.9,1.8 -3,1.9 C 39.7,56.8 34.8,57 29.9,56.9 26.8,57 23.6,56.8 20.4,57 19,57.4 18,56 16.8,55.4 c 0,-0.1 0,-0.2 0,-0.3 z\" /> <path d=\"m 12.9,51.7 c 12.9,-0.1 25.7,0 38.6,0 -0.7,1.7 -2.3,2.1 -4,1.9 -10.6,0 -21.2,0.1 -31.8,0.1 -1.2,0.1 -2.8,-0.9 -2.8,-2 z\" /> <path d=\"m 10,48.2 c 10.4,-0.1 20.8,0 31.1,0 4.5,0 8.9,0 13.3,0 0.3,0.8 -1.2,2.2 -2.2,1.8 -13.5,0 -27,0.1 -40.4,0.1 C 10.9,50 10.1,49 10,48.2 Z\" /> <path d=\"m 55.9,44.3 c 2.3,-0.4 0.4,2.7 -1,2.4 -6.3,-0.5 -12.6,-0.1 -19,-0.2 -8.9,0 -17.8,0.1 -26.64,0 -0.87,-0.1 -2.54,-2.4 -1.01,-2.1 1.3,0 2.35,0.5 3.75,0.3 14,0 28,0 42,0 0.4,-0.5 1.3,-0.3 1.9,-0.4 z\" /> </g> <g style=\"display: block\" transform=\"translate(-0.926,-0.465)\"> <path d=\"m 32,18.9 h 0.3 c 3.5,3.9 0,0 6.2,6.2 0.1,0.2 0.3,0.3 0.4,0.4 0.4,0.5 0.9,0.9 1.3,1.2 h 0.5 c 0.2,-0.3 0.5,-0.6 0.7,-0.9 l 0.5,0.2 c 0.2,0.2 0.2,0.2 0.5,0.6 1.8,2.2 7.5,7 14.7,14.3 0,0 0,0.6 -0.3,1.1 -0.3,0.5 -1.9,1.4 -2.8,1.4 C 46.8,43.1 45,42.9 37.7,43 30.4,43.1 17.7,43.2 10.4,43.4 8.45,43.5 7.45,41.1 7.77,40.8 11.2,37.4 14.9,34.2 18.5,31 21.6,28.3 31,20 32,18.9 Z m 0,2.7 c -7.6,6.3 -15,12.6 -22.2,19.3 -0.34,0.4 0.4,0.8 0.8,0.8 0.4,0 5.2,0.4 18.4,0.4 12.9,-0.2 12.4,-0.3 25.3,-0.5 0.8,-0.2 0.2,-0.6 0,-0.9 C 51,36.2 46,32.8 42.2,28.6 c -0.5,-0.4 -0.8,-0.6 -1.4,0 -3.8,4 -8.2,7.3 -11.9,11.4 -0.1,0.2 -0.5,0.8 -0.7,1 -0.6,0.1 -1.2,0.1 -1.8,0.1 -0.1,0 -0.4,-0.4 -0.1,-0.8 0.1,-0.1 2.1,-1.9 2.7,-2.4 7,-6.5 7.5,-6.7 10,-9.6 l -0.1,-0.5 c -2,-2.1 -4.2,-4.1 -6.3,-6.1 -0.2,-0.1 -0.3,-0.3 -0.6,-0.1 z\" class=\"pplg_mtn\" /> </g> <g class=\"pplg_sky\" transform=\"translate(-0.926,-0.465)\"> <path d=\"m 55.9,25.2 c 1,-0.4 1.7,0.8 1.1,1.5 -3.7,0.3 -7.4,0.3 -11.1,0.3 -0.9,-2 2.6,-1.1 3.7,-1.5 2.1,-0.1 4.2,-0.2 6.3,-0.3 z\" /> <path d=\"m 7.57,25.4 c 3.63,-0.1 7.23,0.2 10.83,0.4 1,1.5 -0.8,1.8 -1.9,1.4 -3,-0.3 -6,-0.3 -9.04,-0.4 -0.24,-0.3 -0.2,-1.1 0.11,-1.4 z\" /> <path d=\"m 54.5,19.1 c 0.7,-0.1 1.1,0.8 0.8,1.3 -2.4,1.2 -5.1,1.8 -7.5,2.9 -0.9,0.4 -3.2,1.4 -2.8,-0.5 3.2,-1.3 6.4,-2.3 9.5,-3.7 z\" /> <path d=\"m 9.58,19.1 c 2.22,0.7 4.32,1.6 6.52,2.4 1.1,0.7 2.4,0.9 3.4,1.6 0.1,0.9 -0.6,1.3 -1.3,0.8 -3,-1.3 -6.1,-2.3 -9.07,-3.6 0,-0.4 0.16,-0.8 0.45,-1.2 z\" /> <path d=\"m 51,14.8 c 2.3,1.1 -0.9,2.2 -1.8,3 -1.8,1.2 -3.6,2.4 -5.3,3.7 -1.3,0.3 -1.1,-1.8 0.2,-1.9 2.3,-1.6 4.6,-3.2 6.9,-4.8 z\" /> <path d=\"m 13.3,14.9 c 1.4,0.3 2.4,1.7 3.7,2.3 1.5,1.3 3.5,2.1 4.7,3.5 -0.2,1.7 -2.1,0 -2.7,-0.4 -2.2,-1.5 -4.3,-3 -6.4,-4.4 0,-0.4 0.3,-0.8 0.7,-1 z\" /> <path d=\"m 46.8,11.5 c 1.8,0.1 1.1,1.7 -0.1,2.3 -2.1,1.7 -3.6,4.1 -5.7,5.8 -1.7,-1 0.9,-2.2 1.4,-3.2 1.4,-1.6 3,-3.2 4.4,-4.9 z\" /> <path d=\"m 17.2,11.4 c 1.4,0.8 2.3,2.4 3.5,3.5 1.1,1.3 2.3,2.5 3.4,3.8 -0.4,1.3 -1.6,0.4 -2.1,-0.4 -1.9,-2 -3.8,-4 -5.6,-6.1 0.2,-0.3 0.5,-0.5 0.8,-0.8 z\" /> <path d=\"m 47.8,28.9 c 2.3,0.7 4.4,1.9 6.7,2.7 1.6,-0.2 1.3,2.4 -0.1,1.6 -2.2,-1.2 -4.7,-1.9 -6.9,-3 -0.1,-0.5 0,-0.9 0.3,-1.3 z\" /> <path d=\"m 15.6,29.3 c 1.6,-0.4 1.2,1.7 -0.2,1.5 -2,0.8 -4,1.5 -6.05,2.2 -0.79,-0.2 -0.95,-1.7 0,-1.6 2.15,-0.5 4.15,-1.4 6.25,-2.1 z\" /> </g> <g class=\"pplg_stars\" transform=\"translate(-0.926,-0.465)\"> <circle class=\"pplg_ceres\" cx=\"32.1\" cy=\"12.7\" r=\"7.19\" /> <path d=\"m 28.6,16.1 c 0.4,0 0.9,-0.2 1.2,0.2 0.3,0.3 0.3,0.9 -0.1,1.1 -0.3,0.3 -0.8,0.4 -1.2,0.1 -0.3,-0.2 -0.3,-0.6 -0.2,-1 0.1,-0.2 0.2,-0.3 0.3,-0.4 z\" class=\"pplg_crater\" /> <path d=\"m 28.2,11.9 c 0.4,-0.1 0.8,-0.1 1.1,0.2 0.3,0.2 0.7,0.6 0.6,1.1 0,0.3 -0.1,0.7 -0.3,1 -0.2,0.2 -0.6,0.4 -0.9,0.4 -0.6,0 -1.1,-0.4 -1.3,-0.9 -0.3,-0.4 -0.2,-0.9 0.2,-1.3 0.1,-0.2 0.3,-0.4 0.6,-0.5 z\" class=\"pplg_crater\" /> <path d=\"m 28.4,8.19 c 0.5,0 1.1,0.15 1.3,0.66 0.2,0.37 0.1,0.83 -0.2,1.08 -0.4,0.47 -1.2,0.37 -1.6,0 C 27.6,9.59 27.6,9.09 27.8,8.77 28,8.56 28.1,8.28 28.4,8.19 Z\" class=\"pplg_crater\" /> <path d=\"m 41.5,8.78 0.3,0.96 c 0.2,0.15 0.8,0.11 1,0.26 l -1,0.4 c -0.1,0.3 -0.2,0.8 -0.3,1 C 41.4,11.1 41.3,10.7 41.1,10.3 41,10.2 40.4,10.2 40.2,10.1 40.5,10 40.9,9.84 41.1,9.73 L 41.2,9.46 C 41.3,9.23 41.4,9 41.5,8.78 Z\" class=\"pplg_star\" /> </g> </svg>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"pp_hd_pict\">\n\t\t\t\t\t<span class=\"pp_hd_p_p\">P</span><span class=\"pp_hd_p_i\">I</span><span class=\"pp_hd_p_c\">C</span><span class=\"pp_hd_p_i\">T</span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"pp_hd_control\">\n\t\t\t\t\t<div class=\"pp_sz_con\">\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"lock_position\">\n\t\t\t\t\t\t\t<div class=\"pp_sz_icon off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-unlock\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 9.9-1\"></path></svg>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"pp_sz_icon on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-lock\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"pin_top\">\n\t\t\t\t\t\t\t<span class=\"off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M112 328l144-144 144 144\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M112 244l144-144 144 144M256 120v292\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"maximize_mode\">\n\t\t\t\t\t\t\t<span class=\"off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-minimize\"><path d=\"M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3\"></path></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"tab_mode\">\n\t\t\t\t\t\t\t<span class=\"off hover_on on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M160 256a16 16 0 0116-16h144V136c0-32-33.79-56-64-56H104a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h160a56.06 56.06 0 0056-56V272H176a16 16 0 01-16-16zM459.31 244.69l-80-80a16 16 0 00-22.62 22.62L409.37 240H320v32h89.37l-52.68 52.69a16 16 0 1022.62 22.62l80-80a16 16 0 000-22.62z\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"night_mode\">\n\t\t\t\t\t\t\t<span class=\"off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M264 480A232 232 0 0132 248c0-94 54-178.28 137.61-214.67a16 16 0 0121.06 21.06C181.07 76.43 176 104.66 176 136c0 110.28 89.72 200 200 200 31.34 0 59.57-5.07 81.61-14.67a16 16 0 0121.06 21.06C442.28 426 358 480 264 480z\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M256 118a22 22 0 01-22-22V48a22 22 0 0144 0v48a22 22 0 01-22 22zM256 486a22 22 0 01-22-22v-48a22 22 0 0144 0v48a22 22 0 01-22 22zM369.14 164.86a22 22 0 01-15.56-37.55l33.94-33.94a22 22 0 0131.11 31.11l-33.94 33.94a21.93 21.93 0 01-15.55 6.44zM108.92 425.08a22 22 0 01-15.55-37.56l33.94-33.94a22 22 0 1131.11 31.11l-33.94 33.94a21.94 21.94 0 01-15.56 6.45zM464 278h-48a22 22 0 010-44h48a22 22 0 010 44zM96 278H48a22 22 0 010-44h48a22 22 0 010 44zM403.08 425.08a21.94 21.94 0 01-15.56-6.45l-33.94-33.94a22 22 0 0131.11-31.11l33.94 33.94a22 22 0 01-15.55 37.56zM142.86 164.86a21.89 21.89 0 01-15.55-6.44l-33.94-33.94a22 22 0 0131.11-31.11l33.94 33.94a22 22 0 01-15.56 37.55zM256 358a102 102 0 11102-102 102.12 102.12 0 01-102 102z\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"pin_right\">\n\t\t\t\t\t\t\t<span class=\"off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M184 112l144 144-144 144\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M268 112l144 144-144 144M392 256H100\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"resize_handle\">\n\t\t\t\t\t\t\t<span class=\"off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M304 96l112 112M421.8 421.77L90.2 90.23\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M176 112l80-80 80 80M255.98 32l.02 448M176 400l80 80 80-80M400 176l80 80-80 80M112 176l-80 80 80 80M32 256h448\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"show_ui\">\n\t\t\t\t\t\t\t<span class=\"off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M400 256H112\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M64 164v244a56 56 0 0056 56h272a56 56 0 0056-56V164a4 4 0 00-4-4H68a4 4 0 00-4 4zm267 151.63l-63.69 63.68a16 16 0 01-22.62 0L181 315.63c-6.09-6.09-6.65-16-.85-22.38a16 16 0 0123.16-.56L240 329.37V224.45c0-8.61 6.62-16 15.23-16.43A16 16 0 01272 224v105.37l36.69-36.68a16 16 0 0123.16.56c5.8 6.37 5.24 16.29-.85 22.38z\"/><rect x=\"32\" y=\"48\" width=\"448\" height=\"80\" rx=\"32\" ry=\"32\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"unchecked\" data-i-toggle=\"show_navigation\">\n\t\t\t\t\t\t\t<span class=\"off hover_on\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><circle cx=\"256\" cy=\"256\" r=\"48\"/><circle cx=\"256\" cy=\"416\" r=\"48\"/><circle cx=\"256\" cy=\"96\" r=\"48\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"on hover_off\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"48\" d=\"M88 152h336M88 256h336M88 360h336\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"pp_nav\">\n\t\t\t\t<div class=\"pp_nav_elements\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"pp_content\">\n\t\t\t</div>\n\t\t</div>\n\n"
      };
    }, {}],
    18: [function (require, module, exports) {
      module.exports = {
        HTML: /*html*/"\n\n<div>\n\t<span data-nav=\"PP-ADB\"><a href=\"#\" onclick=\"_Pict.providers['PP-Router'].navigateTo('PP-ADB');\"><b class=\"pp_nav_short\">Ad</b><em class=\"pp_nav_long\">AppData</em></a></span>\n\t<span data-nav=\"PP-TB\"><a href=\"#\" onclick=\"_Pict.providers['PP-Router'].navigateTo('PP-TB');\"><b class=\"pp_nav_short\">Tp</b><em class=\"pp_nav_long\">Templates</em></a></span>\n\t<span data-nav=\"PP-VB\"><a href=\"#\" onclick=\"_Pict.providers['PP-Router'].navigateTo('PP-VB');\"><b class=\"pp_nav_short\">Vw</b><em class=\"pp_nav_long\">Views</em></a></span>\n\t<span data-nav=\"PP-PB\"><a href=\"#\" onclick=\"_Pict.providers['PP-Router'].navigateTo('PP-PB');\"><b class=\"pp_nav_short\">Pr</b><em class=\"pp_nav_long\">Providers</em></a></span>\n\t<span data-nav=\"PP-TO\"><a href=\"#\" onclick=\"_Pict.providers['PP-Router'].navigateTo('PP-TO');\"><b class=\"pp_nav_short\">Ov</b><em class=\"pp_nav_long\">Overrides</em></a></span>\n</div>\n\n"
      };
    }, {}],
    19: [function (require, module, exports) {
      const libPictProvider = require('pict-provider');
      const _DEFAULT_PROVIDER_CONFIGURATION = {
        ProviderIdentifier: 'PP-CSS-Hotloader',
        AutoInitialize: false,
        AutoSolveWithApp: false,
        CustomPanelCSS:
        // Not great but cute.
        // The order of these matter.
        // And this is still simpler to work with than slow-ass sass or less.
        require('../css/PP-Palette-CSS.js').CSS + require('../css/PP-Panel-CSS.js').CSS + require('../css/PP-Logo-CSS.js').CSS + require('../css/PP-AppDataBrowser-CSS.js').CSS + require('../css/PP-TemplateBrowser-CSS.js').CSS + require('../css/PP-ServiceBrowser-CSS.js').CSS + require('../css/PP-TemplateOverrides-CSS.js').CSS
      };
      class PictPanelCSSHotloader extends libPictProvider {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
          super(pFable, tmpOptions, pServiceHash);
          this.injectedCSS = false;
        }

        // TODO: This seems useful outside of the panel app ... maybe a core provider?
        hotloadCSS() {
          if (this.injectedCSS) return;

          // Load the custom CSS for the container into its own style tag
          let tmpCSSContainer = this.pict.ContentAssignment.getElement('#Pict-Panel-Container-CSS');
          // This does not use the PICT CSS functionality because we don't want to pollute whatever the normal app is doing with it.
          if (!Array.isArray(tmpCSSContainer) || tmpCSSContainer.length === 0) {
            try {
              let tmpCSS = document.createElement('style');
              tmpCSS.id = 'Pict-Panel-Container-CSS';
              tmpCSS.innerHTML = this.options.CustomPanelCSS;
              document.head.appendChild(tmpCSS);
            } catch (pError) {
              console.error('Error adding custom CSS to head in Pict-Panel onBeforeRender:', pError);
            }
          }
          this.injectedCSS = true;
          return true;
        }
      }
      module.exports = PictPanelCSSHotloader;
      module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
    }, {
      "../css/PP-AppDataBrowser-CSS.js": 10,
      "../css/PP-Logo-CSS.js": 11,
      "../css/PP-Palette-CSS.js": 12,
      "../css/PP-Panel-CSS.js": 13,
      "../css/PP-ServiceBrowser-CSS.js": 14,
      "../css/PP-TemplateBrowser-CSS.js": 15,
      "../css/PP-TemplateOverrides-CSS.js": 16,
      "pict-provider": 4
    }],
    20: [function (require, module, exports) {
      const libPictProvider = require('pict-provider');
      const _DEFAULT_PROVIDER_CONFIGURATION = {
        ProviderIdentifier: 'PP-ConfigStorage',
        AutoInitialize: false,
        AutoSolveWithApp: false,
        StorageKey: 'PictPanel'
      };
      class PictPanelConfigStorage extends libPictProvider {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
          super(pFable, tmpOptions, pServiceHash);
        }
        save(pUIState) {
          try {
            let tmpConfig = {
              Behaviors: Object.assign({}, pUIState.Behaviors),
              ManualTop: pUIState.ManualTop,
              ManualLeft: pUIState.ManualLeft,
              ManualWidth: pUIState.ManualWidth
            };

            // Also save current panel element position/size if available
            let tmpPanelElement = document.getElementById('Pict-Panel');
            if (tmpPanelElement) {
              tmpConfig.PanelStyle = {
                top: tmpPanelElement.style.top,
                left: tmpPanelElement.style.left,
                right: tmpPanelElement.style.right,
                width: tmpPanelElement.style.width,
                height: tmpPanelElement.style.height
              };
            }

            // Save the active navigation view hash
            if (this.pict.providers['PP-Router'] && this.pict.providers['PP-Router'].activeView) {
              tmpConfig.ActiveView = this.pict.providers['PP-Router'].activeView;
            }
            localStorage.setItem(this.options.StorageKey, JSON.stringify(tmpConfig));
          } catch (pError) {
            this.log.error('PP-ConfigStorage failed to save: ' + pError.message);
          }
        }
        load() {
          try {
            let tmpRaw = localStorage.getItem(this.options.StorageKey);
            if (!tmpRaw) return false;
            let tmpConfig = JSON.parse(tmpRaw);
            return tmpConfig;
          } catch (pError) {
            this.log.error('PP-ConfigStorage failed to load: ' + pError.message);
            return false;
          }
        }
        clear() {
          try {
            localStorage.removeItem(this.options.StorageKey);
          } catch (pError) {
            this.log.error('PP-ConfigStorage failed to clear: ' + pError.message);
          }
        }
        applyConfig(pMainView) {
          let tmpConfig = this.load();
          if (!tmpConfig) return false;

          // Apply saved behaviors
          if (tmpConfig.Behaviors) {
            let tmpKeys = Object.keys(tmpConfig.Behaviors);
            for (let i = 0; i < tmpKeys.length; i++) {
              if (tmpKeys[i] in pMainView.uiState.Behaviors) {
                pMainView.uiState.Behaviors[tmpKeys[i]] = tmpConfig.Behaviors[tmpKeys[i]];
              }
            }
          }

          // Apply saved manual position values
          if ('ManualTop' in tmpConfig) pMainView.uiState.ManualTop = tmpConfig.ManualTop;
          if ('ManualLeft' in tmpConfig) pMainView.uiState.ManualLeft = tmpConfig.ManualLeft;
          if ('ManualWidth' in tmpConfig) pMainView.uiState.ManualWidth = tmpConfig.ManualWidth;

          // Apply saved panel element styles after render
          if (tmpConfig.PanelStyle) {
            let tmpPanelElement = document.getElementById('Pict-Panel');
            if (tmpPanelElement) {
              if (tmpConfig.PanelStyle.top) tmpPanelElement.style.top = tmpConfig.PanelStyle.top;
              if (tmpConfig.PanelStyle.left) tmpPanelElement.style.left = tmpConfig.PanelStyle.left;
              if (tmpConfig.PanelStyle.right) tmpPanelElement.style.right = tmpConfig.PanelStyle.right;
              if (tmpConfig.PanelStyle.width) tmpPanelElement.style.width = tmpConfig.PanelStyle.width;
              if (tmpConfig.PanelStyle.height) tmpPanelElement.style.height = tmpConfig.PanelStyle.height;
            }
          }

          // Apply behavior-driven UI state
          let tmpPanelElement = document.getElementById('Pict-Panel');
          if (tmpPanelElement) {
            // Tab mode
            if (pMainView.uiState.Behaviors.tab_mode) {
              tmpPanelElement.classList.add('pp_tab_mode');
            }

            // Night mode class
            if (pMainView.uiState.Behaviors.night_mode) {
              tmpPanelElement.classList.add('pp_dark_mode');
            }

            // Resize handle lock
            if (!pMainView.uiState.Behaviors.resize_handle) {
              tmpPanelElement.classList.add('pp_no_resize');
            }

            // Pin right
            if (pMainView.uiState.Behaviors.pin_right) {
              tmpPanelElement.style.left = '';
              tmpPanelElement.style.right = '-3px';
            }

            // Pin top
            if (pMainView.uiState.Behaviors.pin_top) {
              tmpPanelElement.style.top = '-3px';
            }

            // show_ui hides nav + content
            if (!pMainView.uiState.Behaviors.show_ui) {
              let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
              let tmpContentElement = tmpPanelElement.querySelector('.pp_content');
              if (tmpNavElement) tmpNavElement.style.display = 'none';
              if (tmpContentElement) tmpContentElement.style.display = 'none';
            }

            // show_navigation hides nav
            if (!pMainView.uiState.Behaviors.show_navigation) {
              let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
              if (tmpNavElement) tmpNavElement.style.display = 'none';
            }
          }

          // Update all toggle icon displays
          pMainView.initializePanelIcons();

          // Restore the active navigation view
          if (tmpConfig.ActiveView && this.pict.providers['PP-Router']) {
            this.pict.providers['PP-Router'].navigateTo(tmpConfig.ActiveView);
          }
          return tmpConfig;
        }
      }
      module.exports = PictPanelConfigStorage;
      module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
    }, {
      "pict-provider": 4
    }],
    21: [function (require, module, exports) {
      const libPictProvider = require('pict-provider');
      const _DEFAULT_PROVIDER_CONFIGURATION = {
        ProviderIdentifier: 'PP-Router',
        AutoInitialize: false,
        AutoSolveWithApp: false
      };
      class PictPanelRouter extends libPictProvider {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
          super(pFable, tmpOptions, pServiceHash);
          this.activeView = false;
        }
        navigateTo(pViewHash) {
          if (this.activeView === pViewHash) {
            // TODO: Allow for subtlety in views reloading versus rendering
            return false;
          }
          if (pViewHash in this.pict.views) {
            this.activeView = pViewHash;
            this.pict.views[pViewHash].render();

            // Update the active nav highlight
            let tmpNavItems = document.querySelectorAll('#Pict-Panel .pp_nav span[data-nav]');
            for (let i = 0; i < tmpNavItems.length; i++) {
              if (tmpNavItems[i].getAttribute('data-nav') === pViewHash) {
                tmpNavItems[i].classList.add('pp_nav_active');
              } else {
                tmpNavItems[i].classList.remove('pp_nav_active');
              }
            }

            // Persist the active view selection
            if (this.pict.providers['PP-ConfigStorage'] && this.pict.views['PP-Main']) {
              this.pict.providers['PP-ConfigStorage'].save(this.pict.views['PP-Main'].uiState);
            }
          }
        }
      }
      module.exports = PictPanelRouter;
      module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
    }, {
      "pict-provider": 4
    }],
    22: [function (require, module, exports) {
      const libPictProvider = require('pict-provider');
      const _DEFAULT_PROVIDER_CONFIGURATION = {
        ProviderIdentifier: 'PP-TemplateOverrideStorage',
        AutoInitialize: false,
        AutoSolveWithApp: false,
        StorageKey: 'PictPanel-TemplateOverrides'
      };
      class PictPanelTemplateOverrideStorage extends libPictProvider {
        constructor(pFable, pOptions, pServiceHash) {
          let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
          super(pFable, tmpOptions, pServiceHash);
        }

        /**
         * Load all overrides from localStorage.
         * @returns {Object} Map of { TemplateHash: { Original, Override, Active } }
         */
        loadOverrides() {
          try {
            let tmpRaw = localStorage.getItem(this.options.StorageKey);
            if (!tmpRaw) return {};
            return JSON.parse(tmpRaw);
          } catch (pError) {
            this.log.error('PP-TemplateOverrideStorage failed to load: ' + pError.message);
            return {};
          }
        }

        /**
         * Persist the full overrides map to localStorage.
         */
        _persist(pOverrides) {
          try {
            localStorage.setItem(this.options.StorageKey, JSON.stringify(pOverrides));
          } catch (pError) {
            this.log.error('PP-TemplateOverrideStorage failed to save: ' + pError.message);
          }
        }

        /**
         * Save (or update) an override entry.
         * If this hash already has an override, only the Override content is updated.
         */
        saveOverride(pHash, pOriginal, pOverride) {
          let tmpOverrides = this.loadOverrides();
          if (tmpOverrides[pHash]) {
            // Already have an original snapshot -- just update the override content
            tmpOverrides[pHash].Override = pOverride;
            tmpOverrides[pHash].Active = true;
          } else {
            tmpOverrides[pHash] = {
              Original: pOriginal,
              Override: pOverride,
              Active: true
            };
          }
          this._persist(tmpOverrides);
          this.log.trace("Override saved for template [".concat(pHash, "]"));
        }

        /**
         * Remove an override entry and restore the original template.
         */
        removeOverride(pHash) {
          let tmpOverrides = this.loadOverrides();
          if (!tmpOverrides[pHash]) return;

          // Restore the original template before removing the entry
          let tmpOriginal = tmpOverrides[pHash].Original;
          this.pict.TemplateProvider.addTemplate(pHash, tmpOriginal);
          delete tmpOverrides[pHash];
          this._persist(tmpOverrides);
          this.log.trace("Override removed for template [".concat(pHash, "]"));
        }

        /**
         * Toggle a single override on or off.
         */
        toggleOverride(pHash, pActive) {
          let tmpOverrides = this.loadOverrides();
          if (!tmpOverrides[pHash]) return;
          tmpOverrides[pHash].Active = pActive;
          this._persist(tmpOverrides);
          if (pActive) {
            this.pict.TemplateProvider.addTemplate(pHash, tmpOverrides[pHash].Override);
          } else {
            this.pict.TemplateProvider.addTemplate(pHash, tmpOverrides[pHash].Original);
          }
          this.log.trace("Override for [".concat(pHash, "] set to ").concat(pActive ? 'active' : 'inactive'));
        }

        /**
         * Toggle all overrides on or off.
         */
        toggleAll(pActive) {
          let tmpOverrides = this.loadOverrides();
          let tmpHashes = Object.keys(tmpOverrides);
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            tmpOverrides[tmpHash].Active = pActive;
            if (pActive) {
              this.pict.TemplateProvider.addTemplate(tmpHash, tmpOverrides[tmpHash].Override);
            } else {
              this.pict.TemplateProvider.addTemplate(tmpHash, tmpOverrides[tmpHash].Original);
            }
          }
          this._persist(tmpOverrides);
          this.log.trace("All overrides set to ".concat(pActive ? 'active' : 'inactive'));
        }

        /**
         * Apply all active overrides. Called on panel init after page reload.
         */
        applyOverrides() {
          let tmpOverrides = this.loadOverrides();
          let tmpHashes = Object.keys(tmpOverrides);
          let tmpApplied = 0;
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            if (tmpOverrides[tmpHash].Active) {
              this.pict.TemplateProvider.addTemplate(tmpHash, tmpOverrides[tmpHash].Override);
              tmpApplied++;
            }
          }
          if (tmpApplied > 0) {
            this.log.info("Applied ".concat(tmpApplied, " template override(s)"));
          }
        }
      }
      module.exports = PictPanelTemplateOverrideStorage;
      module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
    }, {
      "pict-provider": 4
    }],
    23: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "PP-Panel",
        DefaultRenderable: "Pict-Panel-Container",
        DefaultDestinationAddress: "body",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "Pict-Panel-Container",
          Template: /*html*/"<div id=\"Pict-Panel-Container\"></div>"
        }],
        Renderables: [{
          RenderableHash: "Pict-Panel-Container",
          TemplateHash: "Pict-Panel-Container",
          ContentDestinationAddress: "body",
          RenderMethod: "append_once",
          TestAddress: "#Pict-Panel-Container"
        }]
      };
      class PictPanelContainer extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }
        onBeforeRender() {
          this.pict.providers['PP-CSS-Hotloader'].hotloadCSS();
        }
        onAfterRender() {
          this.pict.views['PP-Main'].render();
          return super.onAfterRender();
        }
      }
      module.exports = PictPanelContainer;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-view": 8
    }],
    24: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "PP-Main",
        DefaultRenderable: "PP-Main",
        DefaultDestinationAddress: "#Pict-Panel-Container",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "PP-Main",
          Template: require('../html/PP-Main-HTML.js').HTML
        }],
        Renderables: [{
          RenderableHash: "PP-Main",
          TemplateHash: "PP-Main",
          ContentDestinationAddress: "#Pict-Panel-Container"
        }]
      };
      class PictPanelMain extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.uiState = {
            Wired: false,
            Behaviors: {
              // Put the panel in tab mode
              tab_mode: false,
              // Make the panel header big or small
              maximize_mode: false,
              // Lock the position of the panel.
              lock_position: false,
              // Pin current top location to the top of the screen.
              pin_top: false,
              // Pin current right location to the right side of the screen.
              pin_right: false,
              night_mode: false,
              resize_handle: true,
              show_ui: true,
              show_navigation: true,
              visible: true
            },
            ManualTop: 0,
            ManualLeft: 0,
            ManualWidth: 300,
            // Saved position/size before maximize
            SavedPosition: false,
            // Saved position/size before tab mode
            SavedTabPosition: false
          };
        }
        onAfterRender() {
          // After rendering the panel, wire up the drag events.
          this.wireDragEvents();

          // Render the navigation
          this.pict.views['PP-Nav'].render();
          return super.onAfterRender();
        }
        updateUIBehaviorDisplay(pBehaviorHash) {
          let tmpBehaviorToggleElementAddress = "#Pict-Panel [data-i-toggle=".concat(pBehaviorHash, "]");
          let tmpBehaviorToggleElement = this.pict.ContentAssignment.getElement(tmpBehaviorToggleElementAddress);
          if (!tmpBehaviorToggleElement) return;
          let tmpBehaviorState = this.uiState.Behaviors[pBehaviorHash];
          if (tmpBehaviorState) {
            if (this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "unchecked")) {
              this.pict.ContentAssignment.removeClass(tmpBehaviorToggleElementAddress, "unchecked");
            }
            if (!this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "checked")) {
              this.pict.ContentAssignment.addClass(tmpBehaviorToggleElementAddress, "checked");
            }
          } else {
            if (this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "checked")) {
              this.pict.ContentAssignment.removeClass(tmpBehaviorToggleElementAddress, "checked");
            }
            if (!this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "unchecked")) {
              this.pict.ContentAssignment.addClass(tmpBehaviorToggleElementAddress, "unchecked");
            }
          }
        }
        toggleUIBehavior(pBehaviorHash) {
          this.log.trace("Toggling behavior ".concat(pBehaviorHash, " ..."));
          this.uiState.Behaviors[pBehaviorHash] = !this.uiState.Behaviors[pBehaviorHash];
          this.updateUIBehaviorDisplay(pBehaviorHash);
          let tmpPanelElement = document.getElementById('Pict-Panel');
          if (!tmpPanelElement) return;
          if (pBehaviorHash === 'maximize_mode') {
            if (this.uiState.Behaviors.maximize_mode) {
              // Save current position and size before maximizing
              this.uiState.SavedPosition = {
                top: tmpPanelElement.style.top,
                left: tmpPanelElement.style.left,
                right: tmpPanelElement.style.right,
                width: tmpPanelElement.style.width,
                minWidth: tmpPanelElement.style.minWidth,
                maxWidth: tmpPanelElement.style.maxWidth,
                height: tmpPanelElement.style.height,
                maxHeight: tmpPanelElement.style.maxHeight
              };

              // Maximize with 15px padding on all sides
              tmpPanelElement.style.top = '15px';
              tmpPanelElement.style.left = '15px';
              tmpPanelElement.style.right = '15px';
              tmpPanelElement.style.width = 'calc(100vw - 30px)';
              tmpPanelElement.style.minWidth = '0';
              tmpPanelElement.style.maxWidth = 'none';
              tmpPanelElement.style.height = 'calc(100vh - 30px)';
              tmpPanelElement.style.maxHeight = 'none';
            } else {
              // Restore saved position and size
              if (this.uiState.SavedPosition) {
                tmpPanelElement.style.top = this.uiState.SavedPosition.top;
                tmpPanelElement.style.left = this.uiState.SavedPosition.left;
                tmpPanelElement.style.right = this.uiState.SavedPosition.right;
                tmpPanelElement.style.width = this.uiState.SavedPosition.width;
                tmpPanelElement.style.minWidth = this.uiState.SavedPosition.minWidth;
                tmpPanelElement.style.maxWidth = this.uiState.SavedPosition.maxWidth;
                tmpPanelElement.style.height = this.uiState.SavedPosition.height;
                tmpPanelElement.style.maxHeight = this.uiState.SavedPosition.maxHeight;
                this.uiState.SavedPosition = false;
              } else {
                // No saved position -- reset to defaults
                tmpPanelElement.style.top = '';
                tmpPanelElement.style.left = '';
                tmpPanelElement.style.right = '';
                tmpPanelElement.style.width = '';
                tmpPanelElement.style.minWidth = '';
                tmpPanelElement.style.maxWidth = '';
                tmpPanelElement.style.height = '';
                tmpPanelElement.style.maxHeight = '';
              }
            }
          }
          if (pBehaviorHash === 'tab_mode') {
            if (this.uiState.Behaviors.tab_mode) {
              // Save current position/size before collapsing
              this.uiState.SavedTabPosition = {
                top: tmpPanelElement.style.top,
                left: tmpPanelElement.style.left,
                right: tmpPanelElement.style.right,
                width: tmpPanelElement.style.width,
                minWidth: tmpPanelElement.style.minWidth,
                maxWidth: tmpPanelElement.style.maxWidth,
                height: tmpPanelElement.style.height,
                maxHeight: tmpPanelElement.style.maxHeight
              };
              // Clear inline styles so the CSS class takes effect
              tmpPanelElement.style.top = '';
              tmpPanelElement.style.left = '';
              tmpPanelElement.style.right = '';
              tmpPanelElement.style.width = '';
              tmpPanelElement.style.minWidth = '';
              tmpPanelElement.style.maxWidth = '';
              tmpPanelElement.style.height = '';
              tmpPanelElement.style.maxHeight = '';
              tmpPanelElement.classList.add('pp_tab_mode');
            } else {
              tmpPanelElement.classList.remove('pp_tab_mode');
              // Restore saved position/size
              if (this.uiState.SavedTabPosition) {
                tmpPanelElement.style.top = this.uiState.SavedTabPosition.top;
                tmpPanelElement.style.left = this.uiState.SavedTabPosition.left;
                tmpPanelElement.style.right = this.uiState.SavedTabPosition.right;
                tmpPanelElement.style.width = this.uiState.SavedTabPosition.width;
                tmpPanelElement.style.minWidth = this.uiState.SavedTabPosition.minWidth;
                tmpPanelElement.style.maxWidth = this.uiState.SavedTabPosition.maxWidth;
                tmpPanelElement.style.height = this.uiState.SavedTabPosition.height;
                tmpPanelElement.style.maxHeight = this.uiState.SavedTabPosition.maxHeight;
                this.uiState.SavedTabPosition = false;
              }
            }
          }
          if (pBehaviorHash === 'resize_handle') {
            if (this.uiState.Behaviors.resize_handle) {
              tmpPanelElement.classList.remove('pp_no_resize');
            } else {
              tmpPanelElement.classList.add('pp_no_resize');
            }
          }
          if (pBehaviorHash === 'pin_right') {
            if (this.uiState.Behaviors.pin_right) {
              tmpPanelElement.style.left = '';
              tmpPanelElement.style.right = '-3px';
            }
          }
          if (pBehaviorHash === 'pin_top') {
            if (this.uiState.Behaviors.pin_top) {
              tmpPanelElement.style.top = '-3px';
            }
          }
          if (pBehaviorHash === 'show_ui') {
            let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
            let tmpContentElement = tmpPanelElement.querySelector('.pp_content');
            let tmpDisplay = this.uiState.Behaviors.show_ui ? '' : 'none';
            if (tmpNavElement) {
              tmpNavElement.style.display = tmpDisplay;
            }
            if (tmpContentElement) {
              tmpContentElement.style.display = tmpDisplay;
            }
            // When maximized, collapse height to just the header bar
            if (this.uiState.Behaviors.maximize_mode) {
              if (!this.uiState.Behaviors.show_ui) {
                tmpPanelElement.style.height = 'auto';
                tmpPanelElement.style.maxHeight = 'none';
              } else {
                tmpPanelElement.style.height = 'calc(100vh - 30px)';
                tmpPanelElement.style.maxHeight = 'none';
              }
            }
          }
          if (pBehaviorHash === 'show_navigation') {
            let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
            if (tmpNavElement) {
              tmpNavElement.style.display = this.uiState.Behaviors.show_navigation && this.uiState.Behaviors.show_ui ? '' : 'none';
            }
          }
          if (pBehaviorHash === 'night_mode') {
            if (this.uiState.Behaviors.night_mode) {
              tmpPanelElement.classList.add('pp_dark_mode');
            } else {
              tmpPanelElement.classList.remove('pp_dark_mode');
            }
          }

          // Persist config after every toggle
          if (this.pict.providers['PP-ConfigStorage']) {
            this.pict.providers['PP-ConfigStorage'].save(this.uiState);
          }
        }
        initializePanelIcons() {
          let tmpBehaviors = Object.keys(this.uiState.Behaviors);
          for (let i = 0; i < tmpBehaviors.length; i++) {
            this.updateUIBehaviorDisplay(tmpBehaviors[i]);
          }
        }
        wireDragEvents() {
          if (this.uiState.Wired) return;
          let __View = this;

          // Setup the draggable behavior for the window
          let tmpPanelElement = document.getElementById('Pict-Panel');
          let tmpPanelDragElement = document.getElementById('Pict-Panel-Drag');
          if (!tmpPanelElement) return;
          if (!tmpPanelDragElement) return;
          tmpPanelDragElement.addEventListener('mousedown',
          /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
           * BEGIN of browser event code block
           *
           * The below code is meant to run in response to a browser event.
           * --> Therefore the "this" context is the element that fired the event.
           * --> There is passed in a "__View" reference to this view.
           * --> Happy trails.
           */
          function (pEvent) {
            pEvent.preventDefault();
            let tmpOffsetX = pEvent.offsetX + tmpPanelDragElement.clientLeft;
            let tmpOffsetY = pEvent.offsetY + tmpPanelDragElement.clientTop;
            function dragHandler(pEvent) {
              pEvent.preventDefault();
              pEvent.stopPropagation();
              if (__View.uiState.Behaviors.tab_mode) {
                // In tab mode, only allow horizontal drag along the top
                // Must set right to 'auto' to override the CSS class rule
                tmpPanelElement.style.right = 'auto';
                tmpPanelElement.style.left = pEvent.clientX - tmpOffsetX + 'px';
                return;
              }
              if (__View.uiState.Behaviors.lock_position) return;
              if (!__View.uiState.Behaviors.pin_right) {
                tmpPanelElement.style.right = '';
                tmpPanelElement.style.left = pEvent.clientX - tmpOffsetX + 'px';
              }
              if (!__View.uiState.Behaviors.pin_top) {
                tmpPanelElement.style.top = pEvent.clientY - tmpOffsetY + 'px';
              }
            }
            function dragStop(pEvent) {
              window.removeEventListener('pointermove', dragHandler);
              window.removeEventListener('pointerup', dragStop);
              // Persist position after drag
              if (__View.pict.providers['PP-ConfigStorage']) {
                __View.pict.providers['PP-ConfigStorage'].save(__View.uiState);
              }
            }
            window.addEventListener('pointermove', dragHandler);
            window.addEventListener('pointerup', dragStop);
          });
          /*
           * END of browser event code block
           * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

          // Double-click on drag handle expands panel from tab mode
          tmpPanelDragElement.addEventListener('dblclick', function (pEvent) {
            if (__View.uiState.Behaviors.tab_mode) {
              __View.toggleUIBehavior('tab_mode');
            }
          });
          let tmpUIBehaviorIcons = this.pict.ContentAssignment.getElement('#Pict-Panel .pp_sz_con div');
          for (let i = 0; i < tmpUIBehaviorIcons.length; i++) {
            /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
             * START of browser event code block
             *
             * Same same as above.
             */
            tmpUIBehaviorIcons[i].addEventListener('click', function (pEvent) {
              if ('currentTarget' in pEvent && 'attributes' in pEvent.currentTarget) {
                let tmpToggleProperty = pEvent.currentTarget.attributes['data-i-toggle'];
                __View.toggleUIBehavior(tmpToggleProperty.value);
              } else {
                __View.log.error("Pict-Panel toggleUIBehavior handler received an invalid event object.");
              }
            });
            /*
             * END of browser event code block
             * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
          }
          this.initializePanelIcons();
          this.uiState.Wired = true;
        }
      }
      module.exports = PictPanelMain;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "../html/PP-Main-HTML.js": 17,
      "pict-view": 8
    }],
    25: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Panel-Nav",
        DefaultRenderable: "PP-Nav",
        DefaultDestinationAddress: "#Pict-Panel .pp_nav_elements",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "PP-Nav",
          Template: require('../html/PP-Nav-HTML.js').HTML
        }],
        Renderables: [{
          RenderableHash: "PP-Nav",
          TemplateHash: "PP-Nav",
          ContentDestinationAddress: "#Pict-Panel .pp_nav_elements"
        }]
      };
      class PictPanelNav extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }
        onAfterRender() {
          // Show the last view we had loaded
          this.pict.views['PP-ADB'].render();
        }
      }
      module.exports = PictPanelNav;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "../html/PP-Nav-HTML.js": 18,
      "pict-view": 8
    }],
    26: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const libPictTemplate = require('pict-template');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Panel-AppDataBrowser",
        DefaultRenderable: "PP-AppDataBrowser",
        DefaultDestinationAddress: "#Pict-Panel .pp_content",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "PP-AppDataBrowser",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_adb_container\">\n\t\t\t\t\t<div class=\"pp_adb_header\">\n\t\t\t\t\t\t<span class=\"pp_adb_header_label\">AppData</span>\n\t\t\t\t\t\t<div class=\"pp_adb_header_actions\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-ADB'].downloadAppData(); return false;\" title=\"Download AppData as JSON\">dl</a>\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-ADB'].editAppData(); return false;\" title=\"Edit AppData JSON\">ed</a>\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_refresh_btn\" onclick=\"_Pict.views['PP-ADB'].render(); return false;\" title=\"Refresh\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"14\" height=\"14\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"32\" d=\"M320 146s24.36-12-64-12a160 160 0 10160 160\"/><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M256 58l80 80-80 80\"/></svg>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_adb_editor\" id=\"pp_adb_editor\" style=\"display:none;\">\n\t\t\t\t\t\t<textarea class=\"pp_adb_editor_textarea\" id=\"pp_adb_editor_textarea\"></textarea>\n\t\t\t\t\t\t<div class=\"pp_adb_editor_actions\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_editor_save\" onclick=\"_Pict.views['PP-ADB'].saveAppData(); return false;\">save</a>\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_editor_cancel\" onclick=\"_Pict.views['PP-ADB'].closeEditor(); return false;\">cancel</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_adb_root pp_adb_target\" data-i-objectpath=\"{~D:Context[0].rootAddress~}\" data-i-parentpath=\"\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-AppDataEntry-Leaf",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_adb_entry pp_adb_leaf\">\n\t\t\t\t\t<div class=\"pp_adb_datarow\">\n\t\t\t\t\t\t<div class=\"pp_adb_record_metadata\">\n\t\t\t\t\t\t\t<span class=\"pp_adb_key\">{~D:Record.Key~}</span>\n\t\t\t\t\t\t\t<span class=\"pp_adb_type\">{~D:Record.DataType~}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"pp_adb_record_data\">\n\t\t\t\t\t\t\t<span class=\"pp_adb_value pp_adb_value_{~D:Record.DataType~}\">{~D:Record.Value~}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-AppDataEntry-Branch",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_adb_entry pp_adb_branch\">\n\t\t\t\t\t<div class=\"pp_adb_datarow pp_adb_expandable\" onclick=\"_Pict.views['PP-ADB'].toggleChildTree('{~D:Record.ParentPath~}','{~D:Record.ObjectPath~}','{~D:Record.Key~}'); return false;\">\n\t\t\t\t\t\t<div class=\"pp_adb_record_metadata\">\n\t\t\t\t\t\t\t<span class=\"pp_adb_expand_icon pp_adb_collapsed\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"12\" height=\"12\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M184 112l144 144-144 144\"/></svg>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"pp_adb_key\">{~D:Record.Key~}</span>\n\t\t\t\t\t\t\t<span class=\"pp_adb_type\">{~D:Record.DataType~}</span>\n\t\t\t\t\t\t\t<span class=\"pp_adb_count\">{~D:Record.ChildCount~}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_adb_children pp_adb_target\" data-i-objectpath=\"{~D:Record.ObjectPath~}\" data-i-parentpath=\"{~D:Record.ParentPath~}\" style=\"display:none;\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }],
        Renderables: [{
          RenderableHash: "PP-AppDataBrowser",
          TemplateHash: "PP-AppDataBrowser",
          ContentDestinationAddress: "#Pict-Panel .pp_content"
        }]
      };
      class PictPanelAppDataBrowser extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.prototypeTemplate = new libPictTemplate(this.pict, libPictTemplate.default_configuration);
          this.rootAddress = 'AppData';
        }
        onAfterRender() {
          return this.renderChildTree('', this.rootAddress, '');
        }
        downloadAppData() {
          let tmpData = JSON.stringify(this.pict.AppData, null, '\t');
          let tmpBlob = new Blob([tmpData], {
            type: 'application/json'
          });
          let tmpURL = URL.createObjectURL(tmpBlob);
          let tmpLink = document.createElement('a');
          tmpLink.href = tmpURL;
          tmpLink.download = 'AppData.json';
          document.body.appendChild(tmpLink);
          tmpLink.click();
          document.body.removeChild(tmpLink);
          URL.revokeObjectURL(tmpURL);
        }
        editAppData() {
          let tmpEditor = document.getElementById('pp_adb_editor');
          let tmpTextarea = document.getElementById('pp_adb_editor_textarea');
          if (!tmpEditor || !tmpTextarea) return;
          tmpTextarea.value = JSON.stringify(this.pict.AppData, null, '\t');
          tmpEditor.style.display = 'block';
          tmpTextarea.focus();
        }
        saveAppData() {
          let tmpTextarea = document.getElementById('pp_adb_editor_textarea');
          if (!tmpTextarea) return;
          try {
            let tmpNewData = JSON.parse(tmpTextarea.value);
            // Replace AppData contents
            let tmpKeys = Object.keys(this.pict.AppData);
            for (let i = 0; i < tmpKeys.length; i++) {
              delete this.pict.AppData[tmpKeys[i]];
            }
            Object.assign(this.pict.AppData, tmpNewData);
            this.closeEditor();
            this.render();
          } catch (pError) {
            this.log.error('Invalid JSON: ' + pError.message);
            tmpTextarea.classList.add('pp_adb_editor_error');
            setTimeout(() => {
              tmpTextarea.classList.remove('pp_adb_editor_error');
            }, 1500);
          }
        }
        closeEditor() {
          let tmpEditor = document.getElementById('pp_adb_editor');
          if (tmpEditor) tmpEditor.style.display = 'none';
        }
        getValueSummary(pValue) {
          if (pValue === null) {
            return 'null';
          }
          if (pValue === undefined) {
            return 'undefined';
          }
          if (Array.isArray(pValue)) {
            return "Array(".concat(pValue.length, ")");
          }
          if (typeof pValue === 'object') {
            let tmpKeys = Object.keys(pValue);
            return "{".concat(tmpKeys.length, " keys}");
          }
          let tmpStr = String(pValue);
          if (tmpStr.length > 80) {
            return tmpStr.substring(0, 77) + '...';
          }
          return tmpStr;
        }
        isExpandable(pValue) {
          if (pValue === null || pValue === undefined) {
            return false;
          }
          if (Array.isArray(pValue)) {
            return pValue.length > 0;
          }
          if (typeof pValue === 'object') {
            return Object.keys(pValue).length > 0;
          }
          return false;
        }
        getDataType(pValue) {
          if (pValue === null) {
            return 'null';
          }
          if (Array.isArray(pValue)) {
            return 'array';
          }
          return typeof pValue;
        }
        getChildCount(pValue) {
          if (Array.isArray(pValue)) {
            return "[".concat(pValue.length, "]");
          }
          if (typeof pValue === 'object' && pValue !== null) {
            return "{".concat(Object.keys(pValue).length, "}");
          }
          return '';
        }
        toggleChildTree(pParentPath, pObjectPath, pKey) {
          let tmpTargetElementAddress = "#Pict-Panel div.pp_adb_target[data-i-parentpath=\"".concat(pParentPath, "\"][data-i-objectpath=\"").concat(pObjectPath, "\"]");
          let tmpTargetElement = this.pict.ContentAssignment.getElement(tmpTargetElementAddress);
          if (!tmpTargetElement || !tmpTargetElement.length) {
            this.log.error("PP ADB could not find target element for Parent[".concat(pParentPath, "] Object[").concat(pObjectPath, "] key [").concat(pKey, "]."));
            return false;
          }
          let tmpElement = tmpTargetElement[0];
          let tmpParentEntry = tmpElement.closest('.pp_adb_branch');
          let tmpExpandIcon = tmpParentEntry ? tmpParentEntry.querySelector('.pp_adb_expand_icon') : null;
          if (tmpElement.style.display === 'none') {
            // Expand: render children if not yet populated
            if (tmpElement.innerHTML.trim() === '') {
              this.renderChildTree(pParentPath, pObjectPath, pKey);
            }
            tmpElement.style.display = 'block';
            if (tmpExpandIcon) {
              tmpExpandIcon.classList.remove('pp_adb_collapsed');
              tmpExpandIcon.classList.add('pp_adb_expanded');
            }
          } else {
            // Collapse
            tmpElement.style.display = 'none';
            if (tmpExpandIcon) {
              tmpExpandIcon.classList.remove('pp_adb_expanded');
              tmpExpandIcon.classList.add('pp_adb_collapsed');
            }
          }
        }
        renderChildTree(pParentPath, pObjectPath, pKey) {
          let tmpTargetElementAddress = "#Pict-Panel div.pp_adb_target[data-i-parentpath=\"".concat(pParentPath, "\"][data-i-objectpath=\"").concat(pObjectPath, "\"]");
          let tmpTargetElement = this.pict.ContentAssignment.getElement(tmpTargetElementAddress);
          if (!tmpTargetElement) {
            this.log.error("PP ADB could not find target element to render to for Parent[".concat(pParentPath, "] Object[").concat(pObjectPath, "] key [").concat(pKey, "]."));
            return false;
          }
          let tmpObject = this.prototypeTemplate.resolveStateFromAddress(pObjectPath);
          let tmpLeaves = [];
          let tmpBranches = [];
          if (Array.isArray(tmpObject)) {
            for (let i = 0; i < tmpObject.length; i++) {
              let tmpValue = tmpObject[i];
              let tmpEntry = {
                Key: i,
                Value: this.getValueSummary(tmpValue),
                ParentPath: pObjectPath,
                ObjectPath: "".concat(pObjectPath, "[").concat(i, "]"),
                DataType: this.getDataType(tmpValue),
                ChildCount: this.getChildCount(tmpValue)
              };
              if (this.isExpandable(tmpValue)) {
                tmpBranches.push(tmpEntry);
              } else {
                tmpLeaves.push(tmpEntry);
              }
            }
          } else if (typeof tmpObject === 'object' && tmpObject !== null) {
            let tmpObjectEntries = Object.keys(tmpObject);
            for (let i = 0; i < tmpObjectEntries.length; i++) {
              let tmpValueKey = tmpObjectEntries[i];
              let tmpValue = tmpObject[tmpValueKey];
              let tmpEntry = {
                Key: tmpValueKey,
                Value: this.getValueSummary(tmpValue),
                ParentPath: pObjectPath,
                ObjectPath: "".concat(pObjectPath, ".").concat(tmpValueKey),
                DataType: this.getDataType(tmpValue),
                ChildCount: this.getChildCount(tmpValue)
              };
              if (this.isExpandable(tmpValue)) {
                tmpBranches.push(tmpEntry);
              } else {
                tmpLeaves.push(tmpEntry);
              }
            }
          } else {
            // Scalar value at root -- show it directly
            let tmpOutput = "<div class=\"pp_adb_scalar_value\">".concat(this.getValueSummary(tmpObject), "</div>");
            this.pict.ContentAssignment.assignContent(tmpTargetElementAddress, tmpOutput);
            return tmpOutput;
          }

          // Render leaves first (simple values), then branches (expandable)
          let tmpOutput = '';
          if (tmpLeaves.length > 0) {
            tmpOutput += this.pict.parseTemplateSetByHash('PP-AppDataEntry-Leaf', tmpLeaves, null, [this]);
          }
          if (tmpBranches.length > 0) {
            tmpOutput += this.pict.parseTemplateSetByHash('PP-AppDataEntry-Branch', tmpBranches, null, [this]);
          }
          this.pict.ContentAssignment.assignContent(tmpTargetElementAddress, tmpOutput);
          return tmpOutput;
        }
      }
      module.exports = PictPanelAppDataBrowser;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-template": 6,
      "pict-view": 8
    }],
    27: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Panel-ProviderBrowser",
        DefaultRenderable: "PP-ProviderBrowser",
        DefaultDestinationAddress: "#Pict-Panel .pp_content",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "PP-ProviderBrowser",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_sb_container\" id=\"pp_pb_container\">\n\t\t\t\t\t<div class=\"pp_adb_header\">\n\t\t\t\t\t\t<span class=\"pp_adb_header_label\">Providers</span>\n\t\t\t\t\t\t<div class=\"pp_adb_header_actions\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_refresh_btn\" onclick=\"_Pict.views['PP-PB'].showList(); return false;\" title=\"Refresh\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"14\" height=\"14\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"32\" d=\"M320 146s24.36-12-64-12a160 160 0 10160 160\"/><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M256 58l80 80-80 80\"/></svg>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_body\" id=\"pp_pb_body\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-ProviderEntry",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_sb_entry\">\n\t\t\t\t\t<div class=\"pp_sb_entry_row\">\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_entry_hash\" onclick=\"_Pict.views['PP-PB'].showDetail('{~D:Record.Hash~}'); return false;\">{~D:Record.Hash~}</a>\n\t\t\t\t\t\t<span class=\"pp_sb_entry_info\">{~D:Record.Info~}</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-ProviderDetail",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_sb_detail\">\n\t\t\t\t\t<div class=\"pp_sb_detail_header\">\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_back_btn\" onclick=\"_Pict.views['PP-PB'].showList(); return false;\" title=\"Back to list\">\n\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"14\" height=\"14\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M328 112L184 256l144 144\"/></svg>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<span class=\"pp_sb_detail_hash\">{~D:Record.Hash~}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_vitals\">\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">UUID</span><span class=\"pp_sb_vital_val\">{~D:Record.UUID~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">AutoInitialize</span><span class=\"pp_sb_vital_val\">{~D:Record.AutoInit~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">AutoSolve</span><span class=\"pp_sb_vital_val\">{~D:Record.AutoSolve~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Initialized</span><span class=\"pp_sb_vital_val\">{~D:Record.InitTS~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Last Solve</span><span class=\"pp_sb_vital_val\">{~D:Record.SolveTS~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Templates</span><span class=\"pp_sb_vital_val\">{~D:Record.TemplateCount~}</span></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_detail_actions\">\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_detail_action_btn\" onclick=\"_Pict.views['PP-PB'].execProviderAction('{~D:Record.Hash~}','solve'); return false;\" title=\"solve()\">solve</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_detail_section_label\">Options</div>\n\t\t\t\t\t<div class=\"pp_sb_detail_options\" id=\"pp_pb_detail_options\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }],
        Renderables: [{
          RenderableHash: "PP-ProviderBrowser",
          TemplateHash: "PP-ProviderBrowser",
          ContentDestinationAddress: "#Pict-Panel .pp_content"
        }]
      };
      class PictPanelProviderBrowser extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.detailHash = false;
        }
        onAfterRender() {
          this.showList();
        }
        getProviderEntries() {
          let tmpProviders = this.pict.providers;
          let tmpHashes = Object.keys(tmpProviders);
          let tmpEntries = [];
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            let tmpProvider = tmpProviders[tmpHash];
            let tmpInfo = tmpProvider.serviceType || '';
            tmpEntries.push({
              Hash: tmpHash,
              Info: tmpInfo
            });
          }
          tmpEntries.sort(function (a, b) {
            return a.Hash.localeCompare(b.Hash);
          });
          return tmpEntries;
        }
        showList() {
          this.detailHash = false;
          let tmpEntries = this.getProviderEntries();
          let tmpOutput = '';
          if (tmpEntries.length > 0) {
            tmpOutput = this.pict.parseTemplateSetByHash('PP-ProviderEntry', tmpEntries, null, [this]);
          } else {
            tmpOutput = '<div class="pp_tb_empty">No providers registered.</div>';
          }
          this.pict.ContentAssignment.assignContent('#pp_pb_body', tmpOutput);
        }
        formatTimestamp(pTimestamp) {
          if (!pTimestamp) return '--';
          let tmpDate = new Date(pTimestamp);
          return tmpDate.toLocaleTimeString();
        }
        showDetail(pHash) {
          let tmpProvider = this.pict.providers[pHash];
          if (!tmpProvider) return;
          this.detailHash = pHash;
          let tmpTemplateCount = 0;
          if (tmpProvider.options && tmpProvider.options.Templates) {
            tmpTemplateCount = tmpProvider.options.Templates.length;
          }
          let tmpRecord = [{
            Hash: pHash,
            UUID: tmpProvider.UUID || '--',
            AutoInit: tmpProvider.options && tmpProvider.options.AutoInitialize ? 'true' : 'false',
            AutoSolve: tmpProvider.options && tmpProvider.options.AutoSolveWithApp ? 'true' : 'false',
            InitTS: this.formatTimestamp(tmpProvider.initializeTimestamp),
            SolveTS: this.formatTimestamp(tmpProvider.lastSolvedTimestamp),
            TemplateCount: tmpTemplateCount
          }];
          let tmpOutput = this.pict.parseTemplateSetByHash('PP-ProviderDetail', tmpRecord, null, [this]);
          this.pict.ContentAssignment.assignContent('#pp_pb_body', tmpOutput);

          // Show a summary of options (non-function, non-template keys)
          this.renderDetailOptions(tmpProvider);
        }
        renderDetailOptions(pProvider) {
          if (!pProvider.options) return;
          let tmpKeys = Object.keys(pProvider.options);
          let tmpOutput = '<div class="pp_sb_detail_opts_list">';
          for (let i = 0; i < tmpKeys.length; i++) {
            let tmpKey = tmpKeys[i];
            let tmpVal = pProvider.options[tmpKey];

            // Skip large objects and arrays (Templates, Manifests, etc.)
            if (tmpKey === 'Templates' || tmpKey === 'DefaultTemplates' || tmpKey === 'Manifests') continue;
            if (typeof tmpVal === 'function') continue;
            let tmpDisplayVal = '';
            if (tmpVal === null) {
              tmpDisplayVal = '<span class="pp_adb_value_null">null</span>';
            } else if (typeof tmpVal === 'object') {
              tmpDisplayVal = JSON.stringify(tmpVal).substring(0, 80);
              tmpDisplayVal = tmpDisplayVal.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            } else if (typeof tmpVal === 'boolean') {
              tmpDisplayVal = '<span class="pp_adb_value_boolean">' + String(tmpVal) + '</span>';
            } else if (typeof tmpVal === 'number') {
              tmpDisplayVal = '<span class="pp_adb_value_number">' + tmpVal + '</span>';
            } else {
              let tmpStr = String(tmpVal);
              if (tmpStr.length > 60) {
                tmpStr = tmpStr.substring(0, 57) + '...';
              }
              tmpDisplayVal = tmpStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            tmpOutput += '<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">' + tmpKey + '</span><span class="pp_sb_vital_val">' + tmpDisplayVal + '</span></div>';
          }
          tmpOutput += '</div>';
          this.pict.ContentAssignment.assignContent('#pp_pb_detail_options', tmpOutput);
        }
        execProviderAction(pHash, pAction) {
          let tmpProvider = this.pict.providers[pHash];
          if (!tmpProvider) return;
          this.log.info("Executing ".concat(pAction, "() on provider [").concat(pHash, "]"));
          if (typeof tmpProvider[pAction] === 'function') {
            tmpProvider[pAction]();
          }

          // Refresh the detail view to show updated timestamps
          let __View = this;
          setTimeout(function () {
            if (__View.detailHash === pHash) __View.showDetail(pHash);
          }, 250);
        }
      }
      module.exports = PictPanelProviderBrowser;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-view": 8
    }],
    28: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Panel-TemplateBrowser",
        DefaultRenderable: "PP-TemplateBrowser",
        DefaultDestinationAddress: "#Pict-Panel .pp_content",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "PP-TemplateBrowser",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_tb_container\">\n\t\t\t\t\t<div class=\"pp_adb_header\">\n\t\t\t\t\t\t<span class=\"pp_adb_header_label\">Templates</span>\n\t\t\t\t\t\t<div class=\"pp_adb_header_actions\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_refresh_btn\" onclick=\"_Pict.views['PP-TB'].render(); return false;\" title=\"Refresh\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"14\" height=\"14\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"32\" d=\"M320 146s24.36-12-64-12a160 160 0 10160 160\"/><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M256 58l80 80-80 80\"/></svg>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_tb_filter\">\n\t\t\t\t\t\t<input type=\"text\" class=\"pp_tb_filter_input\" id=\"pp_tb_filter_input\" placeholder=\"filter templates...\" oninput=\"_Pict.views['PP-TB'].filterTemplates(this.value);\" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_tb_editor\" id=\"pp_tb_editor\" style=\"display:none;\">\n\t\t\t\t\t\t<div class=\"pp_tb_editor_header\">\n\t\t\t\t\t\t\t<span class=\"pp_tb_editor_hash\" id=\"pp_tb_editor_hash\"></span>\n\t\t\t\t\t\t\t<div class=\"pp_adb_header_actions\">\n\t\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_editor_save\" onclick=\"_Pict.views['PP-TB'].saveTemplate(); return false;\">save</a>\n\t\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_editor_cancel\" onclick=\"_Pict.views['PP-TB'].closeEditor(); return false;\">cancel</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<textarea class=\"pp_adb_editor_textarea pp_tb_editor_textarea\" id=\"pp_tb_editor_textarea\"></textarea>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_tb_list\" id=\"pp_tb_list\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-TemplateEntry",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_tb_entry\" data-i-hash=\"{~D:Record.Hash~}\">\n\t\t\t\t\t<div class=\"pp_tb_entry_row\">\n\t\t\t\t\t\t<span class=\"pp_tb_entry_hash\">{~D:Record.Hash~}</span>\n\t\t\t\t\t\t<span class=\"pp_tb_entry_source\">{~D:Record.Source~}</span>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-TB'].editTemplate('{~D:Record.Hash~}'); return false;\" title=\"Edit template\">ed</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_tb_entry_preview\">{~D:Record.Preview~}</div>\n\t\t\t\t</div>\n"
        }],
        Renderables: [{
          RenderableHash: "PP-TemplateBrowser",
          TemplateHash: "PP-TemplateBrowser",
          ContentDestinationAddress: "#Pict-Panel .pp_content"
        }]
      };
      class PictPanelTemplateBrowser extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.currentFilter = '';
          this.editingHash = false;
        }
        onAfterRender() {
          this.renderTemplateList();
        }
        getTemplateEntries() {
          let tmpTemplates = this.pict.TemplateProvider.templates;
          let tmpSources = this.pict.TemplateProvider.templateSources;
          let tmpHashes = Object.keys(tmpTemplates);
          let tmpEntries = [];
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            let tmpTemplate = tmpTemplates[tmpHash];
            let tmpSource = tmpSources[tmpHash] || '';

            // Build a one-line preview
            let tmpPreview = '';
            if (typeof tmpTemplate === 'string') {
              tmpPreview = tmpTemplate.replace(/[\t\n\r]+/g, ' ').trim();
              if (tmpPreview.length > 120) {
                tmpPreview = tmpPreview.substring(0, 117) + '...';
              }
            }

            // Escape HTML in preview so it renders as text
            tmpPreview = tmpPreview.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tmpEntries.push({
              Hash: tmpHash,
              Source: tmpSource,
              Preview: tmpPreview
            });
          }

          // Sort alphabetically by hash
          tmpEntries.sort(function (a, b) {
            return a.Hash.localeCompare(b.Hash);
          });
          return tmpEntries;
        }
        renderTemplateList() {
          let tmpEntries = this.getTemplateEntries();

          // Apply filter
          if (this.currentFilter) {
            let tmpFilterLower = this.currentFilter.toLowerCase();
            tmpEntries = tmpEntries.filter(function (pEntry) {
              return pEntry.Hash.toLowerCase().indexOf(tmpFilterLower) >= 0 || pEntry.Source.toLowerCase().indexOf(tmpFilterLower) >= 0 || pEntry.Preview.toLowerCase().indexOf(tmpFilterLower) >= 0;
            });
          }
          let tmpOutput = '';
          if (tmpEntries.length > 0) {
            tmpOutput = this.pict.parseTemplateSetByHash('PP-TemplateEntry', tmpEntries, null, [this]);
          } else {
            tmpOutput = '<div class="pp_tb_empty">No templates match filter.</div>';
          }
          this.pict.ContentAssignment.assignContent('#pp_tb_list', tmpOutput);
        }
        filterTemplates(pFilterText) {
          this.currentFilter = pFilterText;
          this.renderTemplateList();
        }
        editTemplate(pHash) {
          let tmpTemplate = this.pict.TemplateProvider.getTemplate(pHash);
          if (tmpTemplate === null) {
            this.log.error("Template [".concat(pHash, "] not found."));
            return;
          }
          this.editingHash = pHash;
          let tmpEditor = document.getElementById('pp_tb_editor');
          let tmpTextarea = document.getElementById('pp_tb_editor_textarea');
          let tmpHashLabel = document.getElementById('pp_tb_editor_hash');
          if (!tmpEditor || !tmpTextarea) return;
          tmpHashLabel.textContent = pHash;
          tmpTextarea.value = tmpTemplate;
          tmpEditor.style.display = 'block';
          tmpTextarea.focus();
        }
        saveTemplate() {
          if (!this.editingHash) return;
          let tmpTextarea = document.getElementById('pp_tb_editor_textarea');
          if (!tmpTextarea) return;
          let tmpNewContent = tmpTextarea.value;

          // Snapshot the original and persist the override
          let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
          if (tmpOverrideStorage) {
            let tmpOriginal = this.pict.TemplateProvider.getTemplate(this.editingHash);
            tmpOverrideStorage.saveOverride(this.editingHash, tmpOriginal, tmpNewContent);
          }
          this.pict.TemplateProvider.addTemplate(this.editingHash, tmpNewContent);
          this.log.info("Template [".concat(this.editingHash, "] updated."));
          this.closeEditor();
          this.renderTemplateList();
        }
        closeEditor() {
          let tmpEditor = document.getElementById('pp_tb_editor');
          if (tmpEditor) tmpEditor.style.display = 'none';
          this.editingHash = false;
        }
      }
      module.exports = PictPanelTemplateBrowser;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-view": 8
    }],
    29: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Panel-TemplateOverrides",
        DefaultRenderable: "PP-TemplateOverrides",
        DefaultDestinationAddress: "#Pict-Panel .pp_content",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "PP-TemplateOverrides",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_to_container\">\n\t\t\t\t\t<div class=\"pp_adb_header\">\n\t\t\t\t\t\t<span class=\"pp_adb_header_label\">Overrides</span>\n\t\t\t\t\t\t<div class=\"pp_adb_header_actions\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-TO'].exportOverrides(); return false;\" title=\"Export active overrides as JSON\">json</a>\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-TO'].exportOverridesJS(); return false;\" title=\"Export active overrides as JS\">js</a>\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-TO'].toggleAll(true); return false;\" title=\"Activate all overrides\">all on</a>\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-TO'].toggleAll(false); return false;\" title=\"Deactivate all overrides\">all off</a>\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_refresh_btn\" onclick=\"_Pict.views['PP-TO'].render(); return false;\" title=\"Refresh\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"14\" height=\"14\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"32\" d=\"M320 146s24.36-12-64-12a160 160 0 10160 160\"/><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M256 58l80 80-80 80\"/></svg>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_to_list\" id=\"pp_to_list\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-TemplateOverrideEntry",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_to_entry {~D:Record.ActiveClass~}\">\n\t\t\t\t\t<div class=\"pp_to_entry_row\">\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_to_toggle\" onclick=\"_Pict.views['PP-TO'].toggleOverride('{~D:Record.Hash~}'); return false;\" title=\"{~D:Record.ToggleTitle~}\">\n\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"12\" height=\"12\"><circle cx=\"256\" cy=\"256\" r=\"192\" fill=\"{~D:Record.DotColor~}\" stroke=\"currentColor\" stroke-width=\"32\"/></svg>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<span class=\"pp_to_entry_hash\">{~D:Record.Hash~}</span>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_to_remove\" onclick=\"_Pict.views['PP-TO'].removeOverride('{~D:Record.Hash~}'); return false;\" title=\"Remove override\">\n\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"12\" height=\"12\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M368 368L144 144M368 144L144 368\"/></svg>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }],
        Renderables: [{
          RenderableHash: "PP-TemplateOverrides",
          TemplateHash: "PP-TemplateOverrides",
          ContentDestinationAddress: "#Pict-Panel .pp_content"
        }]
      };
      class PictPanelTemplateOverrides extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
        }
        onAfterRender() {
          this.renderOverrideList();
        }
        getOverrideEntries() {
          let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
          if (!tmpOverrideStorage) return [];
          let tmpOverrides = tmpOverrideStorage.loadOverrides();
          let tmpHashes = Object.keys(tmpOverrides);
          let tmpEntries = [];
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            let tmpEntry = tmpOverrides[tmpHash];
            tmpEntries.push({
              Hash: tmpHash,
              Active: tmpEntry.Active,
              ActiveClass: tmpEntry.Active ? 'pp_to_active' : 'pp_to_inactive',
              DotColor: tmpEntry.Active ? 'var(--pal-acc)' : 'none',
              ToggleTitle: tmpEntry.Active ? 'Deactivate (restore original)' : 'Activate (apply override)'
            });
          }
          tmpEntries.sort(function (a, b) {
            return a.Hash.localeCompare(b.Hash);
          });
          return tmpEntries;
        }
        renderOverrideList() {
          let tmpEntries = this.getOverrideEntries();
          let tmpOutput = '';
          if (tmpEntries.length > 0) {
            tmpOutput = this.pict.parseTemplateSetByHash('PP-TemplateOverrideEntry', tmpEntries, null, [this]);
          } else {
            tmpOutput = '<div class="pp_to_empty">No template overrides stored.</div>';
          }
          this.pict.ContentAssignment.assignContent('#pp_to_list', tmpOutput);
        }
        toggleOverride(pHash) {
          let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
          if (!tmpOverrideStorage) return;
          let tmpOverrides = tmpOverrideStorage.loadOverrides();
          if (!tmpOverrides[pHash]) return;
          tmpOverrideStorage.toggleOverride(pHash, !tmpOverrides[pHash].Active);
          this.renderOverrideList();
        }
        toggleAll(pActive) {
          let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
          if (!tmpOverrideStorage) return;
          tmpOverrideStorage.toggleAll(pActive);
          this.renderOverrideList();
        }
        removeOverride(pHash) {
          let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
          if (!tmpOverrideStorage) return;
          tmpOverrideStorage.removeOverride(pHash);
          this.renderOverrideList();
        }
        exportOverrides() {
          let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
          if (!tmpOverrideStorage) return;
          let tmpOverrides = tmpOverrideStorage.loadOverrides();
          let tmpHashes = Object.keys(tmpOverrides);

          // Build export array from active overrides only
          let tmpExport = [];
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            if (tmpOverrides[tmpHash].Active) {
              tmpExport.push({
                Hash: tmpHash,
                Template: tmpOverrides[tmpHash].Override
              });
            }
          }
          if (tmpExport.length === 0) {
            this.log.warn('No active overrides to export.');
            return;
          }

          // Build a site hash from the current hostname
          let tmpSiteHash = window.location.hostname.replace(/[^a-zA-Z0-9]/g, '_');
          let tmpJSON = JSON.stringify(tmpExport, null, '\t');
          let tmpBlob = new Blob([tmpJSON], {
            type: 'application/json'
          });
          let tmpURL = URL.createObjectURL(tmpBlob);
          let tmpLink = document.createElement('a');
          tmpLink.href = tmpURL;
          tmpLink.download = 'PictTemplates-' + tmpSiteHash + '.json';
          document.body.appendChild(tmpLink);
          tmpLink.click();
          document.body.removeChild(tmpLink);
          URL.revokeObjectURL(tmpURL);
          this.log.info("Exported ".concat(tmpExport.length, " template override(s) as JSON"));
        }
        exportOverridesJS() {
          let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
          if (!tmpOverrideStorage) return;
          let tmpOverrides = tmpOverrideStorage.loadOverrides();
          let tmpHashes = Object.keys(tmpOverrides);

          // Build entries from active overrides only
          let tmpEntries = [];
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            if (tmpOverrides[tmpHash].Active) {
              tmpEntries.push({
                Hash: tmpHash,
                Template: tmpOverrides[tmpHash].Override
              });
            }
          }
          if (tmpEntries.length === 0) {
            this.log.warn('No active overrides to export.');
            return;
          }

          // Format as JS source with backtick-quoted template strings
          let tmpLines = [];
          tmpLines.push('[\n');
          for (let i = 0; i < tmpEntries.length; i++) {
            let tmpEntry = tmpEntries[i];
            tmpLines.push('\t\t{\n');
            tmpLines.push('Hash: "' + tmpEntry.Hash.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '",\n');
            tmpLines.push('Template: /*html*/`\n');
            tmpLines.push(tmpEntry.Template);
            if (!tmpEntry.Template.endsWith('\n')) {
              tmpLines.push('\n');
            }
            tmpLines.push('`\n');
            tmpLines.push('\t\t}');
            if (i < tmpEntries.length - 1) {
              tmpLines.push(',');
            }
            tmpLines.push('\n');
          }
          tmpLines.push('\t]\n');
          let tmpSiteHash = window.location.hostname.replace(/[^a-zA-Z0-9]/g, '_');
          let tmpContent = tmpLines.join('');
          let tmpBlob = new Blob([tmpContent], {
            type: 'application/javascript'
          });
          let tmpURL = URL.createObjectURL(tmpBlob);
          let tmpLink = document.createElement('a');
          tmpLink.href = tmpURL;
          tmpLink.download = 'PictTemplates-' + tmpSiteHash + '.js';
          document.body.appendChild(tmpLink);
          tmpLink.click();
          document.body.removeChild(tmpLink);
          URL.revokeObjectURL(tmpURL);
          this.log.info("Exported ".concat(tmpEntries.length, " template override(s) as JS"));
        }
      }
      module.exports = PictPanelTemplateOverrides;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-view": 8
    }],
    30: [function (require, module, exports) {
      const libPictView = require('pict-view');
      const _ViewConfiguration = {
        ViewIdentifier: "Pict-Panel-ViewBrowser",
        DefaultRenderable: "PP-ViewBrowser",
        DefaultDestinationAddress: "#Pict-Panel .pp_content",
        AutoRender: false,
        AutoSolveWithApp: false,
        Templates: [{
          Hash: "PP-ViewBrowser",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_sb_container\" id=\"pp_vb_container\">\n\t\t\t\t\t<div class=\"pp_adb_header\">\n\t\t\t\t\t\t<span class=\"pp_adb_header_label\">Views</span>\n\t\t\t\t\t\t<div class=\"pp_adb_header_actions\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn pp_adb_refresh_btn\" onclick=\"_Pict.views['PP-VB'].showList(); return false;\" title=\"Refresh\">\n\t\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"14\" height=\"14\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" stroke-width=\"32\" d=\"M320 146s24.36-12-64-12a160 160 0 10160 160\"/><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M256 58l80 80-80 80\"/></svg>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_body\" id=\"pp_vb_body\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-ViewEntry",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_sb_entry\">\n\t\t\t\t\t<div class=\"pp_sb_entry_row\">\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_entry_hash\" onclick=\"_Pict.views['PP-VB'].showDetail('{~D:Record.Hash~}'); return false;\">{~D:Record.Hash~}</a>\n\t\t\t\t\t\t<span class=\"pp_sb_entry_info\">{~D:Record.Info~}</span>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_action_icon\" onclick=\"_Pict.views['{~D:Record.Hash~}'].render(); return false;\" title=\"Render (sync)\">\n\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"12\" height=\"12\"><path d=\"M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z\" fill=\"currentColor\"/></svg>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_action_icon\" onclick=\"_Pict.views['{~D:Record.Hash~}'].renderAsync(function(){}); return false;\" title=\"Render (async)\">\n\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"12\" height=\"12\"><path fill=\"none\" stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"32\" d=\"M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48z\"/><path fill=\"currentColor\" d=\"M200 168v176l144-88-144-88z\"/></svg>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-ViewDetail",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_sb_detail\">\n\t\t\t\t\t<div class=\"pp_sb_detail_header\">\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_back_btn\" onclick=\"_Pict.views['PP-VB'].showList(); return false;\" title=\"Back to list\">\n\t\t\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" width=\"14\" height=\"14\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M328 112L184 256l144 144\"/></svg>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<span class=\"pp_sb_detail_hash\">{~D:Record.Hash~}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_vitals\">\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">UUID</span><span class=\"pp_sb_vital_val\">{~D:Record.UUID~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Destination</span><span class=\"pp_sb_vital_val\">{~D:Record.DefaultDestination~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Renderable</span><span class=\"pp_sb_vital_val\">{~D:Record.DefaultRenderable~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">AutoRender</span><span class=\"pp_sb_vital_val\">{~D:Record.AutoRender~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">AutoSolve</span><span class=\"pp_sb_vital_val\">{~D:Record.AutoSolve~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Initialized</span><span class=\"pp_sb_vital_val\">{~D:Record.InitTS~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Last Render</span><span class=\"pp_sb_vital_val\">{~D:Record.RenderTS~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Last Solve</span><span class=\"pp_sb_vital_val\">{~D:Record.SolveTS~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Last Marshal To</span><span class=\"pp_sb_vital_val\">{~D:Record.MarshalToTS~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Last Marshal From</span><span class=\"pp_sb_vital_val\">{~D:Record.MarshalFromTS~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Renderables</span><span class=\"pp_sb_vital_val\">{~D:Record.RenderableCount~}</span></div>\n\t\t\t\t\t\t<div class=\"pp_sb_vital_row\"><span class=\"pp_sb_vital_key\">Templates</span><span class=\"pp_sb_vital_val\">{~D:Record.TemplateCount~}</span></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_detail_actions\">\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_detail_action_btn\" onclick=\"_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','solve'); return false;\" title=\"solve()\">solve</a>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_detail_action_btn\" onclick=\"_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','render'); return false;\" title=\"render()\">render</a>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_detail_action_btn\" onclick=\"_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','renderAsync'); return false;\" title=\"renderAsync()\">renderAsync</a>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_detail_action_btn\" onclick=\"_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','marshalToView'); return false;\" title=\"marshalToView()\">marshalTo</a>\n\t\t\t\t\t\t<a href=\"#\" class=\"pp_sb_detail_action_btn\" onclick=\"_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','marshalFromView'); return false;\" title=\"marshalFromView()\">marshalFrom</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"pp_sb_detail_section_label\">Templates</div>\n\t\t\t\t\t<div class=\"pp_sb_detail_templates\" id=\"pp_vb_detail_templates\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n"
        }, {
          Hash: "PP-ViewDetailTemplate",
          Template: /*HTML*/"\n\t\t\t\t<div class=\"pp_sb_detail_tpl_entry\">\n\t\t\t\t\t<span class=\"pp_sb_detail_tpl_hash\">{~D:Record.Hash~}</span>\n\t\t\t\t\t<a href=\"#\" class=\"pp_adb_action_btn\" onclick=\"_Pict.views['PP-TB'].editTemplate('{~D:Record.Hash~}'); _Pict.providers['PP-Router'].navigateTo('PP-TB'); return false;\" title=\"Edit in Template Browser\">ed</a>\n\t\t\t\t\t<div class=\"pp_sb_detail_tpl_preview\">{~D:Record.Preview~}</div>\n\t\t\t\t</div>\n"
        }],
        Renderables: [{
          RenderableHash: "PP-ViewBrowser",
          TemplateHash: "PP-ViewBrowser",
          ContentDestinationAddress: "#Pict-Panel .pp_content"
        }]
      };
      class PictPanelViewBrowser extends libPictView {
        constructor(pFable, pOptions, pServiceHash) {
          super(pFable, pOptions, pServiceHash);
          this.detailHash = false;
        }
        onAfterRender() {
          this.showList();
        }
        getViewEntries() {
          let tmpViews = this.pict.views;
          let tmpHashes = Object.keys(tmpViews);
          let tmpEntries = [];
          for (let i = 0; i < tmpHashes.length; i++) {
            let tmpHash = tmpHashes[i];
            let tmpView = tmpViews[tmpHash];
            let tmpInfo = '';
            if (tmpView.options && tmpView.options.DefaultDestinationAddress) {
              tmpInfo = tmpView.options.DefaultDestinationAddress;
            }
            tmpEntries.push({
              Hash: tmpHash,
              Info: tmpInfo
            });
          }
          tmpEntries.sort(function (a, b) {
            return a.Hash.localeCompare(b.Hash);
          });
          return tmpEntries;
        }
        showList() {
          this.detailHash = false;
          let tmpEntries = this.getViewEntries();
          let tmpOutput = '';
          if (tmpEntries.length > 0) {
            tmpOutput = this.pict.parseTemplateSetByHash('PP-ViewEntry', tmpEntries, null, [this]);
          } else {
            tmpOutput = '<div class="pp_tb_empty">No views registered.</div>';
          }
          this.pict.ContentAssignment.assignContent('#pp_vb_body', tmpOutput);
        }
        formatTimestamp(pTimestamp) {
          if (!pTimestamp) return '--';
          let tmpDate = new Date(pTimestamp);
          return tmpDate.toLocaleTimeString();
        }
        showDetail(pHash) {
          let tmpView = this.pict.views[pHash];
          if (!tmpView) return;
          this.detailHash = pHash;
          let tmpTemplateCount = 0;
          if (tmpView.options && tmpView.options.Templates) {
            tmpTemplateCount = tmpView.options.Templates.length;
          }
          let tmpRenderableCount = 0;
          if (tmpView.renderables) {
            tmpRenderableCount = Object.keys(tmpView.renderables).length;
          }
          let tmpRecord = [{
            Hash: pHash,
            UUID: tmpView.UUID || '--',
            DefaultDestination: tmpView.options && tmpView.options.DefaultDestinationAddress || '--',
            DefaultRenderable: tmpView.options && tmpView.options.DefaultRenderable || '--',
            AutoRender: tmpView.options && tmpView.options.AutoRender ? 'true' : 'false',
            AutoSolve: tmpView.options && tmpView.options.AutoSolveWithApp ? 'true' : 'false',
            InitTS: this.formatTimestamp(tmpView.initializeTimestamp),
            RenderTS: this.formatTimestamp(tmpView.lastRenderedTimestamp),
            SolveTS: this.formatTimestamp(tmpView.lastSolvedTimestamp),
            MarshalToTS: this.formatTimestamp(tmpView.lastMarshalToViewTimestamp),
            MarshalFromTS: this.formatTimestamp(tmpView.lastMarshalFromViewTimestamp),
            RenderableCount: tmpRenderableCount,
            TemplateCount: tmpTemplateCount
          }];
          let tmpOutput = this.pict.parseTemplateSetByHash('PP-ViewDetail', tmpRecord, null, [this]);
          this.pict.ContentAssignment.assignContent('#pp_vb_body', tmpOutput);

          // Render the template list for this view
          this.renderDetailTemplates(tmpView);
        }
        renderDetailTemplates(pView) {
          let tmpTemplates = [];
          if (pView.options && pView.options.Templates) {
            for (let i = 0; i < pView.options.Templates.length; i++) {
              let tmpTpl = pView.options.Templates[i];
              let tmpContent = this.pict.TemplateProvider.getTemplate(tmpTpl.Hash) || '';
              let tmpPreview = '';
              if (typeof tmpContent === 'string') {
                tmpPreview = tmpContent.replace(/[\t\n\r]+/g, ' ').trim();
                if (tmpPreview.length > 100) {
                  tmpPreview = tmpPreview.substring(0, 97) + '...';
                }
              }
              tmpPreview = tmpPreview.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              tmpTemplates.push({
                Hash: tmpTpl.Hash,
                Preview: tmpPreview
              });
            }
          }
          let tmpOutput = '';
          if (tmpTemplates.length > 0) {
            tmpOutput = this.pict.parseTemplateSetByHash('PP-ViewDetailTemplate', tmpTemplates, null, [this]);
          } else {
            tmpOutput = '<div class="pp_tb_empty">No templates.</div>';
          }
          this.pict.ContentAssignment.assignContent('#pp_vb_detail_templates', tmpOutput);
        }
        execViewAction(pHash, pAction) {
          let tmpView = this.pict.views[pHash];
          if (!tmpView) return;
          this.log.info("Executing ".concat(pAction, "() on view [").concat(pHash, "]"));
          if (pAction === 'renderAsync') {
            tmpView.renderAsync(function () {});
          } else if (typeof tmpView[pAction] === 'function') {
            tmpView[pAction]();
          }

          // Refresh the detail view to show updated timestamps
          let __View = this;
          setTimeout(function () {
            if (__View.detailHash === pHash) __View.showDetail(pHash);
          }, 250);
        }
      }
      module.exports = PictPanelViewBrowser;
      module.exports.default_configuration = _ViewConfiguration;
    }, {
      "pict-view": 8
    }]
  }, {}, [9])(9);
});
//# sourceMappingURL=pict-panel.js.map
