function onSwymLoadCallback(swat) {

    const swymCollectionsModal = document.getElementById("swym-collections-modal-background");
    const modalCloseButton = document.getElementById("swym-modal-close");
    const variantSelectionContainer = document.getElementById("swym-variant-selector-container");
    const addToWishlistButton = document.getElementById("swym-add-to-wishlist-button");
    const isSingleWishlist = !swat.retailerSettings.Wishlist.EnableCollections;
    const listIdContainer = document.getElementById("swym-list-id-container");
    const createListButton = document.getElementById("swym-create-list-button");
    const confirmListNameButton = document.getElementById("swym-confirm-list-button");
    const createListContainer = document.getElementById("swym-create-list-container");
    const cancelListCreationButton = document.getElementById("swym-notconfirm-list-button");
    let listNameInput = document.getElementById("swym-new-list-name-input");
    let variantImage = document.getElementById("swym-primary-image");
    let vendorTitle = document.getElementById("swym-vendor-title");
    let productTitle = document.getElementById("swym-product-title");
    let price = document.getElementById("swym-variant-price");
    let variantTitle = document.getElementById("swym-variant-title");
    let imgBlobContainer = document.getElementById("swym-image-blob-container");
    let defaultWishlistTitle = "My Wishlist ";
    let productData;
    let productURL;
    let selectedVariant = {};
    let currentVariantId;
    let globalActionArray = [];
    let globalListArray = [];
    let globalProductsInListArray = [];
    let selectCallBackObj = {};
    let removeFromLids = [];
    let addToLids = [];
    let updateMessage;


    function debounce_leading(func, timeout = 300) {
        let timer;
        return (...args) => {
            if (!timer) {
                func.apply(this, args);
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = undefined;
            }, timeout);
        };
    }

    function customErrorHandling(error) {
        swat.ui.uiRef.showErrorNotification({ message: error });
    }

    function customSuccessHandling(success) {
        swat.ui.uiRef.showSuccessNotification({ message: success, });
    }

    function addImgBlobClickListener(event) {
        let imgBlobSrc = event.target.getAttribute("src");
        let allImgBlobs = document.querySelectorAll("#swym-image-blob");
        variantImage.src = imgBlobSrc;

        allImgBlobs.forEach((imgBlob) => {
            if (imgBlob !== event.target) {
                imgBlob.classList.remove("selected");
            }
        });

        event.target.classList.toggle("selected");
    }

    function addImageCarousel() {
        const variantImagesArray = productData.product.images;
        const imgTags = variantImagesArray.map((image) => {
            const imgTag = document.createElement('img');
            imgTag.width = "24";
            imgTag.height = "24";
            imgTag.id = `swym-image-blob`;
            imgTag.src = image.src;

            imgTag.addEventListener("click", addImgBlobClickListener);
    
            return imgTag;
        });
    
        imgBlobContainer.append(...imgTags);
    }
    

    function updateListHandler() {
        const listInputs = document.querySelectorAll(".swym-list-button");
        globalActionArray = Array.from(listInputs).map((input) => {
            const listId = input.getAttribute("data-list-id");
            const actionType = input.checked && !input.classList.contains("variant-in-wishlist") ? 'add' : 'remove';
            return { actionType, listId };
        });
    
        toggleAddToWishlistButtonState();
    }
    

    function isVariantPresentInLists() {
        if (!isSingleWishlist) {
            globalListArray.forEach((list) => {
                const listId = list.lid;
                const listInput = document.querySelector(`.swym-list-button[data-list-id="${listId}"]`);
                const variantIsPresent = listInput && list.listcontents.some((variant) => variant.epi === currentVariantId);
                
                if (listInput) {
                    listInput.checked = variantIsPresent;
                    listInput.classList.toggle("variant-in-wishlist", variantIsPresent);
                }
            });
        } else {
            const variantInWishlist = globalProductsInListArray.some((product) => product.epi === currentVariantId);

            addToWishlistButton.classList.toggle("variant-in-wishlist", variantInWishlist);
            addToWishlistButton.textContent = variantInWishlist ? "Remove from Wishlist" : "Add to Wishlist";
        }
    }
    
    function listSelectionEventlistener() {
        let listInputs = document.querySelectorAll(".swym-list-button");
        listInputs.forEach((input) => {
            input.addEventListener("click", (e) => {
                if (e.target.classList.contains("selected")) {
                    e.target.classList.remove("selected");
                } else {
                    e.target.classList.add("selected");
                }
                updateListHandler();
            });
        });

        isVariantPresentInLists();
    }

    function addLists() {
        if (!isSingleWishlist) {
            createListButton.classList.remove("swym-hide-container");
            const onSuccess = (lists) => {
                globalListArray = lists;
                listIdContainer.innerHTML = lists.map((list) => `
                    <div id="swym-input-and-label-wrapper">
                        <input id="${list.lid}-${productData.product.id}" class="swym-list-button" type="checkbox" data-list-id="${list.lid}">
                        <label class="swym-list-label" data-list-id="${list.lid}" for="${list.lid}-${productData.product.id}">${list.lname} (${list.listcontents.length})</label>
                    </div>`
                ).join("");
                listSelectionEventlistener();
                isVariantPresentInLists();
                if (globalListArray.length < 1) {
                    createListButton.click();
                }
                toggleVariantData();
            };
    
            const onError = (error) => customErrorHandling(error.description);
    
            swat.fetchLists({ callbackFn: onSuccess, errorFn: onError });
        } else if (isSingleWishlist) {
            swat.fetch((allWishlistedProducts) => {
                globalProductsInListArray = allWishlistedProducts;
                isVariantPresentInLists();
            }, (error) => customErrorHandling(error.description));
            toggleVariantData();
        }
    }
    

    function toggleVariantData() {

        getSelectedVariant(selectCallBackObj);

        const currentProductTitle = productData.product.title;
        const currentProductVendor = productData.product.vendor;
        const alterNateVariantImages = productData.product.images;
        let currentVariantTitle = selectedVariant.title.replace(/\//g, "");
        let currentVariantPrice = swat.currency + ": " + selectedVariant.price;
        let imageId = selectedVariant.image_id;

        vendorTitle.innerHTML = "By:" + " " + currentProductVendor;
        productTitle.innerHTML = currentProductTitle;
        variantTitle.innerHTML = currentVariantTitle;
        price.innerHTML = currentVariantPrice;

        for (i = 0; i < alterNateVariantImages.length; i++) {
            if (alterNateVariantImages[i].id == imageId) {
                variantImage.setAttribute("src", alterNateVariantImages[i].src);
            } else {
                variantImage.setAttribute("src", productData.product.image.src);
            }
        }

        toggleAddToWishlistButtonState();
    }

    function addProductData() {
        let product = productData.product;
        variantImage.src = product.image.src;
        vendorTitle.innerHTML = product.vendor;
        productTitle.innerHTML = product.title;
        price.innerHTML = product.variants[0].price;

        addImageCarousel();
        renderVariantSelectors(productData);
    }

    (function toggleCreateList() {
        createListButton.addEventListener("click", () => {
            defaultWishlistTitle = "My Wishlist " + (globalListArray.length + 1);
            if (globalListArray.length == 10) {
                updateMessage = "List limit of 10 Wishlists reached, please delete a wishlist to create newer wishlists.";
                customErrorHandling(updateMessage);
            } else {
                createListContainer.classList.remove("swym-hide-container");
                createListButton.setAttribute("disabled", true);
                listNameInput.value = defaultWishlistTitle;
            }
        })
        cancelListCreationButton.addEventListener("click", () => {
            createListContainer.classList.add("swym-hide-container");
            createListButton.removeAttribute("disabled");
        })
    })();

    (function addCreateListEventListener() {
        confirmListNameButton.addEventListener("click", () => {
            let listNameAlreadyExists = false;

            let listConfig = {
                "lname": listNameInput.value,
            };

            globalListArray.forEach((list) => {
                if (list.lname == listConfig.lname) {
                    listNameAlreadyExists = true;
                }
            });

            let onSuccess = function (newList) {
                addLists();
                createListContainer.classList.add("swym-hide-container");
            }

            let onError = function (error) {
                customErrorHandling(error.description);
            }

            if (listConfig.lname.length < 3) {
                updateMessage = "List name must be alteast 3 characters!";
                customErrorHandling(updateMessage);
                listNameInput.value = "";
                listNameInput.focus();
            }
            else if (listNameAlreadyExists) {
                updateMessage = `${listConfig.lname} already exists! Please enter a unique name`;
                customErrorHandling(updateMessage);
                listNameInput.value = "";
                listNameInput.focus();
            } else {
                swat.createList(listConfig, onSuccess, onError);
                createListButton.removeAttribute("disabled");
            }
        })
    })();

    function toggleAddToWishlistButtonState() {
        if (!isSingleWishlist) {
            if (globalActionArray.length > 0) {
                addToWishlistButton.removeAttribute("disabled");
                addToWishlistButton.textContent = "Update Lists";
            } else if (globalActionArray.length == 0) {
                addToWishlistButton.setAttribute("disabled", true);
                addToWishlistButton.textContent = "Select Lists";
            }
        }

    }

    function updateVariantInLists() {
        let product = {
            epi: currentVariantId,
            empi: productData.product.id,
            du: productURL
        };

        addToLids = [];
        removeFromLids = [];

        globalActionArray.forEach((listAction) => {
            if (listAction.actionType == 'add') {
                addToLids.push(listAction.listId);
            } else if (listAction.actionType == 'remove') {
                removeFromLids.push(listAction.listId);
            }
        });
        if (!isSingleWishlist) {
            if (addToLids.length > 0) {
                let onSuccess = function (response) {
                }
                let onError = function (error) {
                    customErrorHandling(error.description);
                }
                swat.addProductToLists(product, addToLids, onSuccess, onError);
            }

            if (removeFromLids.length > 0) {
                let onSuccess = function (response) {
                    // customSuccessHandling(response.description);
                }

                let onError = function (error) {
                    customErrorHandling(error.description);
                }
                swat.removeProductFromLists(product, removeFromLids, onSuccess, onError);
            }
            const listLength = globalActionArray.length;
            const listText = listLength > 1 ? " Wishlists" : " Wishlist";
            const updateMessage = `${productTitle.textContent} ${variantTitle.textContent} has been updated in ${listLength}${listText}`;
            customSuccessHandling(updateMessage);

        } else {
            if (!addToWishlistButton.classList.contains("variant-in-wishlist")) {
                swat.addToWishList(product, function (response) {
                    updateMessage = productTitle.textContent + " " + variantTitle.textContent + " has been added to your Wishlist!"
                    customSuccessHandling(updateMessage);
                }, function (error) {
                    // customErrorHandling(error.description);
                });
            } else {
                swat.removeFromWishList(product, function (response) {
                    updateMessage = productTitle.textContent + " " + variantTitle.textContent + " has been removed from your Wishlist";
                    customSuccessHandling(updateMessage);
                }, function (error) {

                });
            }
        }

        closeCollectionsModal();
    }

    function convertObjectToString(selectCallBackObj) {
        let str = "";
        for (let key in selectCallBackObj) {
            str += selectCallBackObj[key] + " / ";
        }
        return str.slice(0, -3);
    }

    function getSelectedVariant(selectCallBackObj) {
        let variants = productData.product.variants;
        let variantComboUnavailable = false;
        variants.forEach((variant) => {
            let filterTitle = convertObjectToString(selectCallBackObj);
            if (filterTitle == variant.title) {
                variantComboUnavailable = true;
                selectedVariant = variant;
                currentVariantId = variant.id
            }
        });
        if (!variantComboUnavailable) {
            addToWishlistButton.setAttribute("disabled");
            addToWishlistButton.textContent = "Combination Unavailable";
        } else {
            addToWishlistButton.removeAttribute("disabled");
            addToWishlistButton.textContent = "Update List";
        }
        isVariantPresentInLists();
    }

    function handleRadioButtonClick(event) {
        const selectedValue = event.target.value;
        const optionIndex = event.currentTarget.getAttribute("optionIndex");

        selectCallBackObj = {
            ...selectCallBackObj,
            [optionIndex]: selectedValue,
        };

        const labels = event.currentTarget.parentNode.querySelectorAll(
            `label[for="${event.target.id}"]`
        );
        labels.forEach((label) => {
            label.classList.add("selected");
        });

        const unselectedRadios = event.currentTarget.parentNode.querySelectorAll(
            `input[type="radio"]:not([value="${selectedValue}"])`
        );
        unselectedRadios.forEach((radio) => {
            const labels = event.currentTarget.parentNode.querySelectorAll(
                `label[for="${radio.id}"]`
            );
            labels.forEach((label) => {
                label.classList.remove("selected");
            });
        });

        toggleVariantData();
    }

    function createRadioGroup(option, optionIndex) {
        let variantOptions = option.values
            .map((value) => {
                let isSelected = value == selectedVariant[`option${optionIndex + 1}`];
                return `<input style="display: none;" selected="${isSelected}" id="${option.name}-${value}" type="radio" name="${option.name}" optionIndex="${optionIndex}" value="${value}" aria-label="${option.name} ${value}"></input>
                        <label class="swym-filter-labels" for="${option.name}-${value}">${value}</label>`;
            })
            .join("");

        const radioGroup = document.createElement("div");
        radioGroup.setAttribute("class", `${option.name} swym-filter-option-name`);
        radioGroup.innerHTML = `<div id="swymOptionName" selected value="${option.name}">${option.name}</div>
                                  <div class="swym-radio-buttons-container">${variantOptions}</div>`;

        const radioButtons = radioGroup.querySelectorAll(`[name="${option.name}"]`);
        for (let i = 0; i < radioButtons.length; i++) {
            radioButtons[i].addEventListener("click", function (event) {
                handleRadioButtonClick(event, productData);
            });
        }

        return radioGroup;
    }


    function renderVariantSelectors() {
        const optionsArray = productData.product.options;
        const variantSelectors = optionsArray.map((option, optionIndex) => {
            return createRadioGroup(option, optionIndex);
        });

        variantSelectors.forEach((variantSelector) => {
            variantSelectionContainer.append(variantSelector);
        });

        variantSelectors.forEach((variantSelector) => {
            const radioButtons = variantSelector.querySelectorAll(
                'input[type="radio"]'
            );
            if (radioButtons.length > 0) {
                radioButtons[0].click();
            }
        });

        addLists();
    }

    function closeCollectionsModal() {
        swymCollectionsModal.classList.add("swym-hide-container");
        variantSelectionContainer.innerHTML = '';
        imgBlobContainer.innerHTML = '';
        listIdContainer.innerHTML = '';
    }

    function openCollectionsModal() {
        swymCollectionsModal.classList.remove("swym-hide-container");
        globalActionArray = [];

        addProductData(productData);
    }

    function fetchProductDetails(event) {
        let rawUrl = event.target.attributes["data-product-url"].value;
        productURL = rawUrl.split("?")[0];

        let shopifyProductEndpoint = productURL + ".json";

        fetch(shopifyProductEndpoint)
            .then((res) => res.json())
            .then((productJson) => {
                productData = productJson;
                selectedVariant = productData.product.variants[0];
                openCollectionsModal();
            });
    }

    function addEventListeners() {
        let swymBtns = document.querySelectorAll("#swym-collections");
        for (let i = 0; i < swymBtns.length; i++) {
            swymBtns[i].addEventListener("click", debounce_leading(fetchProductDetails, 500));
        }
        modalCloseButton.addEventListener("click", closeCollectionsModal);
        addToWishlistButton.addEventListener("click", debounce_leading(updateVariantInLists, 500));
    }
    addEventListeners();
}
if (!window.SwymCallbacks) {
    window.SwymCallbacks = [];
}
window.SwymCallbacks.push(onSwymLoadCallback);


