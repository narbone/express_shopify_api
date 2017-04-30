# README #

### What is this repository for? ###
An Express js server prototype which allows you to upload a zip file on the Shopify assets dir
### How do I get set up? ###

```
git clone https://github.com/webharvesting/express_shopify_api.git
npm install
```
Add your Shopify credentials and theme ID in routes/files.js

```
var shopifyConnector = require('shopify-connector'),
    shopify = shopifyConnector.getShopifyApiInstance('shopify_app_api_key', 'shopify_app_api_password', 'shopify_store_url'),
    themeId='shopify_theme_id',
```


### How do I test it? ###
```
npm start
```
and on your favourite browser type:
http://localhost:3000/files/form_file_upload/shopify_assets

### Who do I talk to? ###
fabio@webharvesting.com.au
