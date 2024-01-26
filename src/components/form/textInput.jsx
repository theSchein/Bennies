// components/form/TextInput.jsx

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';

const TextInput = ({ name, label, as: Component = "input", ...rest }) => {
    const { register } = useFormContext();
    const isTextArea = Component === "textarea";

    return (
        <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor={name}>{label}</InputLabel>
            {isTextArea ? (
                <OutlinedInput
                    id={name}
                    label={label}
                    multiline
                    rows={4}
                    {...register(name)}
                    {...rest}
                />
            ) : (
                <OutlinedInput
                    id={name}
                    label={label}
                    {...register(name)}
                    {...rest}
                />
            )}
        </FormControl>
    );
};

export default TextInput;
