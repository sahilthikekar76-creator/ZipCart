import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/home'
import {Toaster} from "sonner"; 
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPages from './pages/CollectionPages';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrdersConfirmation from './pages/OrdersConfirmation';
import OrderDetails from './pages/OrderDetails';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductMangement from './components/Admin/ProductMangement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';

import {Provider} from 'react-redux';
import store from './redux/srore';
import ProtectedRoute from './components/Common/ProtectedRoute';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <Toaster position="rop-right"/>
      <Routes>
        <Route path='/' element={<UserLayout/>}>
            <Route index element={<Home/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="collections/:collection" element={<CollectionPages/>}/>
            <Route path="product/:id" element={<ProductDetails/>}/>
            <Route path="checkout" element={<Checkout/>}/>
            <Route path="/order-confirmation" element={<OrdersConfirmation/>}/>
            <Route path="order/:id" element={<OrderDetails/>}/>
             <Route path="my-orders" element={<MyOrdersPage/>}/>
        </Route>
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout/></ProtectedRoute>}>
        <Route index element={<AdminHomePage/>}/>
        <Route path="users" element={<UserManagement/>}/>
        <Route path="products" element={<ProductMangement/>}/>
        <Route path="products/:id/edit" element={<EditProductPage/>}/>
        <Route path="orders" element={<OrderManagement/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
