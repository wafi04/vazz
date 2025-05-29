import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageWithDetails } from "@/types/messages";
import { formatDate } from "@/utils/formatPrice";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Hash,
  Pencil,
  Type,
} from "lucide-react";
import React, { useState } from "react";
import { ButtonCreate, DialogCreate } from "./dialogCreate";
import { ButtonDelete } from "./dialogDelete";

export function TableDataMessage({
  messages,
}: {
  messages: MessageWithDetails[];
}) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Preview</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => {
          const isExpanded = expandedRows.has(message.id);
          return (
            <React.Fragment key={message.id}>
              <TableRow
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleRow(message.id)}
              >
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{message.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {message.text && message.text.substring(0, 60)}
                  {message.text && message.text.length > 60 && "..."}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {message.details && formatDate(message.details.created_at)}
                  </div>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <ButtonCreate
                    className="bg-card rounded-full p-2 text-white size-10"
                    initialData={message}
                  >
                    <Pencil className="h-4 w-4" />
                  </ButtonCreate>
                  <ButtonDelete messageId={message.id} />
                </TableCell>
              </TableRow>
              {isExpanded && <DetailsTable message={message} />}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function DetailsTable({ message }: { message: MessageWithDetails }) {
  return (
    <TableRow>
      <TableCell colSpan={5} className="p-0">
        <div className="bg-muted/30 p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Full Title
                </h4>
                <div className="text-sm text-muted-foreground bg-background p-3 rounded-md">
                  {message.title.trim()}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Full Text
                </h4>
                <div className="text-sm text-muted-foreground bg-background p-3 rounded-md">
                  {message.text}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Message Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-background rounded-md">
                    <span className="text-sm text-muted-foreground">
                      Word Count
                    </span>
                    <Badge variant="secondary">
                      {message.details.word_count}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-background rounded-md">
                    <span className="text-sm text-muted-foreground">
                      Character Count
                    </span>
                    <Badge variant="secondary">
                      {message.details.character_count}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-background rounded-md">
                    <span className="text-sm text-muted-foreground">
                      Variables Used
                    </span>
                    <Badge variant="outline">
                      {message.details.variables_used.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-background rounded-md">
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(message.details.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {message.details.variables_used.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Variables</h4>
                  <div className="flex flex-wrap gap-1">
                    {message.details.variables_used.map((variable, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
