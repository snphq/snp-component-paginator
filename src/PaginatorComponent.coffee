define (require, exports, module)->
  Backbone = require "backbone"
  SuperView = MixinBackbone(Backbone.Epoxy.View)



  SnpPaginateModel = Backbone.Epoxy.Model.extend
    defaults:
      page: 0
      active: false
      separator: false

  SnpPaginateCollection = Backbone.Collection.extend
    model: SnpPaginateModel


  SnpPaginateItem = SuperView.extend
    templateFunc: ->
      """
        <span data-js-number></span>
        <span data-js-separator>...</span>
      """
    className: 'swipepaginatepage_item'

    ui:
      pageNum: '[data-js-number]'
      separator: '[data-js-separator]'

    bindings:
      '@ui.pageNum': 'text: page, toggle: not(separator)'
      '@ui.separator': 'toggle: separator'
      ':el': "classes: {'active': active}"

    events:
      'click': 'onClickElement'

    onClickElement: ->
      @model.set {active: true}

  class SnpPaginateList extends SuperView
    template: '#SnpPaginateList'
    className: 'snppaginate_list'
    bindings:
      ':el': 'collection: $collection'
    itemView: null

    initialize: ({options})->
      @collection ?= new SnpPaginateCollection
      options ?= {}
      @options = _.extend {
        pageSideShow: 2
        pageFirstShow: true
        pageLastShow: true
        currentPage: 1
        totalPage: 1
      }, options
      if @itemView == null
        console.log 'snp-component-paginator: itemView was not set'
        @itemView = new SnpPaginateItem
      @listenTo @collection, 'change:active', @onChangeActive

    onChangeActive: (model)->
      @setPage model.get('page')
      @trigger 'changePage', model.get('page')

    setOptions: (options)->
      _.extend @options, options

    setPage: (currentPage, totalPage = @options.totalPage)->
      if currentPage == @options.currentPage && totalPage == @options.totalPage
        return null
      if currentPage > 0 && currentPage <= totalPage
        @options.currentPage = currentPage
        @options.totalPage = totalPage
        @updatePageCollection()
      else
        console.log "snp-component-paginator: invalid currentPage = #{currentPage}, totalPage = #{totalPage}"

    updatePageCollection: ->
      pageModels = []
      if @options.totalPage > 1
        startIndex = @options.currentPage - @options.pageSideShow
        endIndex = @options.currentPage + @options.pageSideShow
        if startIndex <= 0
          endIndex = endIndex - (startIndex - 1)
          startIndex = 1
        else if endIndex > @options.totalPage
          startIndex = startIndex - (endIndex - @options.totalPage)
        _.each [startIndex..endIndex], (page)=>
          if page <= @options.totalPage
            active = false
            if page == @options.currentPage
              active = true
            pageModels.push {
              active: active
              page: page
              separator: false
            }
        if @options.pageFirstShow
          if startIndex > 2
            pageModels.unshift {
              active: false
              page: 0
              separator: true
            }
          if startIndex > 1
            pageModels.unshift {
              active: false
              page: 1
              separator: false
            }
        if @options.pageLastShow
          if endIndex < @options.totalPage - 1
            pageModels.push {
              active: false
              page: 0
              separator: true
            }
          if endIndex < @options.totalPage
            pageModels.push {
              active: false
              page: @options.totalPage
              separator: false
            }
      @collection.reset pageModels
