/*! snp-component-paginator 0.0.1 */
define(function(require, exports, module) {
  var SnpPaginateCollection, SnpPaginateItem, SnpPaginateList, SnpPaginateModel, _List;
  _List = require('../_List');
  SnpPaginateModel = Backbone.Epoxy.Model.extend({
    defaults: {
      page: 0,
      active: false,
      separator: false
    }
  });
  SnpPaginateCollection = Backbone.Collection.extend({
    model: SnpPaginateModel
  });
  SnpPaginateItem = _List.extend({
    templateFunc: function() {
      return "<span data-js-number></span>\n<span data-js-separator>...</span>";
    },
    className: 'swipepaginatepage_item',
    ui: {
      pageNum: '[data-js-number]',
      separator: '[data-js-separator]'
    },
    bindings: {
      '@ui.pageNum': 'text: page, toggle: not(separator)',
      '@ui.separator': 'toggle: separator',
      ':el': "classes: {'active': active}"
    },
    events: {
      'click': 'onClickElement'
    },
    onClickElement: function() {
      return this.model.set({
        active: true
      });
    }
  });
  return SnpPaginateList = _List.extend({
    template: '#SnpPaginateList',
    className: 'snppaginate_list',
    bindings: {
      ':el': 'collection: $collection'
    },
    itemView: null,
    initialize: function(arg) {
      var options;
      options = arg.options;
      if (this.collection == null) {
        this.collection = new SnpPaginateCollection;
      }
      if (options == null) {
        options = {};
      }
      this.options = _.extend({
        pageSideShow: 2,
        pageFirstShow: true,
        pageLastShow: true,
        currentPage: 1,
        totalPage: 1
      }, options);
      if (this.itemView === null) {
        console.log('snp-component-paginator: itemView was not set');
        this.itemView = new SnpPaginateItem;
      }
      return this.listenTo(this.collection, 'change:active', this.onChangeActive);
    },
    onChangeActive: function(model) {
      this.setPage(model.get('page'));
      return this.trigger('changePage', model.get('page'));
    },
    setOptions: function(options) {
      return _.extend(this.options, options);
    },
    setPage: function(currentPage, totalPage) {
      if (totalPage == null) {
        totalPage = this.options.totalPage;
      }
      if (currentPage === this.options.currentPage && totalPage === this.options.totalPage) {
        return null;
      }
      if (currentPage > 0 && currentPage <= totalPage) {
        this.options.currentPage = currentPage;
        this.options.totalPage = totalPage;
        return this.updatePageCollection();
      } else {
        return console.log("snp-component-paginator: invalid currentPage = " + currentPage + ", totalPage = " + totalPage);
      }
    },
    updatePageCollection: function() {
      var endIndex, i, pageModels, results, startIndex;
      pageModels = [];
      if (this.options.totalPage > 1) {
        startIndex = this.options.currentPage - this.options.pageSideShow;
        endIndex = this.options.currentPage + this.options.pageSideShow;
        if (startIndex <= 0) {
          endIndex = endIndex - (startIndex - 1);
          startIndex = 1;
        } else if (endIndex > this.options.totalPage) {
          startIndex = startIndex - (endIndex - this.options.totalPage);
        }
        _.each((function() {
          results = [];
          for (var i = startIndex; startIndex <= endIndex ? i <= endIndex : i >= endIndex; startIndex <= endIndex ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this), (function(_this) {
          return function(page) {
            var active;
            if (page <= _this.options.totalPage) {
              active = false;
              if (page === _this.options.currentPage) {
                active = true;
              }
              return pageModels.push({
                active: active,
                page: page,
                separator: false
              });
            }
          };
        })(this));
        if (this.options.pageFirstShow) {
          if (startIndex > 2) {
            pageModels.unshift({
              active: false,
              page: 0,
              separator: true
            });
          }
          if (startIndex > 1) {
            pageModels.unshift({
              active: false,
              page: 1,
              separator: false
            });
          }
        }
        if (this.options.pageLastShow) {
          if (endIndex < this.options.totalPage - 1) {
            pageModels.push({
              active: false,
              page: 0,
              separator: true
            });
          }
          if (endIndex < this.options.totalPage) {
            pageModels.push({
              active: false,
              page: this.options.totalPage,
              separator: false
            });
          }
        }
      }
      return this.collection.reset(pageModels);
    }
  });
});
