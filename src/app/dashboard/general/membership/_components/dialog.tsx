"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormMembership, type membershipCreate } from "./form";
import { trpc } from "@/utils/trpc";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

export function DialogMembership({
  initialData,
  id,
}: {
  initialData?: membershipCreate;
  id?: number;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const utils = trpc.useUtils();

  const { mutate: createMutate, isLoading: createLoading } =
    trpc.membership.create.useMutation({
      onSuccess: () => {
        toast.success("Membership created successfully!", {
          description: "The new membership has been added to the system.",
        });
        utils.membership.getAll.invalidate();
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to create membership", {
          description:
            error.message ||
            "Something went wrong while creating the membership.",
        });
      },
    });

  const { mutate: updateMutate, isLoading: updateLoading } =
    trpc.membership.update.useMutation({
      onSuccess: () => {
        toast.success("Membership updated successfully!", {
          description: "The membership details have been updated.",
        });
        utils.membership.getAll.invalidate();
        setOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to update membership", {
          description:
            error.message ||
            "Something went wrong while updating the membership.",
        });
      },
    });

  const handleSubmit = (data: membershipCreate) => {
    if (id && initialData) {
      // Update existing membership
      updateMutate({
        ...data,
        id,
      });
    } else {
      // Create new membership
      createMutate(data);
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <>
      <Button
        className="size-8 rounded-full p-2"
        onClick={() => setOpen(true)}
        variant={initialData ? "outline" : "default"}
      >
        {initialData ? (
          <Pencil className="size-4" />
        ) : (
          <Plus className="size-4" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Update Membership" : "Create New Membership"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Make changes to the membership here."
                : "Fill in the form to create a new membership."}
            </DialogDescription>
          </DialogHeader>

          <FormMembership
            id={id}
            isLoading={isLoading}
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
