"use client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { FormMessages } from "./form";
import { trpc } from "@/utils/trpc";
import { MessageWithDetails } from "@/types/messages";
import { cn } from "@/lib/utils";

export function ButtonCreate({
  initialData,
  className,
  children,
}: {
  initialData?: MessageWithDetails;
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (open: boolean) => {
    setOpen(!open);
  };

  return (
    <>
      <Button className={cn("", className)} onClick={() => handleChange(open)}>
        {children ? children : "Create"}
      </Button>
      {open && (
        <DialogCreate
          open={open}
          onClose={() => handleChange(open)}
          initialData={initialData}
        />
      )}
    </>
  );
}

export function DialogCreate({
  open,
  onClose,
  initialData,
  currentPage = 1,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: MessageWithDetails;
  currentPage?: number;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  // Create Mutation dengan Optimistic Update
  const { mutate: createMessage, isLoading: isCreating } =
    trpc.messages.create.useMutation({
      onMutate: async (newMessage) => {
        // Cancel ongoing queries
        await queryClient.cancelQueries({
          queryKey: [["messages", "getAll"]],
        });

        // Get current data
        const previousData = queryClient.getQueryData([
          ["messages", "getAll"],
          { input: { page: currentPage, limit: 10 }, type: "query" },
        ]);

        // Create temporary message dengan ID sementara
        const tempMessage = {
          id: Date.now(), // temporary ID
          ...newMessage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Add other required fields with default values
          user: { name: "You", email: "" }, // atau ambil dari current user
          _count: { replies: 0 },
        };

        // Optimistically add new message ke cache
        queryClient.setQueryData(
          [
            ["messages", "getAll"],
            { input: { page: currentPage, limit: 10 }, type: "query" },
          ],
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: [tempMessage, ...oldData.data.data],
                total: oldData.data.total + 1,
              },
            };
          }
        );

        return { previousData, tempMessage };
      },

      onSuccess: (newMessage, variables, context) => {
        // Replace temporary message dengan real message dari server
        queryClient.setQueryData(
          [
            ["messages", "getAll"],
            { input: { page: currentPage, limit: 10 }, type: "query" },
          ],
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: oldData.data.data.map((msg: any) =>
                  msg.id === context?.tempMessage.id ? newMessage : msg
                ),
              },
            };
          }
        );

        toast.success("Pesan berhasil dibuat");
        onClose();
      },

      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousData) {
          queryClient.setQueryData(
            [
              ["messages", "getAll"],
              { input: { page: currentPage, limit: 10 }, type: "query" },
            ],
            context.previousData
          );
        }
        toast.error("Gagal membuat pesan");
      },

      onSettled: () => {
        // Ensure consistency
        queryClient.invalidateQueries({
          queryKey: [["messages", "getAll"]],
        });
      },
    });

  // Update Mutation dengan Optimistic Update
  const { mutate: updateMessage, isLoading: isUpdating } =
    trpc.messages.update.useMutation({
      onMutate: async (updatedMessage) => {
        await queryClient.cancelQueries({
          queryKey: [["messages", "getAll"]],
        });

        const previousData = queryClient.getQueryData([
          ["messages", "getAll"],
          { input: { page: currentPage, limit: 10 }, type: "query" },
        ]);

        // Optimistically update message
        queryClient.setQueryData(
          [
            ["messages", "getAll"],
            { input: { page: currentPage, limit: 10 }, type: "query" },
          ],
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: oldData.data.data.map((msg: any) =>
                  msg.id === updatedMessage.id
                    ? {
                        ...msg,
                        ...updatedMessage,
                      }
                    : msg
                ),
              },
            };
          }
        );

        return { previousData };
      },

      onSuccess: (updatedMessage) => {
        // Update dengan data real dari server
        queryClient.setQueryData(
          [
            ["messages", "getAll"],
            { input: { page: currentPage, limit: 10 }, type: "query" },
          ],
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: oldData.data.data.map((msg: any) =>
                  msg.id === updatedMessage.data?.id ? updatedMessage : msg
                ),
              },
            };
          }
        );

        toast.success("Pesan berhasil diperbarui");
        onClose();
      },

      onError: (error, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            [
              ["messages", "getAll"],
              { input: { page: currentPage, limit: 10 }, type: "query" },
            ],
            context.previousData
          );
        }
        toast.error("Gagal memperbarui pesan");
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [["messages", "getAll"]],
        });
      },
    });

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pesan" : "Buat Pesan Baru"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
          <FormMessages
            initialData={initialData}
            onSubmit={(data) => {
              if (isEdit) {
                updateMessage({
                  id: initialData.id,
                  ...data,
                });
              } else {
                createMessage(data);
              }
            }}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
