import React from 'react';
import { Link } from 'react-router-dom';
import ProductStore from '../../store/productStore';
import SliderSkeleton from './../../skeleton/SliderSkeleton';


const HeroSlider = () => {

    const {SliderList} = ProductStore(); // Access data from product Store 
    // Check has Data fetched ohterwise showing loading skeleton
    if(SliderList === null) {
        return <SliderSkeleton/>
    }
    
 
    return (
        <>
                <div id="carouselExampleDark" className="carousel hero-bg carousel-dark slide">
                    <div className="carousel-indicators">


                        {/* Generate Indicator Button Dynamically */}
                        {
                            SliderList.map((item, index) => {
                                return (
                                    <button key={index} type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to={index} className="active bg-white"
                                    aria-current="true" aria-label=""></button>
                                )
                            })
                        }
                        
                    </div>


                    <div className="carousel-inner py-5">
                        {/* Load Data dynamically in the Slider from API data  */}
                        {
                            SliderList.map((item, index) => {

                                let active = 'carousel-item';
                                if(index === 0) {
                                    active = 'carousel-item active'
                                }

                                return (
                                    <div key={index} className={active} data-bs-interval="10000">
                                        <div className="container-fluid">
                                            <div className="row justify-content-center">
                                                <div className="col-12 col-lg-5 col-sm-12 col-md-5 p-5">
                                                    <h1 className="headline-1">{item['title']}</h1>
                                                    <p className="h2 fw-bolder">{item['price']}</p>
                                                    <p>{item['des']}</p>
                                                    <Link to={`/details/${item['_id']}`} className="btn text-white btn-success px-5">Buy Now</Link>
                                                </div>
                                                <div className="col-12 col-lg-5 col-sm-12 col-md-5 p-5">
                                                    <img src={item['image']} className="w-100" alt="..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    
                    <button className="carousel-control-prev btn rounded-5" type="button" data-bs-target="#carouselExampleDark"
                    data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    {/* Products Component */}
                    <button className="carousel-control-next btn" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
        </>
    );
};

export default HeroSlider;