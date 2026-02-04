import { NumberInput } from "@mantine/core";

const MobileNumberInput = ({
  label,
  value,
  error,
  onChange,
  withAsterisk = false,
  placeholder = "Enter mobile number (optional)",
  ...props
}) => {
  return (
    <NumberInput
      withAsterisk={withAsterisk}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      minLength={10}
      maxLength={10}
      allowDecimal={false}
      hideControls
      placeholder={placeholder}
      {...props}
    />
  );
};

export default MobileNumberInput;
