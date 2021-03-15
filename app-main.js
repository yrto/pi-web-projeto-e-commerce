import database from "./app-db.js"

//
// - - - - - - - - - - - - - - - - - - - - help
//

const log = something => console.log(something)

//
// - - - - - - - - - - - - - - - - - - - - DOM locations
//

const pageBody = document.querySelector("body")
const productsSectionElementLocation = document.querySelector("#products section ul")
const navButtonsElementLocation = document.querySelector("#header .navbar .nav-buttons")

//
// - - - - - - - - - - - - - - - - - - - - pop-up
//

const popUpElementLocation = document.querySelector("#pop-up")
const popUpContentElementLocation = document.querySelector("#pop-up .content")
const popUpCloseButtonElementLocation = document.querySelector("#pop-up .close-button")

const closePopUp = () => {
    popUpElementLocation.classList.add("fade")
    setTimeout(() => popUpElementLocation.classList.add("hide"), 250)
    pageBody.classList.remove("stop-scrolling")
}

popUpCloseButtonElementLocation.addEventListener("click", closePopUp)

//
// - - - - - - - - - - - - - - - - - - - - shopping cart
//

let userShoppingCartLocalStorage = JSON.parse(localStorage.getItem("shopping-cart")) || []

const activateRemoveButtons = () => {
    const removeButtons = popUpContentElementLocation.querySelectorAll(".remove-button")
    removeButtons.forEach(product => product.addEventListener("click", function (event) {
        log("remove")
        userShoppingCart.removeProduct(event.currentTarget.dataset.id)
    }))
}

class ShoppingCart {
    constructor(localStorage) {
        this.productList = localStorage
        this.shoppingCartTotalPrice = 0
    }
    addProduct(id, amount) {
        const product = this.productList.find(product => product.id == id)
        if (product) { product.amount += amount }
        else { this.productList.push({ id: id, amount: amount }) }
        navButtons.updateButton("#shopping-cart-button")
        this.saveToStorage()
    }
    removeProduct(id) {
        const productIndex = this.productList.findIndex(product => product.id == id)
        this.productList.splice(productIndex, 1)
        navButtons.updateButton("#shopping-cart-button")
        popUpContentElementLocation.innerHTML = ""
        popUpContentElementLocation.appendChild(userShoppingCart.createShoppingCartPage())
        activateRemoveButtons()
        this.saveToStorage()
    }
    getLenght() {
        return this.productList.length
    }
    getTotal() {
        const total = this.productList.reduce((acc, product) => {
            const p = productList.getProductById(product.id)
            return acc + (product.amount * p.price)
        }, 0)
        return total
    }
    createShoppingCartPage() {
        // level 1
        const titleElement = document.createElement("h2")
        titleElement.appendChild(document.createTextNode("Carrinho de compras"))
        const shoppingCartTotalElement = document.createElement("h2")
        shoppingCartTotalElement.className = "shopping-cart-total"
        shoppingCartTotalElement.appendChild(document.createTextNode("Total:"))
        const shoppingCartTotalSpanElement = document.createElement("span")
        shoppingCartTotalSpanElement.appendChild(document.createTextNode("R$ " + this.getTotal().toFixed(2)))
        shoppingCartTotalElement.appendChild(shoppingCartTotalSpanElement)
        // level 2
        const shoppingCartUlElement = document.createElement("ul")
        this.productList.map(product => {
            const p = productList.getProductById(product.id)
            // level 1
            const productName = document.createElement("h3")
            productName.appendChild(document.createTextNode(p.name))
            const productAmount = document.createElement("p")
            productAmount.appendChild(document.createTextNode(product.amount))
            const productPrice = document.createElement("p")
            productPrice.appendChild(document.createTextNode("R$ " + p.price.toFixed(2)))
            const productPriceTotal = document.createElement("p")
            productPriceTotal.appendChild(document.createTextNode("R$ " + ((p.price * product.amount).toFixed(2))))
            const removeFromCartButton = document.createElement("button")
            removeFromCartButton.appendChild(document.createTextNode("Remover"))
            removeFromCartButton.setAttribute("data-id", product.id)
            removeFromCartButton.className = "remove-button"
            // level 2
            const shoppingCartLiElement = document.createElement("li")
            shoppingCartLiElement.appendChild(productName)
            shoppingCartLiElement.appendChild(productAmount)
            shoppingCartLiElement.appendChild(productPrice)
            shoppingCartLiElement.appendChild(productPriceTotal)
            shoppingCartLiElement.appendChild(removeFromCartButton)
            // final
            shoppingCartUlElement.appendChild(shoppingCartLiElement)
        })
        // level 4
        const shoppingCartPageElement = document.createElement("div")
        shoppingCartPageElement.className = "shopping-cart-page"
        shoppingCartPageElement.appendChild(titleElement)
        shoppingCartPageElement.appendChild(shoppingCartUlElement)
        shoppingCartPageElement.appendChild(shoppingCartTotalElement)
        // final
        return shoppingCartPageElement
    }
    saveToStorage() {
        localStorage.setItem("shopping-cart", JSON.stringify(this.productList));
    }
}

