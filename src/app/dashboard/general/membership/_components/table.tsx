"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogMembership } from "./dialog";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FormatPrice, formatDate } from "@/utils/formatPrice";

interface Membership {
  id: number;
  name: string;
  description: string;
  price: number;
  benefit: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MembershipTableProps {
  memberships: Membership[];
}

export function MembershipTable({ memberships }: MembershipTableProps) {
  const utils = trpc.useUtils();

  const { mutate: deleteMutate, isLoading: deleteLoading } =
    trpc.membership.delete.useMutation({
      onSuccess: (_, variables) => {
        const deletedMembership = memberships.find(
          (m) => m.id === variables.id
        );
        toast.success("Membership deleted successfully!", {
          description: `"${deletedMembership?.name}" has been removed from the system.`,
        });
        utils.membership.getAll.invalidate();
      },
      onError: (error) => {
        toast.error("Failed to delete membership", {
          description:
            error.message ||
            "Something went wrong while deleting the membership.",
        });
      },
    });

  const handleDelete = (id: number) => {
    deleteMutate({ id });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-card/80">
            <TableHead className="w-[80px] text-foreground">ID</TableHead>
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Description</TableHead>
            <TableHead className="text-foreground">Price</TableHead>
            <TableHead className="text-foreground">Created At</TableHead>
            <TableHead className="text-right text-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No memberships found.
              </TableCell>
            </TableRow>
          ) : (
            memberships.map((membership) => (
              <TableRow
                key={membership.id}
                className="hover:bg-primary/10 transition-colors"
              >
                <TableCell className="font-medium">
                  <Badge variant="outline" className="bg-accent/10 text-accent">
                    {membership.id}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-secondary">
                  {membership.name}
                </TableCell>
                <TableCell>{membership.description}</TableCell>
                <TableCell className="font-medium text-accent">
                  {FormatPrice(membership.price)}
                </TableCell>
                <TableCell>{formatDate(membership.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <DialogMembership
                      initialData={{
                        name: membership.name,
                        description: membership.description,
                        price: membership.price,
                        benefit: (membership.benefit as string) ?? "",
                      }}
                      id={membership.id}
                    />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deleteLoading}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the membership "{membership.name}" and remove
                            it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(membership.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
