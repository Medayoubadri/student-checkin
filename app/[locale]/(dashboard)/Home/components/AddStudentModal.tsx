import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    age: string,
    gender: string,
    phoneNumber: string
  ) => void;
  name: string;
  isLoading: boolean;
}

export function NewStudentModal({
  isOpen,
  onClose,
  onSubmit,
  name,
  isLoading,
}: NewStudentModalProps) {
  const t = useTranslations("NewStudentModal");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, age, gender, phoneNumber);
    onClose();
    setAge("");
    setGender("");
    setPhoneNumber("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="gap-4 grid py-4">
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="name" className="text-right">
                {t("FullName")}
              </Label>
              <Input id="name" value={name} className="col-span-3" disabled />
            </div>
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="age" className="text-right">
                {t("Age")}
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="col-span-3"
                required
                min="1"
                max="80"
                onInput={(e) => {
                  const input = e.currentTarget;
                  if (input.value < "1") input.value = "1";
                  if (input.value > "80") input.value = "80";
                }}
              />
            </div>
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="gender" className="text-right">
                {t("Gender")}
              </Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">{t("male")}</SelectItem>
                  <SelectItem value="Female">{t("female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="phoneNumber" className="text-right">
                {t("Phone")}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!name || !age || !gender || isLoading}
            >
              {isLoading ? t("addingStudent") : t("addStudent")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
