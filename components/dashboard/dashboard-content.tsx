"use client";

import { db } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, MoreVertical } from "lucide-react";
import Link from "next/link";
import { formatCountdown, isLockActive } from "@/lib/focus-lock";
import { getDecisionColor, getDecisionEmoji, type Decision } from "@/lib/scoring";
import { EditIdeaDialog } from "@/components/ideas/edit-idea-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IdeasDataTable } from "@/components/dashboard/ideas-data-table";
import { columns } from "@/components/dashboard/ideas-table-columns";

export function DashboardContent() {
  const { user } = db.useAuth();
  const { isLoading, error, data } = db.useQuery({
    ideas: {
      $: {
        where: {
          "user.id": user?.id,
        },
      },
      scoringResponse: {},
    },
  });

  const handleRemoveFromFocus = async (ideaId: string, ideaTitle: string) => {
    if (!confirm(`Remove "${ideaTitle}" from your weekly focus?`)) {
      return;
    }

    try {
      await db.transact([
        db.tx.ideas[ideaId].update({
          isActive: false,
          priority: null,
          lockExpiresAt: null,
        }),
      ]);
    } catch (err) {
      console.error("Error removing from focus:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const ideas = data?.ideas || [];

  // Find all active ideas (up to 2)
  const activeIdeas = ideas
    .filter((idea: any) => idea.isActive && idea.lockExpiresAt && isLockActive(idea.lockExpiresAt))
    .sort((a: any, b: any) => (a.priority || 99) - (b.priority || 99));

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500">
              Focus on execution.
            </p>
          </div>
          <Link href="/ideas/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Idea
            </Button>
          </Link>
        </div>

        {/* Active Focus Section - Compact Grid */}
        {activeIdeas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {activeIdeas.map((idea: any) => (
                <Card key={idea.id} className={`border-l-4 ${idea.priority === 1 ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                    <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                             <div className="space-y-1">
                                <Badge variant="outline" className={`mb-1 ${idea.priority === 1 ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                                    {idea.priority === 1 ? 'PRIMARY FOCUS' : 'SECONDARY FOCUS'}
                                </Badge>
                                <h3 className="font-semibold text-lg leading-tight">{idea.title}</h3>
                             </div>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleRemoveFromFocus(idea.id, idea.title)} className="text-red-600 focus:text-red-600">
                                        Remove Focus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="flex items-center justify-between text-sm mt-2">
                             <div>
                                 <span className="text-zinc-500 block text-xs">Expires</span>
                                 <span className="font-medium text-zinc-900">{idea.lockExpiresAt ? formatCountdown(idea.lockExpiresAt) : '--'}</span>
                             </div>
                             <div>
                                 <span className="text-zinc-500 block text-xs">Score</span>
                                 {idea.guardrailScore ? <span className="font-medium">{idea.guardrailScore}/50</span> : <span className="text-zinc-400">--</span>}
                             </div>
                        </div>
                         <div className="mt-4 flex gap-2">
                            <Link href={`/ideas/${idea.id}/progress`} className="flex-1">
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                    Log Progress
                                </Button>
                            </Link>
                            <Link href={`/ideas/${idea.id}`}>
                                <Button size="sm" variant="outline">
                                    Details
                                </Button>
                            </Link>
                         </div>
                    </CardContent>
                </Card>
             ))}
          </div>
        )}

        {/* All Ideas - Enhanced Data Table */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Idea Backlog</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <IdeasDataTable columns={columns} data={ideas} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
