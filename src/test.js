import productsList from './products.js'  
import productManager from './db.js'

const test = async (test)=>{
    console.log(await test);
}

//AGREGAR PRODUCTOS
await productManager.addProduct(productsList[0])
await productManager.addProduct(productsList[2])
await productManager.addProduct(productsList[1])

// //OBTENER TODOS LOS PRODUCTOS

await test(productManager.getProducts())

//OBTENER PRODUCTO POR ID (PRODUCTO EXISTENTE)
 await test(productManager.getProductById(3))

//ACTUALIZAR PRODUCTO POR ID

 await test(productManager.updateProduct(4,productsList[2]))

//ELIMINAR PRODUCTO POR ID
 await test(productManager.deleteProduct(1))