import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

export const FormField = ({
  id,
  label,
  register,
  error,
  placeholder,
  type = "input",
  rows,
  optional = false,
}: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label} {optional && "(Optional)"}
    </Label>
    {type === "textarea" ? (
      <Textarea id={id} {...register} rows={rows} placeholder={placeholder} />
    ) : (
      <Input id={id} {...register} placeholder={placeholder} />
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
