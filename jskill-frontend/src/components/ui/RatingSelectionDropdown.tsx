import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RatingSystemDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="w-64">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#121212] text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#121212] text-white">
          <SelectItem value="TrueSkill">TrueSkill</SelectItem>
          <SelectItem value="ELO">ELO</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
