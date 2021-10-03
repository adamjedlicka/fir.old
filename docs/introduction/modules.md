# Modules

In classical applications, directory structure would look something like this:

- components
  - Header.vue
  - Footer.vue
  - blog
    - Article.vue
    - Category.vue
- store
  - common.js
  - article.js
  - category.js
- compositions
  - common.js
  - blog.js

This structure is fine for smaller applications, but falls apart for larger ones. When you have hundreds of components, JS files and utilities, it can be hard to track dependencies between them. Technical debt also starts creeping in, because developers are afraid to refactor because they do not know the scope of components that could be possibly affected.

One solution is to split the application id domain modules like this:

- common
  - components
    - Header.vue
    - Footer.vue
  - store
    - index.js
  - compositions
    - index.js
- blog
  - components
    - Article.vue
    - Category.vue
  - store
    - article.js
    - category.js
  - compositions
    - index.js

Dependencies are now only inside individual modules and because they are much smaller then the whole application, they are much more manageable. Large applications can be built from tens of these small modules, each of them representing one small part of the whole application. For example e-shop, could have these modules: common, category, product, homepage, blog, cart, checkout, customer-account, wishlist, search, ...
