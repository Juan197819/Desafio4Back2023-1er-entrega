import fs from 'fs'
import productsList from './products.js'  

class ProductManager {
    constructor(pathProducts,pathCarts){
        this.pathProducts=pathProducts,
        this.pathCarts=pathCarts
    }
    async addProduct(product){
        if(product){
            const arrayProd = await this.getProducts()
            product.id = arrayProd.length + 1
            arrayProd.push(product)
            await fs.promises.writeFile(this.pathProducts, JSON.stringify(arrayProd))
            return product
        }else{
            return 'Datos incompletos, intentelo nuevamente'
        }
    }
    async getProducts(limit){
        if (fs.existsSync(this.pathProducts)) {
            const file = await fs.promises.readFile(this.pathProducts, 'utf-8')
            const fileParse = JSON.parse(file)
            limit&&fileParse.splice(limit)
            return fileParse 
        }else{
            //para crear productos.json la primera vez desde el array de products.js
            for (let i = 0; i < productsList.length; i++) {
                productsList[i].id =i +1
            }    
            await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsList))
            limit&&productsList.splice(limit)

            return productsList
        }
    }
    async getProductById(id){
        const products = await this.getProducts()
        const producto = products.find(product=>product.id==id)
        if(producto){
            return producto
        }else{
        return 'Not found'
        }
    }
    async updateProduct(id, product){
        const arrayProd = await this.getProducts()
        if (arrayProd.length&&id&&product) {
           if(!( arrayProd.find(p=>p.id==id)))return 'Producto inexistente, imposible actualizar'
            const updateArray = arrayProd.map( p => {
               if (p.id==id){
                    product.id=id
                   return product
                }else{
                    return p
                }
            })
            await fs.promises.writeFile(this.pathProducts, JSON.stringify(updateArray))
            return updateArray
        } else {
            return 'Error no se puede actualizar'
        }
    }
    async deleteProduct(id){
        const arrayProd = await this.getProducts()
        if (arrayProd.length&&id) {
            const newArray = arrayProd.filter(p=>p.id!=id)
            await fs.promises.writeFile(this.pathProducts, JSON.stringify(newArray))
            return (newArray);
        } else {
            return 'Error no se puede eliminar'
        }
    }
    async addCart(){
            const arrayCart = await this.getCarts()
            const newCart ={
                id: arrayCart.length + 1,
                products:[]
            }
            arrayCart.push(newCart)
            await fs.promises.writeFile(this.pathCarts, JSON.stringify(arrayCart))
            return newCart
    }
    async getCarts(id){
        if (fs.existsSync(this.pathCarts)) {
            const file = await fs.promises.readFile(this.pathCarts, 'utf-8')
            let fileParse = JSON.parse(file)
            console.log('vac',fileParse);
            if (id) fileParse = fileParse.filter(c=>c.id==id)
            return fileParse
        }else{
            return []
        }
    }
    async updateCart(cid, pid){
        let carts = await this.getCarts()
        let cart =carts.find(c=>c.id==cid)
        if (!cart) {
            response ='Carrito inexistente' 
        } else {
            let product =cart.products.find(p=>p.id==pid)
            if (product) {
                cart.products = cart.products.map( p => {
                    if (p.id==pid){
                         p.quantity+=1
                        return p
                     }else{
                         return p
                     }
                 })
            } else {
                cart.products.push({
                    id:pid,
                    quantity:1
                })
            }
        }
        let newCart =  carts.map(c=>{
        if (c.id==cart.id) {
                return cart
            } else {
                return c
            }
        })
        await fs.promises.writeFile(this.pathCarts, JSON.stringify(newCart))
        return newCart
    }

}
const productManager = new ProductManager('./productos.json', './carritos.json')

export default productManager

