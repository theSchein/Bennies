// components/form/TextInput.jsx

import React from 'react';
import { useFormContext } from 'react-hook-form';

const TextInput = ({ name, label, as: Component = "input", ...rest }) => {
    const { register } = useFormContext();
    
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <Component id={name} {...register(name)} {...rest} />
        </div>
    );
};

export default TextInput;