let userShoppingCart = new ShoppingCart(userShoppingCartLocalStorage)

//
// - - - - - - - - - - - - - - - - - - - - nav buttons
//

class NavButtons {
    constructor(navButtonsElementLocation) {
        this.wishlistIconClass = "fas fa-heart"
        this.shoppingCartIconClass = "fas fa-shopping-cart"
        this.navButtonsElementLocation = navButtonsElementLocation
    }
    createButton(iconClass, objectArray, buttonId) {
        const buttonIconElement = `<i class="${iconClass}" data-fa-transform="down-1"></i>`
        const amount = document.createElement("span")
        amount.appendChild(document.createTextNode(`${objectArray.length}`))
        const buttonElement = document.createElement("button")
        buttonElement.id = buttonId
        buttonElement.innerHTML += buttonIconElement
        buttonElement.appendChild(amount)
        return buttonElement
    }
    renderNavButtons() {
        // const wishlistButton = navButtons.createButton(
        //     this.wishlistIconClass, userWishlist, "wishlist-button")
        // this.navButtonsElementLocation.appendChild(wishlistButton)
        const shoppingCartButton = navButtons.createButton(
            this.shoppingCartIconClass, userShoppingCart.productList, "shopping-cart-button")
        this.navButtonsElementLocation.appendChild(shoppingCartButton)
        // show shopping cart
        const shoppingCartButtonLocation = document.querySelector("#shopping-cart-button")
        shoppingCartButtonLocation.addEventListener("click", () => {
            popUpElementLocation.classList.remove("hide")
            pageBody.classList.add("stop-scrolling")
            setTimeout(() => popUpElementLocation.classList.remove("fade"), 1)
            popUpContentElementLocation.innerHTML = ""
            popUpContentElementLocation.appendChild(userShoppingCart.createShoppingCartPage())
            activateRemoveButtons()
        })
    }
    updateButton(buttonId) {
        const amount = document.querySelector(`${buttonId} span`)
        amount.innerHTML = userShoppingCart.getLenght()
    }
}

//
// - - - - - - - - - - - - - - - - - - - - products
//

class ProductList {
    constructor(database) {
        this.products = database.map(product => product = new Product(product))
    }
    filterProducts(category) {
        return this.products.filter(product => product.category === category)
    }
    renderProductList(list, location) {
        list.map(product => location.appendChild(product.createSingleProduct()))
        const products = document.querySelectorAll("#products .single-product a")
        products.forEach(product => product.addEventListener("click", function (event) {
            const buttonId = event.currentTarget.dataset.id
            const productPageHtmlElement = (productList.getProductById(buttonId)).createProductPage()
            popUpElementLocation.classList.remove("hide")
            pageBody.classList.add("stop-scrolling")
            setTimeout(() => popUpElementLocation.classList.remove("fade"), 1)
            popUpContentElementLocation.innerHTML = ""
            popUpContentElementLocation.appendChild(productPageHtmlElement)
            log(productPageHtmlElement)
            // add to cart
            const addToCartButton = document.querySelector("#pop-up .add-to-cart")
            log(addToCartButton)
            addToCartButton.addEventListener("click", event => {
                log(event.currentTarget.dataset.id)
                userShoppingCart.addProduct(event.currentTarget.dataset.id, 1)
            })
        }))
    }
    getProductById(id) {
        let productFound
        this.products.map(product => { if (product.id == id) productFound = product })
        return productFound
    }
}