{% comment %} <svg id="swym-confirm-list-button" class="swym-list-creation-buttons" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="check_FILL1_wght600_GRAD0_opsz40 1">
<path id="Vector" d="M6.32222 11.8846C6.22721 11.8846 6.13619 11.8673 6.04916 11.8327C5.96212 11.7982 5.88165 11.744 5.80774 11.6701L2.84105 8.70338C2.69807 8.56038 2.62749 8.38426 2.62934 8.175C2.63119 7.96575 2.70362 7.78962 2.84662 7.64662C2.98961 7.50362 3.1632 7.43212 3.36739 7.43212C3.57158 7.43212 3.74727 7.50362 3.89446 7.64662L6.32222 10.0744L12.1007 4.30217C12.2437 4.15917 12.418 4.0861 12.6236 4.08297C12.8291 4.07982 13.0044 4.15289 13.1495 4.30217C13.2925 4.44517 13.364 4.62101 13.364 4.8297C13.364 5.0384 13.2925 5.21425 13.1495 5.35725L6.83672 11.6701C6.76281 11.744 6.68233 11.7982 6.59529 11.8327C6.50826 11.8673 6.41723 11.8846 6.32222 11.8846Z" fill="#393D51"/>
</g>
</svg> {% endcomment %}
{% comment %} <svg id="swym-notconfirm-list-button" class="swym-list-creation-buttons" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="16" height="16" fill="#1E1E1E"/>
<g id="Frame 24">
<rect x="-451" y="-517" width="505" height="648" rx="8" fill="white"/>
<g id="Group 7903">
<rect id="Rectangle 4" x="-232.5" y="-110.5" width="260" height="147" rx="3.5" fill="white" stroke="#EBEBEB"/>
<g id="Group 7902">
<g id="close_FILL1_wght600_GRAD0_opsz40 1">
<path id="Vector" d="M8 9.029L4.70338 12.3256C4.56038 12.4686 4.38888 12.5401 4.18888 12.5401C3.98888 12.5401 3.81738 12.4686 3.67438 12.3256C3.53139 12.1826 3.4599 12.0111 3.4599 11.8111C3.4599 11.6111 3.53139 11.4396 3.67438 11.2966L6.971 8L3.67438 4.70338C3.53139 4.56038 3.4599 4.38888 3.4599 4.18888C3.4599 3.98888 3.53139 3.81738 3.67438 3.67438C3.81738 3.53139 3.98888 3.4599 4.18888 3.4599C4.38888 3.4599 4.56038 3.53139 4.70338 3.67438L8 6.971L11.2966 3.67438C11.4396 3.53139 11.6111 3.4599 11.8111 3.4599C12.0111 3.4599 12.1826 3.53139 12.3256 3.67438C12.4686 3.81738 12.5401 3.98888 12.5401 4.18888C12.5401 4.38888 12.4686 4.56038 12.3256 4.70338L9.029 8L12.3256 11.2966C12.4686 11.4396 12.5401 11.6111 12.5401 11.8111C12.5401 12.0111 12.4686 12.1826 12.3256 12.3256C12.1826 12.4686 12.0111 12.5401 11.8111 12.5401C11.6111 12.5401 11.4396 12.4686 11.2966 12.3256L8 9.029Z" fill="#393D51"/></g></g></g> </g>
</svg> {% endcomment %}