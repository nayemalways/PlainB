import  { useEffect } from 'react';
import CartStore from '../../store/cartStore';
import NoDataFound from '../product/NoDataFound';
import  toast  from 'react-hot-toast';
import CartButton from './CartButton';


const CartList = () => {
    const { CartListRequest, CartList, CartTotal, CartVatTotal, CartPayable, removeCartProduct, createInvoice, isChekout } = CartStore();

    // Invoked CatList
    useEffect(() => {
         (async () => {
            await CartListRequest();
         })()
    }, [])


    // cart product remove 
    const removeProduct = (productID) => {
        let res = removeCartProduct(productID);
        if(res) {
            toast.success("Removed item!");
            CartListRequest();
        }else {
            toast.error(res.slice(6, res.length));
        }
    }


    // UI
    if(CartList === null) {
        return <h1>loading...</h1>
    }else if(CartList.length === 0) {
        return <NoDataFound />
    }else {
        return (
            <>
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card p-4">
                                <ul className="list-group list-group-flush d-flex gap-4"> 
                                    { CartList.map((item,i)=>{ 
                                        return( 
                                        <li key={i} className="list-
                                            group-item d-flex justify-content-between align-items-start">
                                            <img className="rounded-1" width="90" height="auto" src={item['product']['image']} />
                                            <div className="ms-2 me-auto">
                                                <p className="fw-lighter m-0">{item['product']['title']}</p>
                                                <p className="fw-lighter my-1">Unit Price: {item["product"]["discount"] ? item["product"]["discountPrice"]: item["product"]["price"]},Qty: {item['qty']}, Size: {item['size']}, Color: {item['color']}</p>
                                                <p className=" h6 fw-bold m-0 text-dark">
                                                    Total: ৳
                                                    {
                                                        item["product"]["discount"] ? 
                                                        parseFloat(item["product"]["discountPrice"]) * parseFloat(item["qty"]): 
                                                        parseFloat(item["product"]["price"]) * parseFloat(item["qty"])
                                                    } Tk
                                                </p>
                                            </div>
                                            <button onClick={()=>removeProduct(item['productID'])} className="btn btn-sm btn-outline-danger"> 
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </li> ) }) 
                                    } 
                                </ul>
                            <div className="my-4">
                                <ul className="list-group bg-transparent list-group-flush">
                                    <li className="list-group-item bg-transparent h6 m-0 text-dark">
                                        <span className="float-end">Total: ৳ {CartTotal} Tk </span>
                                    </li>
                                    <li className="list-group-item bg-transparent h6 m-0 text-dark">
                                        <span className="float-end"> Vat(5%): ৳ {CartVatTotal} Tk
                                        </span>
                                    </li>
                                    <li className="list-group-item bg-transparent h6 m-0 text-dark">
                                        <span className="float-end"> Payable: ৳ {CartPayable} Tk
                                        </span>
                                    </li>
                                    <li className="list-group-item bg-transparent ">
                                        <span className="float-end">
                                        <CartButton 
                                            text="Check Out "
                                            isSubmit={isChekout} 
                                            onClick={ ()=> createInvoice()}
                                            className="btn px-5 mt-2 btn-success"
                                        />
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };
    }

    

export default CartList;