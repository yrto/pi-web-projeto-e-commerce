import database from "./app-db.js"

//
// - - - - - - - - - - - - - - - - - - - - help
//

const log = something => console.log(something)

//
// - - - - - - - - - - - - - - - - - - - - locations
//

const productsSection = document.querySelector("#products section ul")

//
// - - - - - - - - - - - - - - - - - - - - classes
//

class ProductList {
    constructor(data) {
        this.products = data.map(product => product = new Product(product))
    }
    renderProducts(list, location) {
        list.map(product => location.appendChild(product.renderSingleProduct()))
    }
    filterProducts(category) {
        return this.products.filter(product => product.category === category)
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
    renderSingleProduct() {
        const imageElement = document.createElement("img")
        imageElement.setAttribute("src", this.img)
        imageElement.setAttribute("alt", this.name)
        const descriptionElement = document.createElement("p")
        descriptionElement.appendChild(document.createTextNode(this.name))
        const productElement = document.createElement("li")
        productElement.appendChild(imageElement)
        productElement.appendChild(descriptionElement)
        return productElement
    }
}

//
// - - - - - - - - - - - - - - - - - - - - nav-functions
//

const buttons = document.querySelectorAll(".nav-functions a")

// buttons.addEventListener("mouseover", click)

//
// - - - - - - - - - - - - - - - - - - - - tests
//

const db = new ProductList(database)

db.renderProducts(db.products, productsSection)

log(typeof db)

log(db.filterProducts("bebida")[0].renderSingleProduct())
log(productsSection)