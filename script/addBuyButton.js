function addBuyButtonToId(html_id, product_id) {
  pullJSON (
    'https://git.ahem.net.au/shopify-buy-button-options.json',
    function (options) {  
      var client = ShopifyBuy.buildClient(
        {
          domain: 'ahem-engineering.myshopify.com',
          storefrontAccessToken: 'c43dd5285b9eaf2ce09081222ee4c393',
        }
      );
      ShopifyBuy.UI.onReady(client).then(
        function (ui) {
          ui.createComponent(
            'product', 
            {
              id: product_id,
              node: document.getElementById(html_id),
              moneyFormat: '%24%7B%7Bamount%7D%7D',
              options: options
            }
          );
        }
      );
    }
  );
}
