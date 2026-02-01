"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { EditIdeaDialog } from "@/components/ideas/edit-idea-dialog";
import Link from "next/link";

export type IdeaRow = {
  id: string;
  title: string;
  notes?: string;
  guardrailScore?: number;
  decision?: string;
  isActive: boolean;
  executionStatus?: string;
  updatedAt?: number;
  createdAt: number;
};

export const columns: ColumnDef<IdeaRow>[] = [
  {
    accessorKey: "title",
    header: "Idea",
    cell: ({ row }) => {
      const idea = row.original;
      return (
        <div>
          <div className="font-medium text-zinc-900">
            <EditIdeaDialog
              ideaId={idea.id}
              initialTitle={idea.title}
              initialNotes={idea.notes || ""}
              trigger={
                <span className="hover:text-blue-600 cursor-pointer">
                  {idea.title}
                </span>
              }
            />
          </div>
          {idea.notes && (
            <p className="text-xs text-zinc-500 truncate max-w-[200px]">
              {idea.notes}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "guardrailScore",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const idea = row.original;
      if (!idea.guardrailScore) {
        return <span className="text-zinc-300">-</span>;
      }
      return (
        <Link href={`/ideas/${idea.id}/result`}>
          <Badge
            variant={idea.guardrailScore >= 40 ? "default" : "secondary"}
            className="hover:bg-zinc-800 cursor-pointer"
          >
            {idea.guardrailScore}
          </Badge>
        </Link>
      );
    },
    sortingFn: (rowA, rowB) => {
      const scoreA = rowA.original.guardrailScore || 0;
      const scoreB = rowB.original.guardrailScore || 0;
      return scoreA - scoreB;
    },
  },
  {
    accessorKey: "executionStatus",
    header: "Status",
    cell: ({ row }) => {
      const idea = row.original;
      if (idea.isActive) {
        return (
          <Badge className="bg-green-500 h-5 px-1.5 text-[10px]">
            ACTIVE
          </Badge>
        );
      }
      return (
        <span className="text-xs text-zinc-500">
          {idea.executionStatus || "New"}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      const idea = row.original;

      if (value === "active") return idea.isActive;
      if (value === "go") return idea.decision === "GO";
      if (value === "modify") return idea.decision === "MODIFY";
      if (value === "drop") return idea.decision === "DROP";

      return idea.executionStatus?.toLowerCase() === value.toLowerCase();
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const idea = row.original;
      const date = idea.updatedAt || idea.createdAt;
      return (
        <span className="text-xs text-zinc-500">
          {new Date(date).toLocaleDateString()}
        </span>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.updatedAt || rowA.original.createdAt;
      const dateB = rowB.original.updatedAt || rowB.original.createdAt;
      return dateA - dateB;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const idea = row.original;
      if (idea.decision) {
        return (
          <div className="text-right">
            <Link href={`/ideas/${idea.id}`}>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </Button>
            </Link>
          </div>
        );
      }
      return (
        <div className="text-right">
          <Link href={`/ideas/${idea.id}/score`}>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              Score
            </Button>
          </Link>
        </div>
      );
    },
  },
];
