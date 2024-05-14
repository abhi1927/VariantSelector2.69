function onSwymLoadCallback(swat) {
    const currentLanguage = swat.retailerSettings.UI.Language ? swat.retailerSettings.UI.Language : 'english';
    const swymCollectionsModal = document.getElementById("swym-custom-collections-modal-background");
    const desktopModalTitle = document.getElementById("swym-custom-modal-title");
    const multipleListParentContainer = document.getElementById("swym-custom-multiple-list-parent-container");
    const selectPreferenceText = document.getElementById("swym-custom-select-preference-text");
    const selectListsText = document.getElementById("swym-custom-select-wishlists-text");
    const createListGuideText = document.getElementById("swym-list-guide-text");
    const webpageBody = document.querySelector("body");
    const modalCloseButton = document.getElementById("swym-custom-modal-close");
    const mobileModalTitle = document.getElementById("swym-custom-mobile-title");
    const createListModalTitle = document.getElementById("swym-create-list-title");
    const variantSelectionContainer = document.getElementById("swym-custom-variant-selector-container");
    const addToWishlistButton = document.getElementById("swym-custom-add-to-wishlist-button");
    const isSingleWishlist = !swat.retailerSettings.Wishlist.EnableCollections;
    const listIdContainer = document.getElementById("swym-custom-list-id-container");
    const createListButton = document.getElementById("swym-custom-create-list-button");
    const confirmListNameButton = document.getElementById("swym-custom-confirm-list-button");
    const createListContainer = document.getElementById("swym-custom-backdrop");
    const cancelListCreationButton = document.getElementById("swym-custom-notconfirm-list-button");
    const listNameInput = document.getElementById("swym-custom-new-list-name-input");
    const variantImage = document.getElementById("swym-custom-primary-image");
    const vendorTitle = document.getElementById("swym-custom-vendor-title");
    const productTitle = document.getElementById("swym-custom-product-title");
    const price = document.getElementById("swym-custom-variant-price");
    const variantTitle = document.getElementById("swym-custom-variant-title");
    const imgBlobContainer = document.getElementById("swym-custom-image-blob-container");
    const imageSliderContainer = document.getElementById("swym-custom-images-slide-container");
    const prevButton = document.getElementById("swym-custom-slide-arrow-prev");
    const nextButton = document.getElementById("swym-custom-slide-arrow-next");

    let arrayOfSwymCollectionsButtons;
    let variantImagesArray;
    let productData;
    let productURL;
    let selectedVariant = {};
    let currentVariantId;
    let globalActionArray = [];
    let globalListArray = [];
    let globalProductsInListArray = [];
    let selectCallBackObj = [];
    let updateMessage;

    const translationsObject = {
        'english': {
            defaultWishlistTitle: "My Wishlist ",
            desktopModalTitle: "Add to Wishlist",
            addedToSingleList: " Wishlist",
            addedToMultipleLists: " Wishlists",
            selectPreferenceText: "Select preference",
            selectWishlistText: "Select Wishlists to update",
            createListButtonText: "+ Create New Wishlist",
            createListInputPlaceHolder: "Enter name",
            addToWishlistTextNoListSelected: "Select List",
            addToWishlistTextAddState: "Add to Wishlist",
            addToWishlistTextUpdateState: "Update Lists",
            singleWishlistButtonAddText: "Add to Wishlist",
            singleWishlistButtonRemoveText: "Remove from Wishlist",
            createListModalTitle: "Create New Wishlist",
            createListGuideText: "Wishlist Name",
            confirmNewListButtonText: "Save",
            notificationAddText: "has been added to your Wishlist!",
            notificationRemoveText: "has been removed from your Wishlist",
            notificationUpdateText: "has been added to",
            listNameError: "List name must be at least 3 characters!",
            listNameNotUniqueError: " already exists! Please enter a unique name.",
            listLimitErrorMessage: "List limit of 10 Wishlists reached, please delete a wishlist to create newer wishlists.",
        },
        'french': {
            defaultWishlistTitle: "Ma liste d'envies ",
            addedToSingleList: " Liste de souhaits",
            addedToMultipleLists: " Listes de souhaits",
            desktopModalTitle: "Ajouter à la liste de souhaits",
            selectPreferenceText: "Sélectionnez la préférence",
            selectWishlistText: "Sélectionnez les listes de souhaits à mettre à jour",
            createListButtonText: "+ Créer une nouvelle liste de souhaits",
            createListInputPlaceHolder: "Entrez le nom",
            addToWishlistTextNoListSelected: "Sélectionner une liste",
            addToWishlistTextAddState: "Ajouter à la liste de souhaits",
            addToWishlistTextUpdateState: "Mettre à jour les listes",
            singleWishlistButtonAddText: "Ajouter à la liste de souhaits",
            singleWishlistButtonRemoveText: "Retirer de la liste de souhaits",
            createListModalTitle: "Créer une nouvelle liste de souhaits",
            createListGuideText: "Nom de la liste de souhaits",
            confirmNewListButtonText: "Enregistrer",
            notificationAddText: "a été ajouté à votre liste de souhaits !",
            notificationRemoveText: "a été retiré de votre liste de souhaits",
            notificationUpdateText: "a été mis à jour dans",
            listNameError: "Le nom de la liste doit comporter au moins 3 caractères !",
            listNameNotUniqueError: " existe déjà! Veuillez saisir un nom unique.",
            listLimitErrorMessage: "Limite de 10 listes de souhaits atteinte, veuillez supprimer une liste de souhaits pour en créer de nouvelles.",
        },
        'spanish': {
            defaultWishlistTitle: "mi lista de deseos ",
            addedToSingleList: " Lista de deseos",
            addedToMultipleLists: " Listas de deseos",
            desktopModalTitle: "Agregar a la lista de deseos",
            selectPreferenceText: "Seleccionar preferencia",
            selectWishlistText: "Seleccionar listas de deseos para actualizar",
            createListButtonText: "+ Crear nueva lista de deseos",
            createListInputPlaceHolder: "Ingrese su nombre",
            addToWishlistTextNoListSelected: "Seleccionar lista",
            addToWishlistTextAddState: "Agregar a la lista de deseos",
            addToWishlistTextUpdateState: "Actualizar listas",
            singleWishlistButtonAddText: "Agregar a la lista de deseos",
            singleWishlistButtonRemoveText: "Eliminar de la lista de deseos",
            createListModalTitle: "Crear nueva lista de deseos",
            createListGuideText: "Nombre de la lista de deseos",
            confirmNewListButtonText: "Guardar",
            notificationAddText: "se ha agregado a tu lista de deseos.",
            notificationRemoveText: "se ha eliminado de tu lista de deseos",
            notificationUpdateText: "se ha actualizado en",
            listNameError: "¡El nombre de la lista debe tener al menos 3 caracteres!",
            listNameNotUniqueError: " esiste già! Inserisci un nome univoco.",
            listLimitErrorMessage: "Límite de 10 listas de deseos alcanzado, elimina una lista de deseos para crear nuevas.",
        },
        'german': {
            defaultWishlistTitle: "Meine Wunschliste ",
            addedToSingleList: " Wunschliste",
            addedToMultipleLists: " Wunschlisten",
            desktopModalTitle: "Zur Wunschliste hinzufügen",
            selectPreferenceText: "Präferenz auswählen",
            selectWishlistText: "Wunschlisten zum Aktualisieren auswählen",
            createListButtonText: "+ Neue Wunschliste erstellen",
            createListInputPlaceHolder: "Name eingeben",
            addToWishlistTextNoListSelected: "Wählen Sie Liste aus",
            addToWishlistTextAddState: "Zur Wunschliste hinzufügen",
            addToWishlistTextUpdateState: "Listen aktualisieren",
            singleWishlistButtonAddText: "Zur Wunschliste hinzufügen",
            singleWishlistButtonRemoveText: "Aus der Wunschliste entfernen",
            createListModalTitle: "Neue Wunschliste erstellen",
            createListGuideText: "Name der Wunschliste",
            confirmNewListButtonText: "Speichern",
            notificationAddText: "wurde zu Ihrer Wunschliste hinzugefügt!",
            notificationRemoveText: "wurde aus Ihrer Wunschliste entfernt",
            notificationUpdateText: "wurde in aktualisiert",
            listNameError: "Der Listenname muss mindestens 3 Zeichen lang sein!",
            listNameNotUniqueError: " ist bereits vorhanden! Bitte geben Sie einen eindeutigen Namen ein.",
            listLimitErrorMessage: "Grenze von 10 Wunschlisten erreicht. Löschen Sie eine Wunschliste, um neue erstellen zu können.",
        },
        'italian': {
            defaultWishlistTitle: "La mia lista dei desideri",
            addedToSingleList: " Lista dei desideri",
            addedToMultipleLists: " Liste dei desideri",
            desktopModalTitle: "Aggiungi alla lista dei desideri",
            selectPreferenceText: "Seleziona preferenza",
            selectWishlistText: "Seleziona liste dei desideri da aggiornare",
            createListButtonText: "+ Crea nuova lista dei desideri",
            createListInputPlaceHolder: "Inserisci il nome",
            addToWishlistTextNoListSelected: "Seleziona Elenco",
            addToWishlistTextAddState: "Aggiungi alla lista dei desideri",
            addToWishlistTextUpdateState: "Aggiorna liste",
            singleWishlistButtonAddText: "Aggiungi alla lista dei desideri",
            singleWishlistButtonRemoveText: "Rimuovi dalla lista dei desideri",
            createListModalTitle: "Crea nuova lista dei desideri",
            createListGuideText: "Nome della lista dei desideri",
            confirmNewListButtonText: "Salva",
            notificationAddText: "è stato aggiunto alla tua lista dei desideri!",
            notificationRemoveText: "è stato rimosso dalla tua lista dei desideri",
            notificationUpdateText: "è stato aggiornato in",
            listNameError: "Il nome dell'elenco deve contenere almeno 3 caratteri!",
            listNameNotUniqueError: " esiste già! Inserisci un nome univoco.",
            listLimitErrorMessage: "Limite di 10 liste dei desideri raggiunto, elimina una lista dei desideri per crearne di nuove.",
        },
        'japanese': {
            defaultWishlistTitle: "私のウィッシュリスト ",
            addedToSingleList: " ウィッシュリスト",
            addedToMultipleLists: " ウィッシュリスト",
            desktopModalTitle: "ウィッシュリストに追加",
            selectPreferenceText: "選択してください",
            selectWishlistText: "更新するウィッシュリストを選択",
            createListButtonText: "+ 新しいウィッシュリストを作成",
            createListInputPlaceHolder: "名前を入力",
            addToWishlistTextNoListSelected: "リストの選択",
            addToWishlistTextAddState: "ウィッシュリストに追加",
            addToWishlistTextUpdateState: "リストを更新",
            singleWishlistButtonAddText: "ウィッシュリストに追加",
            singleWishlistButtonRemoveText: "ウィッシュリストから削除",
            createListModalTitle: "新しいウィッシュリストを作成",
            createListGuideText: "ウィッシュリストの名前",
            confirmNewListButtonText: "保存",
            notificationAddText: "がウィッシュリストに追加されました！",
            notificationRemoveText: "がウィッシュリストから削除されました",
            notificationUpdateText: "で更新されました",
            listNameError: "リスト名は少なくとも 3 文字である必要があります。",
            listNameNotUniqueError: " もう存在している！一意の名前を入力してください。",
            listLimitErrorMessage: "ウィッシュリストのリスト制限 10 件に達しました。新しいウィッシュリストを作成するにはウィッシュリストを削除してください。",
        },
    }

    const currentLanguageOption = translationsObject[currentLanguage] ? translationsObject[currentLanguage] : translationsObject['english'];
    let defaultWishlistTitle = currentLanguageOption.defaultWishlistTitle;

    (function addTextToModal() {
        desktopModalTitle.textContent = currentLanguageOption.desktopModalTitle;
        selectPreferenceText.textContent = currentLanguageOption.selectPreferenceText;
        selectListsText.textContent = currentLanguageOption.selectWishlistText;
        createListButton.textContent = currentLanguageOption.createListButtonText;
        createListGuideText.textContent = currentLanguageOption.createListGuideText;
        createListModalTitle.textContent = currentLanguageOption.confirmNewListButtonText;
        confirmListNameButton.textContent = currentLanguageOption.confirmNewListButtonText;
        listNameInput.setAttribute("placeholder", currentLanguageOption.createListInputPlaceHolder);
    })();

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
        swat.ui.uiRef.showSuccessNotification({ message: success });
    }

    async function persistWishlistButtonsState() {
        return new Promise((resolve, reject) => {
            let onSuccess = function (lists) {
                globalListArray = lists;
                lists.forEach((list) => {
                    list.listcontents.forEach((product) => {
                        let productId = product.empi;
                        let buttonToFill = document.querySelector(`button#swym-collections[data-product-id="${productId}"]`);
                        if (buttonToFill && !buttonToFill.classList.contains('swym-added')) {
                            SwymUtils.addClass(buttonToFill, "swym-added");
                        }
                    });
                });
                resolve();
            };

            let onError = function (error) {
                console.error("Error while fetching all Lists", error);
                reject(error);
            };

            swat.fetchLists({
                callbackFn: onSuccess,
                errorFn: onError,
            });
        });
    }

    async function handleRemoveFromWishlistButtonState(productId) {
        try {
            await persistWishlistButtonsState();
            const productIdExistsInSomeList = globalListArray.some((list) =>
                list.listcontents.some((product) => product.empi === productId)
            );

            if (!productIdExistsInSomeList) {
                const buttonToUnFill = document.querySelector(
                    `button#swym-collections[data-product-id="${productId}"]`
                );
                if (buttonToUnFill) {
                    SwymUtils.removeClass(buttonToUnFill, "swym-added");
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    function handleAddedToWishlistButtonState(productId) {
        let buttonToFill = document.querySelector(`button#swym-collections[data-product-id="${productId}"]`);
        if (buttonToFill && !buttonToFill.classList.contains('swym-added')) {
            SwymUtils.addClass(buttonToFill, "swym-added");
        }
    }

    swat.evtLayer.addEventListener(swat.JSEvents.removedFromWishlist, function (data) {
        let productId = data.detail.d.empi;
        handleRemoveFromWishlistButtonState(productId);
    });
    swat.evtLayer.addEventListener(swat.JSEvents.addedToWishlist, function (data) {
        let productId = data.detail.d.empi;
        handleAddedToWishlistButtonState(productId);
    });

    function showZoomedView() {
        const zoomedView = document.createElement('div');
        SwymUtils.addClass(zoomedView, 'zoomed-image');

        const zoomedImage = new Image();
        zoomedImage.src = variantImage.src;
        zoomedView.appendChild(zoomedImage);

        const closeButton = document.createElement('button');
        closeButton.setAttribute('aria-label', 'Close zoomed image');
        // closeButton.classList.add('swym-zoomed-image-close-button', 'close-button');
        SwymUtils.addClass(closeButton, 'swym-zoomed-image-close-button close-button');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(zoomedView);
        });
        zoomedView.appendChild(closeButton);

        document.body.appendChild(zoomedView);

        zoomedView.addEventListener('click', (event) => {
            if (event.target === zoomedView) {
                document.body.removeChild(zoomedView);
            }
        });
    }

    function addImgBlobClickListener(event) {
        const imgBlobSrc = event.target.getAttribute("src");
        const allImgBlobs = document.querySelectorAll("#swym-custom-image-blob");
        variantImage.src = imgBlobSrc;

        allImgBlobs.forEach((imgBlob) => {
            if (imgBlob !== event.target) {
                // imgBlob.classList.remove("selected");
                SwymUtils.removeClass(imgBlob, "selected");
            }
        });

        SwymUtils.toggleClass(event.target, "selected")
    }

    function addImageSliderEventListeners() {
        const slide = document.querySelector(".swym-custom-slider-image");
        nextButton.addEventListener("click", () => {
            const slideWidth = slide.clientWidth;
            imageSliderContainer.scrollLeft += slideWidth;
        });

        prevButton.addEventListener("click", () => {
            const slideWidth = slide.clientWidth;
            imageSliderContainer.scrollLeft -= slideWidth;
        });
    }

    function initializeSwipeableImageSlider() {
        let imageSlides = [];

        variantImagesArray.forEach((image, index) => {
            const imageSlide = document.createElement('img');
            imageSlide.src = image.src;
            imageSlide.ariaLabel = `product-image-${index}`;
            imageSlide.className = 'swym-custom-slider-image';
            imageSlide.width = '250';
            imageSlide.height = '250';
            imageSlide.addEventListener("click", showZoomedView);

            imageSlides.push(imageSlide);
            imageSliderContainer.appendChild(imageSlide);
        });

        addImageSliderEventListeners();
    }

    function addImageCarousel() {
        variantImagesArray = productData.product.images;
        initializeSwipeableImageSlider();
        const imgTags = variantImagesArray.map((image, index) => {
            const imgTag = document.createElement('img');
            imgTag.width = "24";
            imgTag.height = "24";
            imgTag.ariaLabel = `Product Secondary Image-${index}`;
            imgTag.id = `swym-custom-image-blob`;
            imgTag.src = image.src;

            imgTag.addEventListener("click", addImgBlobClickListener);

            return imgTag;
        });

        imgBlobContainer.innerHTML = '';
        imgBlobContainer.append(...imgTags);
    }

    function updateListHandler() {
        let listInputs = document.querySelectorAll(".swym-custom-list-button");
        globalActionArray = [];
        listInputs.forEach((input) => {
            if (!input.checked && input.classList.contains("variant-in-wishlist")) {
                globalActionArray.push({
                    actionType: 'remove',
                    listId: `${input.getAttribute("data-list-id")}`
                });

            } else if (input.checked && !input.classList.contains("variant-in-wishlist")) {
                globalActionArray.push({
                    actionType: 'add',
                    listId: `${input.getAttribute("data-list-id")}`
                });
            }
        });
        toggleAddToWishlistButtonState();
    }

    function isVariantPresentInLists() {
        if (!isSingleWishlist) {
            globalListArray.forEach((list) => {
                const listId = list.lid;
                const listInput = document.querySelector(`.swym-custom-list-button[data-list-id="${listId}"]`);
                const variantIsPresent = listInput && list.listcontents.some((variant) => variant.epi === currentVariantId);

                if (listInput) {
                    listInput.checked = variantIsPresent;
                    listInput.classList.toggle("variant-in-wishlist", variantIsPresent);
                }
            });
        } else {
            const variantInWishlist = globalProductsInListArray.some((product) => product.epi === currentVariantId);

            addToWishlistButton.classList.toggle("variant-in-wishlist", variantInWishlist);
            // SwymUtils.toggleClass(addToWishlistButton, "variant-in-wishlist", variantInWishlist);
            addToWishlistButton.textContent = variantInWishlist ? currentLanguageOption.singleWishlistButtonRemoveText : currentLanguageOption.addToWishlistTextAddState;
        }
        toggleAddToWishlistButtonState();
    }

    function listSelectionEventlistener() {
        const listInputs = document.querySelectorAll(".swym-custom-list-button");
        listInputs.forEach((input) => {
            input.addEventListener("click", (e) => {
                if (e.target.classList.contains("selected")) {
                    // e.target.classList.remove("selected");
                    SwymUtils.removeClass(e.target, "variant-in-wishlist");
                } else {
                    // e.target.classList.add("selected");
                    SwymUtils.addClass(e.target, "variant-in-wishlist");
                }
                updateListHandler();
            });
        });
        isVariantPresentInLists();
    }

    function addLists() {
        if (!isSingleWishlist) {
            // multipleListParentContainer.classList.remove("swym-hide-container");
            // createListButton.classList.remove("swym-hide-container");
            SwymUtils.removeClass(multipleListParentContainer, "swym-hide-container");
            SwymUtils.removeClass(createListButton, "swym-hide-container");
            const onSuccess = (lists) => {
                globalListArray = lists;
                listIdContainer.innerHTML = lists.map((list) => `
                    <div id="swym-input-and-label-wrapper">
                        <input id="${list.lid}-${productData.product.id}" aria-label="Select ${list.lname}" class="swym-custom-list-button" type="checkbox" data-list-id="${list.lid}">
                        <label class="swym-custom-list-label" aria-label="Select ${list.lname}" data-list-id="${list.lid}" for="${list.lid}-${productData.product.id}">${list.lname} (${list.listcontents.length})</label>
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
        const currentVariantTitle = selectedVariant.title.replace(/\//g, "");
        const currentVariantPrice = swat.currency + ": " + selectedVariant.price;
        const imageId = selectedVariant.image_id;

        vendorTitle.innerHTML = "By: " + currentProductVendor;
        productTitle.innerHTML = currentProductTitle;
        variantTitle.innerHTML = currentVariantTitle;
        price.innerHTML = currentVariantPrice;

        for (let i = 0; i < alterNateVariantImages.length; i++) {
            if (alterNateVariantImages[i].id == imageId) {
                variantImage.setAttribute("src", alterNateVariantImages[i].src);
            } else {
                variantImage.setAttribute("src", productData.product.image.src);
            }
        }
    }

    function addProductData() {
        const product = productData.product;
        variantImage.src = product.image.src;
        vendorTitle.innerHTML = product.vendor;
        productTitle.innerHTML = product.title;
        mobileModalTitle.textContent = product.title;
        price.innerHTML = product.variants[0].price;

        addLists();
        addImageCarousel();
        renderVariantSelectors(productData);
    }

    (function toggleCreateList() {
        createListButton.addEventListener("click", () => {
            defaultWishlistTitle = defaultWishlistTitle + (globalListArray.length + 1);
            if (globalListArray.length == 10) {
                updateMessage = currentLanguageOption.listLimitErrorMessage;
                customErrorHandling(updateMessage);
            } else {
                // createListContainer.classList.remove("swym-hide-container");
                SwymUtils.removeClass(createListContainer, "swym-hide-container");
                createListButton.setAttribute("disabled", true);
                listNameInput.value = defaultWishlistTitle;
                listNameInput.select();
            }
        });
        cancelListCreationButton.addEventListener("click", () => {
            // createListContainer.classList.add("swym-hide-container");
            SwymUtils.addClass(createListContainer, "swym-hide-container");
            createListButton.removeAttribute("disabled");
        });
        createListContainer.addEventListener("click", (e) => {
            if (e.target === createListContainer) {
                // createListContainer.classList.add("swym-hide-container");
                SwymUtils.addClass(createListContainer, "swym-hide-container");
                createListButton.removeAttribute("disabled");
            }
        })
    })();

    (function addCreateListEventListener() {
        confirmListNameButton.addEventListener("click", () => {
            let listNameAlreadyExists = false;

            const listConfig = {
                "lname": listNameInput.value,
            };

            globalListArray.forEach((list) => {
                if (list.lname == listConfig.lname) {
                    listNameAlreadyExists = true;
                }
            });

            const onSuccess = (newList) => {
                addLists();
                // createListContainer.classList.add("swym-hide-container");
                SwymUtils.addClass(createListContainer, "swym-hide-container");
            };

            const onError = (error) => customErrorHandling(error.description);

            if (listConfig.lname.length < 3) {
                updateMessage = currentLanguageOption.listNameError;
                customErrorHandling(updateMessage);
                listNameInput.value = "";
                listNameInput.focus();
                listNameInput.select();
            }
            else if (listNameAlreadyExists) {
                updateMessage = `${listConfig.lname} + ${currentLanguageOption.listNameNotUniqueError}`;
                customErrorHandling(updateMessage);
                listNameInput.value = "";
                listNameInput.focus();
                listNameInput.select();
            } else {
                swat.createList(listConfig, onSuccess, onError);
                createListButton.removeAttribute("disabled");
            }
        });
    })();

    function toggleAddToWishlistButtonState() {
        if (!isSingleWishlist) {
            if (globalActionArray.length === 0) {
                addToWishlistButton.setAttribute("disabled", true);
                addToWishlistButton.textContent = currentLanguageOption.addToWishlistTextNoListSelected;
            } else {
                const hasRemoveAction = globalActionArray.some((action) => action.actionType === 'remove');
                addToWishlistButton.removeAttribute("disabled");
                addToWishlistButton.textContent = hasRemoveAction ? currentLanguageOption.addToWishlistTextUpdateState : currentLanguageOption.addToWishlistTextAddState;
            }
        }
    }


    function updateVariantInLists() {
        const product = {
            epi: currentVariantId,
            empi: productData.product.id,
            du: productURL
        };

        const { addToLids, removeFromLids } = separateListActions();

        if (!isSingleWishlist) {
            handleAddToLists(product, addToLids);
            handleRemoveFromLists(product, removeFromLids);
            const updateMessage = generateUpdateMessage();
            customSuccessHandling(updateMessage);
        } else {
            handleSingleWishlist(product);
        }

        closeCollectionsModal();
    }

    function separateListActions() {
        const addToLids = [];
        const removeFromLids = [];

        globalActionArray.forEach((listAction) => {
            if (listAction.actionType === 'add') {
                addToLids.push(listAction.listId);
            } else if (listAction.actionType === 'remove') {
                removeFromLids.push(listAction.listId);
            }
        });

        return { addToLids, removeFromLids };
    }

    function handleAddToLists(product, addToLids) {
        if (addToLids.length > 0) {
            const onSuccess = (response) => { };
            const onError = (error) => customErrorHandling(error.description);
            swat.addProductToLists(product, addToLids, onSuccess, onError);
        }
    }

    function handleRemoveFromLists(product, removeFromLids) {
        if (removeFromLids.length > 0) {
            const onSuccess = (response) => { };
            const onError = (error) => customErrorHandling(error.description);
            swat.removeProductFromLists(product, removeFromLids, onSuccess, onError);
        }
    }

    function generateUpdateMessage() {
        const listLength = globalActionArray.length;
        const listText = listLength > 1 ? currentLanguageOption.addedToMultipleLists : currentLanguageOption.addedToSingleList;
        return `${productTitle.textContent} ${variantTitle.textContent} ${currentLanguageOption.notificationUpdateText} ${listLength}${listText}`;
    }

    function handleSingleWishlist(product) {
        if (!addToWishlistButton.classList.contains("variant-in-wishlist")) {
            swat.addToWishList(product, (response) => {
                const updateMessage = `${productTitle.textContent} ${variantTitle.textContent} ${currentLanguageOption.notificationAddText}`;
                customSuccessHandling(updateMessage);
            }, (error) => { });
        } else {
            swat.removeFromWishList(product, (response) => {
                const updateMessage = `${productTitle.textContent} ${variantTitle.textContent} ${currentLanguageOption.notificationRemoveText}`;
                customSuccessHandling(updateMessage);
            }, (error) => { });
        }
    }

    function convertObjectToString(selectCallBackObj) {
        return Object.values(selectCallBackObj).join(" / ");
    }

    function getSelectedVariant(selectCallBackObj) {
        globalActionArray = [];
        const variants = productData.product.variants;
        let variantComboUnavailable = false;
        variants.forEach((variant) => {
            const filterTitle = convertObjectToString(selectCallBackObj);
            if (filterTitle == variant.title) {
                variantComboUnavailable = true;
                selectedVariant = variant;
                currentVariantId = variant.id;
            }
        });
        if (!variantComboUnavailable) {
            addToWishlistButton.setAttribute("disabled", true);
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
            // label.classList.add("selected");
            SwymUtils.addClass(label, "selected");
        });

        const unselectedRadios = event.currentTarget.parentNode.querySelectorAll(
            `input[type="radio"]:not([value="${selectedValue}"])`
        );
        unselectedRadios.forEach((radio) => {
            const labels = event.currentTarget.parentNode.querySelectorAll(
                `label[for="${radio.id}"]`
            );
            labels.forEach((label) => {
                // label.classList.remove("selected");
                SwymUtils.removeClass(label, "selected");
            });
        });

        toggleVariantData();
    }

    function createRadioGroup(option, optionIndex) {
        const variantOptions = option.values
            .map((value) => {
                const isSelected = value == selectedVariant[`option${optionIndex + 1}`];
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

        variantSelectionContainer.innerHTML = '';
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
    }

    function closeCollectionsModal() {
        selectCallBackObj = {};
        // swymCollectionsModal.classList.add("swym-hide-container");
        // webpageBody.classList.remove("swym-modal-active");
        SwymUtils.addClass(swymCollectionsModal, "swym-hide-container");
        SwymUtils.removeClass(webpageBody, "swym-modal-active");
        imageSliderContainer.innerHTML = '';
        variantSelectionContainer.innerHTML = '';
        imgBlobContainer.innerHTML = '';
        listIdContainer.innerHTML = '';
    }

    function openCollectionsModal() {
        addProductData(productData);

        // swymCollectionsModal.classList.remove("swym-hide-container");
        SwymUtils.removeClass(swymCollectionsModal, "swym-hide-container");
        // webpageBody.classList.add("swym-modal-active");
        SwymUtils.addClass(webpageBody, "swym-modal-active");
        variantImage.addEventListener("click", showZoomedView);
        globalActionArray = [];

        window.addEventListener("click", (event) => {
            if (event.target === swymCollectionsModal) {
                closeCollectionsModal();
            }
        });
    }


    function fetchProductDetails(event) {
        const rawUrl = event.target.attributes["data-product-url"].value;
        productURL = rawUrl.split("?")[0];
        const shopifyProductEndpoint = productURL + ".json";
        fetch(shopifyProductEndpoint)
            .then((res) => res.json())
            .then((productJson) => {
                productData = productJson;
                selectedVariant = productData.product.variants[0];
                openCollectionsModal();
            });
    }

    function addEventListeners() {
        arrayOfSwymCollectionsButtons = document.querySelectorAll("#swym-collections");
        if (arrayOfSwymCollectionsButtons){
            for (let i = 0; i < arrayOfSwymCollectionsButtons.length; i++) {
                arrayOfSwymCollectionsButtons[i].addEventListener("click", debounce_leading(fetchProductDetails, 500));
                SwymUtils.addClass(arrayOfSwymCollectionsButtons[i], "swym-custom-loaded");
            }
        }
        modalCloseButton.addEventListener("click", closeCollectionsModal);
        addToWishlistButton.addEventListener("click", debounce_leading(updateVariantInLists, 500));
        persistWishlistButtonsState();
    }

    addEventListeners();
}

if (!window.SwymCallbacks) {
    window.SwymCallbacks = [];
}

window.SwymCallbacks.push(onSwymLoadCallback);



