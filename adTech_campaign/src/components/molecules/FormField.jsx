import { Label } from "../atoms/Label";

export function FormField({ label, htmlFor, children }) {
  return (
    <div className="mb-4">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}