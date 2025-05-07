import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import logo from '../../assets/images/plainb-logo.svg';
import ProductStore from '../../store/productStore';
import UserStore from '../../store/userStore';
import CartStore from '../../store/cartStore';
import WishStore from '../../store/wishStore';

const Navbar = () => {
    const { searchKeyword , setSearchKeyword  } = ProductStore();
    const { logoutRequest } = UserStore();
    const { isLogin } = UserStore();
    const { CartCount, CartListRequest } = CartStore();
    const { WishCount, WishListRequest } = WishStore();

    // Logout handle
    const logoutHandle = async () => {
        const res = await logoutRequest();
        res ? ( location.reload()) : (toast.error("Something went wrong"))
    }

    useEffect(() => {
        let isLogin = !!Cookies.get("token");
        if(isLogin) {
            (async () => {
                await CartListRequest();
                await WishListRequest();
            })()
        }
    }, [])


    return (
        <>
            {/* Top Nav  */}
            <div className="container-fluid text-white p-2 bg-danger">
                <div className="container">
                    <div className="row justify-content-around">
                        <div className="col-md-6">
                            <span>
                                <span className="f-12"> <i className="bi bi-envelope"></i> Support@PlanB.com </span>
                                <span className="f-12 mx-2"> <i className="bi bi-envelope"></i> 01774688159 </span>
                            </span>
                        </div>
                        <div className="col-md-6">
                            <span className="float-end">
                                <span className="bodySmal mx-2">  <i className="bi bi-whatsapp"></i> </span>
                                <span className="bodySmal mx-2"> <i className="bi bi-youtube"></i> </span>
                                <span className="bodySmal"> <i className="bi bi-facebook"></i> </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <nav>
                <div className="container-fluid">
                    <div className="row d-flex py-3 justify-content-evenly align-items-center">

                        {/* Left side  */}
                        <div className="col-lg-3 col-md-3 col-3">
                            <div className="text-center">
                                <Link className="navbar-brand" to="/">
                                    <img className="img-fluid" src={logo} alt="plainb" width="96px" />
                                </Link>
                            </div>
                        </div>

                        {/* Left second  */}
                        <div className="col-lg-3 col-md-3 col-3">
                            <ul className='list-unstyled d-flex m-0'>
                                <li className='nav-link fs-6'>
                                    <Link className="text-secondary" to="/">
                                        Home
                                    </Link>
                                </li>
                                <li className='nav-link fs-6'>
                                    <Link className="text-secondary" to="/about">
                                        About
                                    </Link>
                                </li>
                                <li className='nav-link fs-6'>
                                    <Link className="text-secondary" to="/terms">
                                        Terms
                                    </Link>
                                </li>
                                <li className='nav-link fs-6'>
                                    <Link className="text-secondary" to="/contact">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* right second  */}
                        <div className="col-lg-3 col-md-3 col-3">
                             <div className="d-flex">
                                <input 
                                    value={searchKeyword} 
                                    onChange={(e) => setSearchKeyword(e.target.value)} 
                                    className="w-75 px-2 py-1 rounded-2 form-control" 
                                    type="search" 
                                    placeholder="Search"  
                                />
                                <Link 
                                    to={searchKeyword.length > 0 ? `/by-keyword/${searchKeyword}` : '/'}
                                    className="btn btn-outline-dark" 
                                    type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style=
                                    {{ width: 24, height: 24 }}>
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> 
                                            width: height:
                                            Slider Component
                                    </svg>
                                </Link>
                             </div>
                        </div>

                        {/* Right side  */}
                        <div className="col-lg-3 col-md-3 col-3">
                            <div className="d-lg-flex">
                                    {/* User Cart list  */}
                                        {
                                            isLogin() ? (
                                                <span className='nav-item me-4'>
                                                        <Link to="/cart" type="button" className="btn ms-2 btn-light position-relative">
                                                            <i className="bi text-dark bi-bag"></i>
                                                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success'>
                                                                {CartCount}
                                                                <span className='visually-hidden'>Unread message</span>
                                                            </span>
                                                        </Link>
                                                    </span>
                                            ) : ""
                                        }
                                    {

                                    // User Profile 
                                    isLogin() ? (
                                        <>
                                            {/* Profile section  */}
                                            <div class="btn-group">
                                                <button 
                                                    type="button" 
                                                    class="profile-button border-success rounded-circle position-relative
                                                    d-flex justify-content-center align-content-center" 
                                                    data-bs-toggle="dropdown" 
                                                    aria-expanded="false"
                                                >
                                                    <img className='position-absolute rounded-circle' 
                                                    src="https://avatars.githubusercontent.com/u/124289808?v=4" alt="" />
                                                </button>
                                                <ul class="dropdown-menu profile-dropdown">
                                                    <li className=''>
                                                        <Link type="button" className="d-flex justify-content-around gap-2 text-center" to="/profile">
                                                            <i class="bi text-dark bi-person"></i>
                                                            <span className='text-success'>Profile</span>
                                                            <span></span>
                                                        </Link>
                                                    </li>
                                                    <li  className=''>
                                                        <Link type="button" className="position-relative d-flex justify-content-around gap-2 text-center" to="/wish">
                                                            <i className="bi text-dark bi-heart"></i>
                                                            <span className='text-success'>Wishlist</span>
                                                            <span></span>
                                                            <span className='position-absolute top-50 end-0 translate-middle badge rounded-pill bg-warning'>
                                                                {WishCount}
                                                                <span className='visually-hidden'>Unread message</span>
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li  className=''>
                                                        <Link type="button" className="d-flex justify-content-around gap-2 text-center" to="/order">
                                                            <i className="bi text-dark bi-truck"></i>
                                                            <span className='text-success'>Your Order</span>
                                                            <span></span>
                                                        </Link>
                                                    </li>
                                                    
                                                    <><hr className="dropdown-divider"/></>
                                                    <span>
                                                        <Link type="button" onClick={logoutHandle} className="text-center d-block text-danger" to="/">Logout</Link>
                                                    </span>
                                                </ul>
                                            </div>
                                        </>
                                    ) : (
                                        <Link type="button" className="btn ms-3 btn-success d-flex" to="/login">Login</Link>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;


 