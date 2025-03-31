import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

// DeleteConfirmationDialog component for confirming deletion actions
export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationDialogProps) {
  const t = useTranslations("DeleteConfirmationDialog");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-description="DeleteConfirmationDialog">
        <DialogHeader>
          <DialogTitle>{t("deleteConfirmationTitle")}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          {t("deleteConfirmationDescription", { itemName })}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
            }}
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
