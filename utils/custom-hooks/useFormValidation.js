'use client'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const useFormValidation = ( options ) => {
    const methods = useForm( options );

    const { handleSubmit, formState: { errors } } = methods;

    const handleSubmitWithToasts = ( onValid, onInvalid ) => {
        return handleSubmit( ( data ) => {
            onValid( data );
        }, ( formErrors ) => {
            toast.error( Object.values( formErrors )?.[ 0 ]?.message )
            if ( onInvalid ) {
                onInvalid( formErrors );
            }
        } );
    };

    return {
        ...methods,
        handleSubmit: handleSubmitWithToasts,
    };
};

export default useFormValidation;
