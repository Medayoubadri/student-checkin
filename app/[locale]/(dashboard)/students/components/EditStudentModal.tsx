import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Student } from "@/types/import";

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
}

export function EditStudentModal({
  student,
  isOpen,
  onClose,
  onSave,
}: EditStudentModalProps) {
  const t = useTranslations("EditStudentModal");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setAge(student.age.toString());
      setGender(student.gender);
      setPhoneNumber(student.phoneNumber);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (student) {
      onSave({
        ...student,
        name,
        age: Number.parseInt(age),
        gender,
        phoneNumber,
        image: student.image,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="gap-4 grid py-4">
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="name" className="text-right">
                {t("FullName")}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
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
              />
            </div>
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="gender" className="text-right">
                {t("Gender")}
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">{t("male")}</SelectItem>
                  <SelectItem value="Female">{t("female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="phoneNumber" className="text-right">
                {t("phoneNumber")}
              </Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