class Product {
    constructor(product) {
        this.id = product.id
        this.name = product.name
        this.img = product.img
        this.description = product.description
        this.category = product.category
        this.stock = product.stock
        this.price = product.price
    }
    createSingleProduct() {
        // level 1
        const imageElement = document.createElement("img")
        imageElement.setAttribute("src", this.img)
        imageElement.setAttribute("alt", this.name)
        const titleElement = document.createElement("h3")
        titleElement.appendChild(document.createTextNode(this.name))
        const priceElement = document.createElement("p")
        priceElement.appendChild(document.createTextNode("R$ " + this.price.toFixed(2)))
        priceElement.classList = "product-price"
        // links
        const linkImage = document.createElement("a")
        linkImage.setAttribute("href", "#")
        linkImage.setAttribute("data-id", this.id)
        linkImage.appendChild(imageElement)
        const linkTitle = document.createElement("a")
        linkTitle.setAttribute("href", "#")
        linkTitle.setAttribute("data-id", this.id)
        linkTitle.appendChild(titleElement)
        // level 2
        const productInfoElement = document.createElement("div")
        productInfoElement.className = "product-info"
        productInfoElement.appendChild(linkTitle)
        productInfoElement.appendChild(priceElement)
        //level 4
        const productElement = document.createElement("li")
        productElement.appendChild(linkImage)
        productElement.appendChild(productInfoElement)
        productElement.className = "single-product"
        // final
        return productElement
    }
    createProductPage() {
        // level 1
        const imageElement = document.createElement("img")
        imageElement.setAttribute("src", this.img)
        imageElement.setAttribute("alt", this.name)
        const titleElement = document.createElement("h3")
        titleElement.appendChild(document.createTextNode(this.name))
        const descriptionElement = document.createElement("p")
        descriptionElement.appendChild(document.createTextNode(this.description))
        const priceElement = document.createElement("p")
        priceElement.appendChild(document.createTextNode("R$ " + this.price.toFixed(2)))
        priceElement.classList = "product-price"
        const addToCartButtonElement = document.createElement("button")
        addToCartButtonElement.appendChild(document.createTextNode("Adicionar ao carrinho"))
        addToCartButtonElement.setAttribute("data-id", this.id)
        addToCartButtonElement.className = "add-to-cart"
        // level 2
        const productInfoElement = document.createElement("div")
        productInfoElement.className = "product-info"
        productInfoElement.appendChild(titleElement)
        productInfoElement.appendChild(descriptionElement)
        productInfoElement.appendChild(priceElement)
        productInfoElement.appendChild(addToCartButtonElement)
        // level 3
        const productPageElement = document.createElement("div")
        productPageElement.className = "product-page"
        productPageElement.appendChild(imageElement)
        productPageElement.appendChild(productInfoElement)
        // final
        return productPageElement
    }
}

//
// - - - - - - - - - - - - - - - - - - - - main
//

const productList = new ProductList(database)
const navButtons = new NavButtons(navButtonsElementLocation)

productList.renderProductList(productList.products, productsSectionElementLocation)
navButtons.renderNavButtons()

//
// - - - - - - - - - - - - - - - - - - - - tests
//

// log(productList.filterProducts("bebida")[0].createSingleProduct())

// log(userWishlist)
log(userShoppingCart.productList)

// log(productList.getProductById("0001"))

log(userShoppingCart.getTotal())