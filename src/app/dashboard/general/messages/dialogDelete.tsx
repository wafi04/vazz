import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function ButtonDelete({
  messageId,
}: {
  messageId: number;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        className="flex items-center p-2 rounded-full size-10"
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {open && (
        <DialogDelete
          messageId={messageId}
          onOpenChange={() => setOpen(!open)}
          open={open}
        />
      )}
    </>
  );
}

export function DialogDelete({
  open,
  onOpenChange,
  messageId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: number;
}) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = trpc.messages.delete.useMutation({
    // Optimistic update - langsung update UI sebelum server response
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: [["messages", "getAll"]],
      });

      // Get current data
      const previousData = queryClient.getQueryData([
        ["messages", "getAll"],
        { input: { page: 1, limit: 10 }, type: "query" },
      ]);

      // Optimistically update
      queryClient.setQueryData(
        [
          ["messages", "getAll"],
          { input: { page: 1, limit: 10 }, type: "query" },
        ],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.filter(
                (msg: any) => msg.id !== variables.id
              ),
              total: oldData.data.total - 1,
            },
          };
        }
      );

      return { previousData };
    },

    onSuccess: () => {
      toast.success("Pesan berhasil dihapus");
    },

    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [
            ["messages", "getAll"],
            { input: { page: 1, limit: 10 }, type: "query" },
          ],
          context.previousData
        );
      }
      toast.error("Gagal menghapus pesan");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [["messages", "getAll"]],
      });
    },
  });

  const handleDelete = () => {
    mutate({
      id: messageId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Pesan Ini</DialogTitle>
          <DialogDescription>
            Pesan ini akan dihapus secara permanen dan tidak dapat dikembalikan.
            Apakah Anda yakin ingin melanjutkan?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
