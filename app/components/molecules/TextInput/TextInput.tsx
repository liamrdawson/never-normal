export type TextInputData = {
  type: "email" | "text";
  label: string;
};

function TextInput({ type, label }: TextInputData) {
  const inputLabelAttribute = label.toLowerCase().split(" ").join("-");
  return (
    <div className="form-input-container">
      <label htmlFor={inputLabelAttribute}>{label}</label>
      <input type={type} id={inputLabelAttribute} name={inputLabelAttribute} />
    </div>
  );
}

export { TextInput };
