const express=require('express');
const Product=require('../model/productModel');
const {protect,admin}=require('../middleware/authMiddleware')
const router=express.Router();

///api/products create a new product acess private/admin
router.post('/',protect,admin,async(req,res)=>{
    try{
        const{name,description,price,discountPrice,
        countInStock,category,brand,sizes,colors,
        collections,material,gender,images,
    isFeatured,isPublished,tags,dimensions,weight,sku}=req.body;

    const product=new Product({
        name,description,price,discountPrice,
        countInStock,category,brand,sizes,colors,
        collections,material,gender,images,
    isFeatured,isPublished,tags,dimensions,weight,sku,
    user:req.user._id //reference to the admin user eho created it
    });

    const createdProduct=await product.save();
    res.status(201).json(createdProduct);
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})


//PUT/api/products/:id
//updating product by id acess admin private

router.put('/:id',protect,admin,async(req,res)=>{
    try{

        const{name,description,price,discountPrice,
        countInStock,category,brand,sizes,colors,
        collections,material,gender,images,
    isFeatured,isPublished,tags,dimensions,weight,sku}=req.body;

    //find product using id
    const product=await Product.findById(req.params.id);
    if(product){
        product.name=name || product.name;
        product.description=description || product.description;
        product.price=price || product.price;
        product.discountPrice=discountPrice || product.discountPrice;
        product.countInStock=countInStock || product.countInStock;
        product.category=category || product.category;
        product.brand=brand || product.brand;
        product.sizes=sizes || product.sizes;
        product.colors=colors || product.colors;
        product.collections=collections || product.collections;
        product.material=material || product.material;
        product.gender=gender || product.gender;
        product.images=images|| product.images;
        product.isFeatured=isFeatured!==undefined?isFeatured:product.isFeatured;
        product.isPublished=isPublished!==undefined?isPublished:product.isPublished;
        product.tags=tags || product.tags;
        product.dimensions=dimensions || product.dimensions;
        product.weight=weight || product.weight;
        product.sku=sku || product.sku;

        //save updated product
        const updatedProduct=await product.save();
        res.json(updatedProduct);
    }else{
        res.status(404).json({message:"Product not found"});
    }

    }catch(err){
        console.error(err);
        res.status(500).send("server Error");
    }
   
})


 //DELETE /api/product/:id
    //delete a product
    //acess private addmin
router.delete('/:id',protect,admin,async(req,res)=>{
        try{
            const product=await Product.findById(req.params.id);

            if(product){
                //remove datatbase
                await product.deleteOne();
                res.json({message:"Product removed"});
            }else{
                res.status(404).json({message:"Product not found"});
            }

        }catch(err){
            console.error(err);
            res.status(500).json({message:"Server error"});
        }
})

//GET/api/products
//get all products with optional query filters
//acess public

router.get('/',async(req,res)=>{
    try{
        const {collections,size,color,gender,minPrice,maxPrice,
            sortBy,search,category,material,brand,limit
        }=req.query;

        let query={};

        //filter logic
        if(collections && collections.toLocaleLowerCase()!=="all"){
            query.collections=collections;
        }
        if(category && category.toLocaleLowerCase()!=="all"){
            query.category=category;
        }
        if(material){
            query.material={$in:material.split(",")};
        }
        if(brand){
            query.brand={$in:brand.split(",")};
        }
        if(size){
            query.sizes={$in:size.split(",")};
        }
        if(color){
            query.colors={$in:[color]};
        }
         if(gender){
            query.gender=gender;
        }
        if(minPrice || maxPrice){
            query.price={};
            if(minPrice)query.price.$gte=Number(minPrice);
            if(maxPrice)query.price.$lte=Number(maxPrice);
        }
        if(search){
            query.$or=[
                {name:{$regex:search,$options:"i"}},
                {description:{$regex:search,$options:"i"}},
            ];
        }
        //sort
        let sort={}; 
        if(sortBy){
                switch (sortBy){
                    case "priceAsc":
                        sort={price:1};
                        break;
                    case "priceDsc":
                        sort={price:-1};
                        break;
                    case "popularity":
                        sort={rating:-1};
                        break;
                    default:
                        break;
                }
        }

        //fetch product from database
        let products=await Product.find(query).sort(sort).limit(Number(limit) ||0);
        res.json(products);
    }catch(err){
        console.error(err);
        res.status(500).send("server failed");
    }
})


//GET/api/products/best-seller
//the product with highest rating
//acess public

router.get("/best-seller",async(req,res)=>{
    try {
      const bestSeller=await Product.findOne().sort({rating:-1});
      if(bestSeller){
        res.json(bestSeller);
      }else{
        res.status(404).json({message:"No Best Seller found"});
      }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})

//GET/api/products/new-arrivals
//latest 8 products-creation date acesss public
router.get('/new-arrivals',async(req,res)=>{
    try {
        //fetch 8 latest products
        const newArrivals=await Product.find().sort({createdAt:-1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).send("server error");
    }
})

//GET/api/products/similar/:id
//similar products based on current products gender and category
//acess public
router.get("/similar/:id",async(req,res)=>{
    const{id}=req.params;
    try {
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        const similarProducts=await Product.find({
            _id:{$ne:id},//exclude current product id
            gender:product.gender,
            category:product.category,
        }).limit(4);
        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})

//GET/api/products/:id
//get a single product by ID aceess public

router.get('/:id',async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(err){
        console.error(err);
        res.status(500).send("Server error");
    }
})



module.exports=router;