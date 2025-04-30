import React, { useEffect } from 'react';
import UserStore from '../../store/userStore';
import toast from 'react-hot-toast';
import ProfileSkeleton from '../../skeleton/ProfileSkeleton';

const ProfileForm = () => {
    
    const { 
        profileDetails, 
        profileDetailsRequest, 
        profileSaveRequest, 
        profileFormOnChange, 
        profileForm } = UserStore();

        
    useEffect( () => {
        (async () => {
            await profileDetailsRequest();
        })();
    }, []);

    // Profile Save Handler
    const save = async () => {
        let res = await profileSaveRequest(profileForm);
        if(res) {
            toast.success("Profile Updated");
            await profileDetailsRequest();
        }
    }

        if(profileDetails === null) {
            return <ProfileSkeleton />;
        }else {
            return (
                <div className="container mt-5">
                    <div className="card p-5 rounded-3">
                        <h6>Customer Details</h6>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer Name </label>
                                <input value={profileForm && profileForm.cus_name} onChange={e => profileFormOnChange('cus_name', e.target.value)} type="text" className="form-control "/>
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer Phone </label>
                                <input value={profileForm && profileForm.cus_phone} onChange={e => profileFormOnChange('cus_phone', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer Fax </label>
                                <input value={profileForm && profileForm.cus_fax} onChange={e => profileFormOnChange('cus_fax', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer Country </label>
                                <input value={profileForm && profileForm.cus_country} onChange={e => profileFormOnChange('cus_country', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer City </label>
                                <input value={profileForm && profileForm.cus_city} onChange={e => profileFormOnChange('cus_city', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer State </label>
                                <input value={profileForm && profileForm.cus_state} onChange={e => profileFormOnChange('cus_state', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer Post Code </label>
                                <input value={profileForm && profileForm.cus_postcode} onChange={e => profileFormOnChange('cus_postcode', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Customer Address</label>
                                <input value={profileForm && profileForm.cus_address} onChange={e => profileFormOnChange('cus_address', e.target.value)} type="text" className="form-control " />
                            </div>
                        </div>

                        {/* Shipping Details  */}
                        <h6>Shipping Details</h6>
                        <hr />
                        <div className="row">
                            <div className="col-md-3 p-2">
                                <label className="form-label">Shipping Name </label>
                                <input value={profileForm && profileForm.ship_name} onChange={e => profileFormOnChange('ship_name', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Shipping Phone </label>
                                <input value={profileForm && profileForm.ship_phone} onChange={e => profileFormOnChange('ship_phone', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Shipping Country </label>
                                <input value={profileForm && profileForm.ship_country} onChange={e => profileFormOnChange('ship_country', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Shipping City </label>
                                <input value={profileForm && profileForm.ship_city} onChange={e => profileFormOnChange('ship_city', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Shipping State </label>
                                <input value={profileForm && profileForm.ship_state} onChange={e => profileFormOnChange('ship_state', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Shipping Post Code </label>
                                <input value={profileForm && profileForm.ship_postcode} onChange={e => profileFormOnChange('ship_postcode', e.target.value)} type="text" className="form-control " />
                            </div>
                            <div className="col-md-3 p-2">
                                <label className="form-label">Shipping Address</label>
                                <input value={profileForm && profileForm.ship_address} onChange={e => profileFormOnChange('ship_address', e.target.value)} type="text" className="form-control " />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-3 p-2">
                                <button onClick={save} className="btn btn-success">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    
};

export default ProfileForm;