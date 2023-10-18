import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
const CheckoutForm = ({ price,form }) => {
    const priceForStripe = price * 100;
    const formlist = form;
    const publishableKey = 'pk_test_51K3ve9CIO4dnFt3WbYTiMO1ifGKiJBOSRfqKKLWjvWZGV6Se2NP229glNPB3F95yDhPEnn9suD0WDEnDsddxOhsz00QSs9meUw';

    const onToken = token => {
        const formData = new FormData();
            formData.append('uid', formlist);
            axios.post('https://domaintobesocial.com/domaintobe/paysuccess',
                formData
            )
            .then((res) => {
                if(res.data.status == 'success')
                {   alert('Payment Succesful!');
                    setTimeout(function(){ window.location = "/"; }, 1500);
                }else{
                    setTimeout(function(){ document.getElementById('errorlogin').style.display = 'none'; }, 2000);
                }
            })
            .catch((error) => {
                console.log(error.message);
            })
    };

    return (
        <StripeCheckout
            label='Pay Now'
            name='Domaintobe'
            // billingAddress
            // shippingAddress
            image='/images/loginimg.png'
            description={`Your total is $${price}`}
            amount={priceForStripe}
            panelLabel='Pay Now'
            token={onToken}
            stripeKey={publishableKey}
        />
    )
}

export default CheckoutForm;