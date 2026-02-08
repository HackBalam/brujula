"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  itemName?: string;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  itemName,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#111111] border-[#262626] text-white w-[95vw] max-w-md p-4 sm:p-6">
        <AlertDialogHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EF4444]/20 shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#EF4444]" />
            </div>
            <div>
              <AlertDialogTitle className="text-base sm:text-lg font-bold text-white">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-[#A3A3A3] mt-0.5 sm:mt-1">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {itemName && (
          <div className="my-3 sm:my-4 p-3 sm:p-4 bg-[#1A1A1A] border border-[#262626] rounded-lg">
            <p className="text-xs sm:text-sm text-[#737373] mb-1">Se eliminará:</p>
            <p className="text-sm sm:text-base text-white font-medium break-words">{itemName}</p>
          </div>
        )}

        <div className="p-3 sm:p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg">
          <p className="text-xs sm:text-sm text-[#F87171]">
            Esta acción no se puede deshacer. La postulación y todos sus datos
            serán eliminados permanentemente.
          </p>
        </div>

        <AlertDialogFooter className="mt-4 sm:mt-6 flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-[#262626] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-[#EF4444] text-white hover:bg-[#DC2626] font-semibold w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
