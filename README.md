# Paginator component view for generator-sp

Usefull only with [generator-sp](https://github.com/snphq/generator-sp).

## Installation

Install it from bower

```bash
bower install snp-component-paginator --save
```

Add js requirements reference to `main.coffee`

```coffee
require.config
  paths:
    ...
    'PaginatorComponent':"#{VENDOR_PATH}/snp-component-paginator/dist/PaginatorComponent"
```

# Usage

Create item you want to use as itemView in Paginator

```bash
 yo sp:view Paginate
```



Add component region into view, where You want install gallery
**coffee**
```coffee
  PaginatorComponent = require 'PaginatorComponent'

  PaginatePage = _Page.extend
    template: "#PaginatePage"
    className: "paginate_page"

    regions:
      paginator:
        el: "[data-view-paginate]"
        view: PaginatorComponent


    initialize: ->
      @r.paginator.setPage(1, 12)
```

**jade**
```jade
  .paginator(data-view-paginate)
```





## Docs

### Options


**initialize**
```coffee
  ...
  regions:
    paginator:
      el: "[data-view-paginate]"
      view: PaginatorComponent
      scope: -> {
        options:
          pageSideShow: 2
          pageFirstShow: true
          pageLastShow: true
          currentPage: 1
          totalPage: 1
        }
```
**setOptions**
```coffee
  @r.paginator.setOptions {
    pageSideShow: 2
    pageFirstShow: false
    currentPage: 1
  }
```

**setPage**
```coffee
  @r.paginator.setPage(activePage, [totalPage])
```



### Events

To track slider nav implement `changePage` method or listen to
`changePage` event.

`changePage(activePage)`
