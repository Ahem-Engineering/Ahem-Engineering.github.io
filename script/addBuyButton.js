function addBuyButtonToId(html_id, product_id) {
  console.log("adding buy button (" + product_id + ") to " + html_id);
  pullJSON (
    'https://git.ahem.net.au/shopify-buy-button-options.json',
    function (options) {  
      console.log("creating client");
      var client = ShopifyBuy.buildClient(
        {
          domain: 'ahem-engineering.myshopify.com',
          storefrontAccessToken: 'c43dd5285b9eaf2ce09081222ee4c393',
        }
      );
      console.log("adding component");
      ShopifyBuy.UI.onReady(client).then(
        function createComponentWithUi(ui) {
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
