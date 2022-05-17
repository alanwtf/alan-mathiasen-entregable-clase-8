const express = require("express");
const app = express();
const { Router } = express;
const Contenedor = require("./Contenedor");

app.use("/form", express.static(__dirname + "/public"));

const productsRouter = Router();
productsRouter.use(express.json());
productsRouter.use(express.urlencoded({ extended: true }));

const PORT = 8080;

const container = new Contenedor();

productsRouter.get("", (req, res) => {
    const allProducts = container.getProducts();
    return res.json(allProducts);
});

productsRouter.get("/:id", (req, res) => {
    const product = container.getProductById(req.params.id);
    return product
        ? res.json(product)
        : res.send({ error: "Producto no encontrado" });
});

productsRouter.post("", (req, res) => {
    const product = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    };
    const newProduct = container.addProduct(product);
    return res.json(newProduct);
});

productsRouter.put("/:id", (req, res) => {
    const product = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    };
    const updated = container.updateProduct(req.params.id, product);
    return updated
        ? res.sendStatus(204)
        : res.send({ error: "Producto no encontrado" });
});

productsRouter.delete("/:id", (req, res) => {
    const deleted = container.deleteProduct(req.params.id);
    return deleted
        ? res.sendStatus(204)
        : res.send({ error: "Producto no encontrado" });
});

app.use("/api/products", productsRouter);

const server = app.listen(PORT, () => {
    console.log(`server escuchando en puerto ${PORT}`);
});

server.on("error", (error) => console.log(`Error en server ${error}`));
