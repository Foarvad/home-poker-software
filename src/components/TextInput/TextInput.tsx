import { styled } from "../../stitches.config";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  variants: {
    fullWidth: {
      true: {
        width: '100%',
      }
    }
  },
});

export const StyledTextInput = styled("input", {
  border: "none",
  boxShadow: "0 0 0 1px #ced4da",
  borderRadius: "8px",
  padding: "12px",
  fontSize: "16px",
  width: '100%',
  "&:focus": {
    outline: "none",
    borderColor: "#007BFF",
    boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.5)",
  },
  "&:disabled": {
    backgroundColor: "#f8f9fa",
    cursor: "not-allowed",
  },
});

type TextInputProps = {
  label?: string;
  fullWidth?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput: React.FC<TextInputProps> = ({ label, fullWidth, ...props }) => {
  return (
    <Wrapper fullWidth={fullWidth}>
      {label ? <label>{label}</label> : null}
      <StyledTextInput {...props} />
    </Wrapper>
  );
};
