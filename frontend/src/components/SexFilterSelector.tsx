import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SexFilterSelector() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a sex" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Sex</SelectLabel>
          <SelectItem value="male">Apple</SelectItem>
          <SelectItem value="female">Banana</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
