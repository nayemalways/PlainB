 import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Success from '../../components/user/Payment/Success'
import Fail from '../../components/user/Payment/Fail'

const Payment = () => {
    let {trn_id , payment_status} = useParams();
    

    return (
        <Layout>
            {
                payment_status == "success" ? <Success tran_id={ trn_id } /> : 
                payment_status == "fail" ? <Fail payment_text="Payment Failed"/> : 
                payment_status == "cancel" ? <Fail payment_text="Payment Cancel" /> :
                <p className='text-danger fs-3'>Something went wrong</p>
            }
        </Layout>
    );
};

export default Payment;