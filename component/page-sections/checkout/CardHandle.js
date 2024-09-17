'use client'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useRef, useState } from 'react'
import { Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classes from "./Checkout.module.scss"
import useFormValidation from '@/utils/custom-hooks/useFormValidation';

const CardHandle = ( props ) => {
    const [ stripeId, setStripeId ] = useState( null )
    const HandleSchema = yup.object( {
        card_name: yup.string().label( 'Card name' ).required().max( 255 ),
        card: yup.string().nullable().required( 'field is required' ),

    } );

    const card = useRef();
    const stripe = useStripe();
    const elements = useElements();
    const { control, handleSubmit, setError, clearErrors, formState: { errors }, } = useFormValidation( {
        defaultValues: {
            card_name: "",
            card: "",

        },
        resolver: yupResolver( HandleSchema ),
    } );


    const handleSubmitForm = async ( formValues ) => {

        // we need the payment method id to send the card details securely
        await stripe.createPaymentMethod( {
            type: "card",
            billing_details: {
                name: formValues?.card_name,
            },
            card: elements.getElement( CardElement ),
        } ).then( ( StripeRes ) => {
            if ( !StripeRes?.error ) {

                try {
                    const { id } = StripeRes?.paymentMethod
                    setStripeId( id )
                    toast.success( `successfully generated id', ${ id }` )
                    console.log( 'successfully generated id', id )
                } catch ( e ) {
                    toast.error( 'error generating id' )

                }
            } else {
                console.log( 'error generating id', StripeRes?.error )
                toast.error( 'error generating id' )
            }
        } )
    }


    return (
        <form onSubmit={ handleSubmit( handleSubmitForm ) } className={ classes.container }>

            <Controller
                render={ ( { field: { onChange, value }, fieldState: { error } } ) => (
                    <div className={ classes.cardInput }>
                        <label htmlFor='card-name'>Cardholder Name</label>
                        <input
                            id="card-name"
                            label="Cardholder Name"
                            value={ value }
                            placeholder={ "Enter cardholder name" }
                            onChange={ ( e ) => {
                                onChange( e.target.value );
                            } }
                            name="card_name"
                        />
                    </div>
                ) }
                name="card_name"
                control={ control }
            />

            <Controller
                name="card"
                defaultValue={ true }
                control={ control }
                render={ ( { field: { onChange, }, fieldState: { error } } ) => {
                    return (
                        <div className={ classes.cardInput }>
                            <label>Card Information </label>
                            <div className={ classes.stripeCardElement }>
                                <CardElement ref={ card } options={ { hidePostalCode: false } } onChange={ ( e ) => {
                                    console.log( e, "eeeeeeeeeeeeeeeeee" )

                                    onChange( e.complete ? "card" : "" )
                                } } />

                            </div></div>


                    );
                } }
            />
            < div className={ classes.action }>
                <button type="submit"> Submit</button>

            </div>
            <div>
                { stripeId && stripeId }
            </div>
        </form >
    )
}

export default CardHandle