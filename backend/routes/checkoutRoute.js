const express=require('express');
const Checkout=require('../model/checkoutModel');
const Cart=require('../model/cartModel');
const Product=require('../model/productModel');
const Order=require('../model/orderModel');
const {protect}=require('../middleware/authMiddleware');

const router=express.Router();
//POST/api/checkout
//create a new checkout session
//acess private
router.post("/",protect,async(req,res)=>{
    const {checkoutItems,shippingAddress,paymentMethod,totalPrice}=req.body;

    if(!checkoutItems || checkoutItems.length===0){
        return res.status(400).json({message:"no items in checkout"});
    }
    try {
        //create a new checkout session
        const newCheckout=await Checkout.create({
            user:req.user._id,
            checkoutItems:checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus:"Pending",
            isPaid:false,
        });
        console.log(`checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Error creating checkout session:",error);
        res.status(500).json({message:"Server Error"});
    }
})

//PUT/api/checkout/:id.pay
//update  checkout to mark as paid after sucessful payment
//acess private

router.put('/:id/pay',protect,async(req,res)=>{
    const{paymentStatus,paymentDetails}=req.body;
    try {
        const checkout=await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"checkout not found"});
        }
        if(paymentStatus==="paid"){
            checkout.isPaid=true;
            checkout.paymentStatus=paymentStatus;
            checkout.paymentDetails=paymentDetails;
            checkout.paidAt=Date.now();
            await checkout.save();
            
            res.status(200).json(checkout);
        }else{
            res.status(400).json({message:"Invalid payment status"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
});

//POST/api/checkout/:id/finalize
//finalize the checkout and convert to an order after payment confirmation
//acess private

router.post('/:id/finalize',protect,async(req,res)=>{
    try {
        const checkout=await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Checkout not found"});
        }
        if(checkout.isPaid && !checkout.isFinalized){
            //create final order based on the checkout details
            const finalOrder=await Order.create({
                user:checkout.user,
                orderItems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                paymentDetails:checkout.paymentDetails,
            });
            //mark the checkout as finalized
            checkout.isFinalized=true;
            checkout.finalizedAt=Date.now();
            await checkout.save();
            //delete the cart associated with the user
            await Cart.findOneAndDelete({user:checkout.user});
            res.status(201).json(finalOrder);
        }else if(checkout.isFinalized){
            res.status(400).json({message:"checkout already finalized"});
        }else{
            res.status(400).json({message:"checkout is not paid"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

module.exports=router;