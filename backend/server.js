const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const userRoute=require('./routes/userRoute');
const productRoute=require('./routes/productRoute');
const cartRoute=require('./routes/cartRoute');
const checkoutRoute=require('./routes/checkoutRoute');
const orderRoute=require('./routes/orderRoute');
const uploadRoute=require('./routes/uploadRoute');
const subscriberRoute=require('./routes/subscriberRoute');
const adminRoute=require('./routes/adminRoute');
const productAdminRoute=require('./routes/productAdminRoute');
const adminOrderRoute=require('./routes/adminOrderRoute');
const app=express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
const PORT=process.env.PORT ||3000;

connectDB();

//Api routes
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/checkout',checkoutRoute);
app.use('/api/orders',orderRoute);
app.use('/api/upload',uploadRoute);
app.use('/api',subscriberRoute);

//admin
app.use('/api/admin/users',adminRoute);
app.use('/api/admin/products',productAdminRoute);
app.use('/api/admin/orders',adminOrderRoute);
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})