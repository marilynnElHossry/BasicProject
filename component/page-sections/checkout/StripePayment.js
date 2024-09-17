'use client' // Required to ensure this is treated as a client-side component
import React from 'react';
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"; // Load Stripe SDK
import CardHandle from "./CardHandle"; // Ensure the correct import based on your export in CardHandle
import classes from "../../../styles/page-styles/StripePage.module.scss"
// Load Stripe instance with public key
const stripePromise = loadStripe( process.env.NEXT_PUBLIC_STRIPE_KEY );

const StripePayment = ( props ) => {
    return (
        <Elements stripe={ stripePromise }>
            <InjectedCardHandle { ...props } />
        </Elements>
    );
};

// InjectedCardHandle is a component that uses useStripe and useElements hooks
const InjectedCardHandle = ( props ) => {
    const stripe = useStripe();
    const elements = useElements();

    return (
        <div className={ classes.container }>
            <div className={ classes.content }>
                <CardHandle { ...props } stripe={ stripe } elements={ elements } />
            </div></div>
    );
}

export default StripePayment;
