"use client";

import { db } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCountdown, isLockActive } from "@/lib/focus-lock";
import { getDecisionColor, getDecisionEmoji, type Decision } from "@/lib/scoring";

export default function DashboardPage() {
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
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ideas = data?.ideas || [];
  const activeIdea = ideas.find((idea: any) => idea.isActive && idea.lockExpiresAt && isLockActive(idea.lockExpiresAt));

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Ideas Dashboard
            </h1>
            <p className="mt-1 text-zinc-600">
              Decide which ideas deserve execution
            </p>
          </div>
          <Link href="/ideas/new">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Idea
            </Button>
          </Link>
        </div>

        {/* Active Idea Card */}
        {activeIdea && (
          <Card className="border-2 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>This Week's Focus</span>
                <Badge className="bg-green-500">ACTIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-zinc-900">
                  {activeIdea.title}
                </h3>
                {activeIdea.notes && (
                  <p className="mt-1 text-zinc-600">{activeIdea.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-700">
                    Lock Expires
                  </p>
                  <p className="text-lg font-semibold text-zinc-900">
                    {activeIdea.lockExpiresAt && formatCountdown(activeIdea.lockExpiresAt)}
                  </p>
                </div>

                {activeIdea.guardrailScore !== null && activeIdea.guardrailScore !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-zinc-700">Score</p>
                    <p className="text-lg font-semibold text-zinc-900">
                      {activeIdea.guardrailScore} / 50
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/ideas/${activeIdea.id}/execution`}>
                  <Button variant="outline">Track Progress</Button>
                </Link>
                <Link href={`/ideas/${activeIdea.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Ideas Table */}
        <div>
          <CardHeader>
            <CardTitle>All Ideas</CardTitle>
            <CardDescription>
              {ideas.length === 0
                ? "You haven't added any ideas yet"
                : `${ideas.length} idea${ideas.length !== 1 ? "s" : ""} total`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ideas.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-zinc-600 mb-4">
                  Start by adding your first idea
                </p>
                <Link href="/ideas/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Idea
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-zinc-700">
                      <th className="pb-3 pr-4">Idea</th>
                      <th className="pb-3 px-4">Score</th>
                      <th className="pb-3 px-4">Decision</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 pl-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {ideas.map((idea: any) => (
                      <tr key={idea.id} className="border-b last:border-0">
                        <td className="py-4 pr-4">
                          <div>
                            <p className="font-medium text-zinc-900">{idea.title}</p>
                            {idea.notes && (
                              <p className="text-xs text-zinc-600 mt-1 truncate max-w-xs">
                                {idea.notes}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {idea.guardrailScore !== null && idea.guardrailScore !== undefined ? (
                            <span className="font-medium">{idea.guardrailScore} / 50</span>
                          ) : (
                            <span className="text-zinc-400">Not scored</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {idea.decision ? (
                            <Badge className={getDecisionColor(idea.decision as Decision)}>
                              {getDecisionEmoji(idea.decision as Decision)} {idea.decision}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {idea.isActive ? (
                            <Badge className="bg-green-500">ACTIVE</Badge>
                          ) : idea.executionStatus ? (
                            <Badge variant="outline">{idea.executionStatus}</Badge>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="py-4 pl-4">
                          <div className="flex gap-2">
                            {!idea.decision ? (
                              <Link href={`/ideas/${idea.id}/score`}>
                                <Button size="sm" variant="outline">
                                  Score
                                </Button>
                              </Link>
                            ) : (
                              <Link href={`/ideas/${idea.id}/result`}>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
