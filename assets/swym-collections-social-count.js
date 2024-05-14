function swymCallbackFn(swat) {
    const productIdArray = [];
    const allSwymCollectionsButtons = document.querySelectorAll('#swym-collections-social-count');
  
    allSwymCollectionsButtons.forEach((button) => {
      productIdArray.push(button.getAttribute("data-product-id"));
    });
  
    function fetchSocialCount(productId) {
      return new Promise((resolve, reject) => {
        swat.wishlist.getSocialCount({ empi: productId },
          data => resolve({ productId, count: data }),
          error => reject({ productId, error })
        );
      });
    }
  
    function generateFetchBody() {
      return productIdArray.map(productId => fetchSocialCount(productId));
    }
  
    Promise.all(generateFetchBody())
      .then(results => {
        console.log(results,"results");
        results.forEach(result => {
          const button = document.querySelector(`#swym-collections-social-count[data-product-id="${result.productId}"]`);
          button.textContent = result.count.data.count;
          console.log(result, "result");

        });
      })
      .catch(error => {
        console.error("Error fetching social counts:", error);
      });

      swat.evtLayer.addEventListener(swat.JSEvents.addedToWishlist, function(product){
        let productId = product.detail.d.empi;
        let buttonToIncrease = document.querySelector(`#swym-collections-social-count[data-product-id="${productId}"]`);
        let updatedNumber = Number(buttonToIncrease.textContent)+1;
        buttonToIncrease.textContent = updatedNumber;
      });
  
  }
  
  if (!window.SwymCallbacks) {
    window.SwymCallbacks = [];
  }
  
  window.SwymCallbacks.push(swymCallbackFn);
  
