// components/auth/authInputField.js
import React, { forwardRef } from 'react';

const AuthInputField = forwardRef(({ type, id, required, placeholder, label }, ref) => (    <div className="flex flex-col">
        <label htmlFor={id} className="  mb-2">
            {label}
        </label>
        <input
            type={type}
            id={id}
            required={required}
            ref={ref}
            placeholder={placeholder}
            className="p-3 border  rounded-lg focus:outline-none focus:border-light-tertiary focus:ring-1 dark:focus:ring-dark-tertiary transition duration-300"
        />
    </div>
));

export default AuthInputField;
