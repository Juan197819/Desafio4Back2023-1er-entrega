import express, {Router} from "express";
import productManager from './src/db.js'

const app = express()
const routerProducts = Router()
const routerCarts = Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

routerProducts.get('/',async (req,res)=>{
    const {limit} = req.query
    const productos = await productManager.getProducts(limit)
    console.log(productos);
    res.json(productos)
}) 
routerProducts.get('/:pid',async (req,res)=>{
    const {pid} = req.params
    res.json(await productManager.getProductById(pid))
})
routerProducts.post('/',async (req,res)=>{
    const product = req.body
    res.json(await productManager.addProduct(product))
})
routerProducts.put('/:pid',async (req,res)=>{
    const product = req.body
    const {pid} = req.params
    res.json(await productManager.updateProduct(pid, product))
})
routerProducts.delete('/:pid',async (req,res)=>{
    const {pid} = req.params
    res.json(await productManager.deleteProduct(pid))
})
routerCarts.post('/',async (req,res)=>{
    res.json(await productManager.addCart())
})
routerCarts.get('/:cid',async (req,res)=>{
    const {cid} = req.params
    const cart = await productManager.getCarts(cid)
    let response
    if (cart.length) {
        response= cart[0].products
    } else {
        response ='Carrito inexistente' 
    }
    res.json(response)
})
routerCarts.post('/:cid/product/:pid',async (req,res)=>{
    const {cid, pid} = req.params
    const cart = await productManager.updateCart(cid,pid)
    res.json(cart)
})


const PORT  = 8080
const server = app.listen(PORT,()=>{
    console.log('Escuchando en puerto ' +server.address().port)
}).on('error',err=>console.log('Fallo el servidor',err))