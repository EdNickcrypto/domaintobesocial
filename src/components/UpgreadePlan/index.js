import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
const UpgreadePlan = ({ price,form,plan }) => {
    const priceForStripe = price * 100;
    const formlist = form;
    const publishableKey = 'pk_test_51O4JkFSGdndMBhS0y9h4hu3woe4CWcvuxQvj7s6J3BM9sZLAj0erekewLN7bMFKGLuqAQthE78YoZZ1h4Seo7WTL00lQeQRsQ1';

    const onToken = () => {
      
        const formData = new FormData();
            formData.append('uid', formlist);
            formData.append('plan', plan);
            axios.post('https://domaintobesocial.com/domaintobe/pay',
                formData
            )
            .then((res) => {
                if(res.data.status == 'success')
                {   alert('Payment Succesful!');
                    // setTimeout(function(){ window.location.reload(); }, 1500);
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
            label='Choose Plan'
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

export default UpgreadePlan;