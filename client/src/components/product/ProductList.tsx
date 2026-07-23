import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

import ProductStore from '../../store/productStore.ts';
import ProductsSkeleton from '../../skeleton/ProductsSkeleton.tsx';
import NoResult from './NoResult.tsx';

const ProductList = () => {
  const {
    ProductList,
    BrandList,
    CategoryList,
    BrandListRequest,
    CategoryListRequest,
    ProductFilter,
  } = ProductStore();
  const [Filter, setFilter] = useState({ brandID: '', categoryID: '', priceMin: '', priceMax: '' });
  const [debouncedPrice, setDebouncedPrice] = useState({
    priceMin: Filter.priceMin,
    priceMax: Filter.priceMax,
  });

  const inputOnchange = async (name, value) => {
    setFilter((data) => ({
      ...data,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedPrice({
        priceMin: Filter.priceMin,
        priceMax: Filter.priceMax,
      });
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [Filter.priceMin, Filter.priceMax]);

  useEffect(() => {
    (async () => {
      if (BrandList === null) await BrandListRequest();
      if (CategoryList === null) await CategoryListRequest();
    })();
  }, [BrandList, CategoryList, BrandListRequest, CategoryListRequest]);

  useEffect(() => {
    const appliedFilter = {
      brandID: Filter.brandID,
      categoryID: Filter.categoryID,
      priceMin: debouncedPrice.priceMin,
      priceMax: debouncedPrice.priceMax,
    };
    const everyFilterProperty = Object.values(appliedFilter).every((value) => value === '');

    if (!everyFilterProperty) void ProductFilter(appliedFilter);
  }, [Filter.brandID, Filter.categoryID, debouncedPrice, ProductFilter]);

  return (
    <>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-3 p-3">
            <div className="card p-3 shadow-sm vh-100">
              <label className="form-label mt-3">Brands</label>
              <select
                value={Filter.brandID}
                onChange={async (e) => await inputOnchange('brandID', e.target.value)}
                className="form-control form-select"
              >
                <option value="">Choose Brand</option>

                {BrandList != null ? (
                  BrandList.map((item, i) => (
                    <option key={i} value={item['_id']}>
                      {' '}
                      {item['brandName']}{' '}
                    </option>
                  ))
                ) : (
                  <option></option>
                )}
              </select>
              <label className="form-label mt-3">Categories</label>
              <select
                value={Filter.categoryID}
                onChange={async (e) => await inputOnchange('categoryID', e.target.value)}
                className="form-control form-select"
              >
                <option value="">Choose Category</option>

                {CategoryList != null ? (
                  CategoryList.map((item, i) => (
                    <option key={i} value={item['_id']}>
                      {' '}
                      {item['categoryName']}{' '}
                    </option>
                  ))
                ) : (
                  <option></option>
                )}
              </select>

              <label className="form-label mt-3">Maximum Price ${Filter.priceMax}</label>
              <input
                value={Filter.priceMax}
                onChange={(e) => inputOnchange('priceMax', e.target.value)}
                type="range"
                min={0}
                max={1000000}
                step={1000}
                className="form-range"
              />

              <label className="form-label mt-3">Minimum Price ${Filter.priceMin}</label>
              <input
                value={Filter.priceMin}
                onChange={(e) => inputOnchange('priceMin', e.target.value)}
                type="range"
                min={0}
                max={1000000}
                step={1000}
                className="form-range"
              />
            </div>
          </div>

          <div className="col-md-9 p-2">
            <div className="container">
              <div className="row">
                {ProductList === null ? (
                  <ProductsSkeleton />
                ) : (
                  <div className="container">
                    <div className="row">
                      {ProductList.length === 0 ? (
                        <NoResult />
                      ) : (
                        ProductList.map((item, i) => {
                          let price = (
                            <p className="text-dark bodyMedium my-1">Price: ${item['price']} </p>
                          );
                          if (item['discount'] === true) {
                            price = (
                              <p className="text-dark bodyMedium my-1">
                                Price:<del> ${item['price']} </del> $
                                {item['discountPrice']}{' '}
                              </p>
                            );
                          }
                          return (
                            <div key={i} className="col-12 col-lg-3 col-md-3 col-sm-6 p-2">
                              <Link
                                to={`/details/${item['_id']}`}
                                className="card bg-white h-100 rounded-3 shadow-sm"
                              >
                                <img className="rounded-top-2 w-100" src={item['images'][0]} />
                                <div className="card-body">
                                  <p className="text-secondary bodySmall my-1">{item['title']}</p>
                                  {price}
                                  <StarRatings
                                    rating={parseFloat(item['star'])}
                                    starRatedColor="red"
                                    starDimension="15px"
                                    starSpacing="2px"
                                  />
                                </div>
                              </Link>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
