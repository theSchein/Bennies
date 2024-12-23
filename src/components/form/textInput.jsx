// components/form/TextInput.jsx

import React from "react";
import { useFormContext } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

const TextInput = ({ name, label, as: Component = "input", ...rest }) => {
    const { register } = useFormContext();
    const isTextArea = Component === "textarea";

    return (
        <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
                whiteSpace: "normal", // Ensure the label wraps
                textAlign: "left",
                lineHeight: "1.5", // Adjust line height for better readability
                fontSize: "1rem", // Adjust font size as needed
                fontWeight: "medium", // Adjust font weight as needed
                // color: "darkMode ? theme.palette.dark.quaternary : theme.palette.light.quaternary",
                // "&.Mui-focused": {
                //     color: "darkMode ? theme.palette.dark.quaternary : theme.palette.light.quaternary", // Color when the input is focused
                // },
            }}
        >
            <InputLabel
                htmlFor={name}
                sx={{
                    whiteSpace: "normal", // Ensure the label wraps
                    textAlign: "left",
                    lineHeight: "1.5", // Adjust line height for better readability
                    fontSize: "1rem", // Adjust font size as needed
                    fontWeight: "medium", // Adjust font weight as needed
                    // color: "darkMode ? theme.palette.dark.quaternary : theme.palette.light.quaternary",
                    // "&.Mui-focused": {
                    //     color: "darkMode ? theme.palette.dark.quaternary : theme.palette.light.quaternary", // Color when the input is focused
                    // },
                }}
            >
                {label}
            </InputLabel>
            {isTextArea ? (
                <OutlinedInput
                    id={name}
                    label={label}
                    multiline
                    rows={4}
                    {...register(name)}
                    {...rest}
                    // sx={{
                    //     // Add custom styles for the OutlinedInput if needed
                    //     "& .MuiOutlinedInput-notchedOutline": {
                    //         borderColor:
                    //             "darkMode ? theme.palette.dark.secondary : theme.palette.light.secondary",
                    //     },
                    //     "&:hover .MuiOutlinedInput-notchedOutline": {
                    //         borderColor: "tertiary.main", // Adjust border color on hover
                    //     },
                    //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    //         borderColor: "secondary.main", // Adjust border color when focused
                    //     },
                    // }}
                />
            ) : (
                <OutlinedInput
                    id={name}
                    label={label}
                    {...register(name)}
                    {...rest}
                    // sx={{
                    //     // Add custom styles for the OutlinedInput if needed
                    //     "& .MuiOutlinedInput-notchedOutline": {
                    //         borderColor: "secondary.light", // Adjust border color
                    //     },
                    //     "&:hover .MuiOutlinedInput-notchedOutline": {
                    //         borderColor: "secondary.main", // Adjust border color on hover
                    //     },
                    //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    //         borderColor: "secondary.main", // Adjust border color when focused
                    //     },
                    // }}
                />
            )}
        </FormControl>
    );
};

export default TextInput;
