"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Lock, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { getDecisionColor, getDecisionEmoji, SCORING_CRITERIA, type Decision } from "@/lib/scoring";
import { formatCountdown, isLockActive, validateCanActivate, getNextSundayExpiry } from "@/lib/focus-lock";
import { EditIdeaDialog } from "./edit-idea-dialog";
import { FocusLockModal } from "@/components/focus-lock-modal";
import { LogProgressDialog } from "@/components/progress/log-progress-dialog";
import { ProgressLogList } from "@/components/progress/progress-log-list";
import { BrainstormPromptDialog } from "./brainstorm-prompt-dialog";
import { Progress } from "@/components/ui/progress";
import { Link, FileText, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IdeaDetailsProps {
  ideaId: string;
}

export function IdeaDetails({ ideaId }: IdeaDetailsProps) {
  const router = useRouter();
  const { user } = db.useAuth();
  const [showCriteria, setShowCriteria] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [availablePriority, setAvailablePriority] = useState<number>(1);
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkType, setLinkType] = useState<"link" | "doc" | "image">("link");
  const [isSavingLink, setIsSavingLink] = useState(false);

  const { isLoading, error, data } = db.useQuery({
    ideas: {
      $: {
        where: {
          "user.id": user?.id,
        },
      },
      scoringResponse: {},
      weeklyExecutions: {},
      progressLogs: {},
    },
  });

  const handleActivate = async () => {
    if (!idea || idea.decision !== "GO") return;

    // Validate focus lock
    const validation = validateCanActivate(data?.ideas || []);

    if (!validation.canActivate) {
      alert(validation.reason);
      return;
    }

    // Store the available priority and show modal
    setAvailablePriority(validation.availablePriority || 1);
    setShowFocusModal(true);
  };

  const handleConfirmActivate = async () => {
    if (!idea) return;

    setIsActivating(true);

    try {
      const lockExpiresAt = getNextSundayExpiry();
      const now = Date.now();

      await db.transact([
        db.tx.ideas[ideaId].update({
          isActive: true,
          priority: availablePriority,
          activatedAt: now,
          lockExpiresAt,
          executionStatus: "In Progress",
        }),
      ]);

      setShowFocusModal(false);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error activating idea:", err);
      alert("Failed to activate idea. Please try again.");
      setIsActivating(false);
    }
  };

  const handleRemoveFromFocus = async () => {
    if (!confirm(`Remove "${idea?.title}" from your weekly focus? You can reactivate it later.`)) {
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
      alert("Failed to remove idea from focus. Please try again.");
    }
  };

  const handleSaveLink = async () => {
    if (!linkTitle.trim() || !linkUrl.trim()) {
      alert("Please provide both a title and URL");
      return;
    }

    setIsSavingLink(true);

    try {
      const now = Date.now();
      const progressLogId = db.id();

      await db.transact([
        db.tx.progressLogs[progressLogId].update({
          date: now,
          notes: `Quick link: ${linkTitle}`,
          resources: [
            {
              title: linkTitle,
              url: linkUrl,
              type: linkType,
            },
          ],
        }),
        db.tx.ideas[ideaId].link({
          progressLogs: progressLogId,
        }),
      ]);

      // Reset form
      setLinkTitle("");
      setLinkUrl("");
      setLinkType("link");
      setShowAddLinkDialog(false);
    } catch (err) {
      console.error("Error saving link:", err);
      alert("Failed to save link. Please try again.");
    } finally {
      setIsSavingLink(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  const idea = data?.ideas?.find((i: any) => i.id === ideaId);
  const allIdeas = data?.ideas || [];

  if (error || !idea) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              {error?.message || "Idea not found"}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const decision = idea.decision as Decision;
  const totalScore = idea.guardrailScore || 0;
  const scoringResponse = idea.scoringResponse;
  const criteriaWithScores = scoringResponse ? SCORING_CRITERIA.map((criterion) => ({
    ...criterion,
    score: scoringResponse[criterion.id as keyof typeof scoringResponse] as number,
  })) : [];
  
  const isWeeklyFocus = idea.isActive && idea.lockExpiresAt && isLockActive(idea.lockExpiresAt);
  const canActivate = decision === "GO" && !isWeeklyFocus;
  
  // Progress & Resources Logic
  const logs = data?.progressLogs || [];
  const ideaLogs = logs.filter((log: any) => 
    idea.progressLogs?.some((pl: any) => pl.id === log.id)
  );
  
  const allResources = ideaLogs.flatMap((log: any) => log.resources || []);
  const linkCount = allResources.length;
  // Default expected links = 5 if not set
  const expectedLinks = idea.expectedLinks || 5; 
  const progressPercentage = Math.min(100, (linkCount / expectedLinks) * 100);

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Breadcrumb */}
        <div>
           {/* Using a standard a tag for back link to match other pages if needed, but Next Link is better */}
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
        </div>

        {/* Main Content Info */}
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold text-zinc-900">{idea.title}</h1>
                 {isWeeklyFocus && <Badge className="bg-green-500">ACTIVE FAST TRACK</Badge>}
            </div>
          {idea.notes && (
            <p className="text-zinc-600 text-lg">{idea.notes}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                {/* Score Card */}
                {scoringResponse ? (
                    <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>Score</CardTitle>
                             <Badge
                                className={`${getDecisionColor(decision)}`}
                            >
                                {getDecisionEmoji(decision)} {decision}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2 mb-4">
                             <span className="text-4xl font-bold">{totalScore}</span>
                             <span className="text-zinc-400 text-xl">/ 50</span>
                        </div>
                         
                        <div className="border-t pt-4">
                             <Button 
                                variant="ghost" 
                                className="w-full justify-between"
                                onClick={() => setShowCriteria(!showCriteria)}
                            >
                                <span>Breakdown</span>
                                {showCriteria ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                            
                            {showCriteria && (
                                <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                {criteriaWithScores.map((criterion) => (
                                    <div
                                    key={criterion.id}
                                    className="flex items-center justify-between p-2 rounded-md bg-zinc-50 text-sm"
                                    >
                                    <span className="font-medium text-zinc-700">{criterion.name}</span>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                        criterion.score >= 4
                                            ? "bg-green-100 text-green-700"
                                            : criterion.score === 3
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {criterion.score}
                                    </div>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    </Card>
                ) : (
                     <Card>
                         <CardContent className="pt-6">
                              <p className="text-zinc-500 mb-4">This idea hasn't been scored yet.</p>
                              <Button onClick={() => router.push(`/ideas/${ideaId}/score`)}>Score Idea</Button>
                         </CardContent>
                     </Card>
                )}


                 
                 {/* Resources Section & Progress Logs */}
                 <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Resources</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-normal text-zinc-500">{linkCount} / {expectedLinks} expected</span>
                                    <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline" className="h-7">
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add Link
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Add Resource Link</DialogTitle>
                                                <DialogDescription>
                                                    Quickly add a useful link to this idea
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="link-title">Title</Label>
                                                    <Input
                                                        id="link-title"
                                                        placeholder="e.g., Firebase Auth Docs"
                                                        value={linkTitle}
                                                        onChange={(e) => setLinkTitle(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="link-url">URL</Label>
                                                    <Input
                                                        id="link-url"
                                                        placeholder="https://..."
                                                        value={linkUrl}
                                                        onChange={(e) => setLinkUrl(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="link-type">Type</Label>
                                                    <Select
                                                        value={linkType}
                                                        onValueChange={(value: "link" | "doc" | "image") =>
                                                            setLinkType(value)
                                                        }
                                                    >
                                                        <SelectTrigger id="link-type">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="link">Link</SelectItem>
                                                            <SelectItem value="doc">Document</SelectItem>
                                                            <SelectItem value="image">Image</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowAddLinkDialog(false)}
                                                    disabled={isSavingLink}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSaveLink} disabled={isSavingLink}>
                                                    {isSavingLink ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        "Add Link"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="mb-4">
                                <Progress value={progressPercentage} className="h-2" />
                             </div>
                             
                             {allResources.length > 0 ? (
                                 <div className="grid grid-cols-1 gap-2">
                                     {allResources.map((res: any, idx: number) => (
                                         <a 
                                            key={idx} 
                                            href={res.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-100 transition-colors border border-transparent hover:border-zinc-200 group"
                                         >
                                             <div className="bg-zinc-100 p-2 rounded group-hover:bg-white transition-colors">
                                                 {res.type === 'link' && <Link className="h-4 w-4 text-zinc-600" />}
                                                 {res.type === 'doc' && <FileText className="h-4 w-4 text-zinc-600" />}
                                                 {res.type === 'image' && <ImageIcon className="h-4 w-4 text-zinc-600" />}
                                             </div>
                                             <div className="overflow-hidden">
                                                 <p className="font-medium text-sm truncate text-zinc-900">{res.title}</p>
                                                 <p className="text-xs text-zinc-400 truncate">{res.url}</p>
                                             </div>
                                         </a>
                                     ))}
                                 </div>
                             ) : (
                                 <div className="text-center py-6 border-dashed border-2 border-zinc-100 rounded-lg">
                                     <p className="text-sm text-zinc-400">No resources collected yet.</p>
                                     <p className="text-xs text-zinc-300 mt-1">Log progress to add links & docs.</p>
                                 </div>
                             )}
                        </CardContent>
                    </Card>

                    <ProgressLogList logs={ideaLogs} />
                 </div>
            </div>

            <div className="space-y-6">
                 {/* Metadata / Actions */}
                 <Card>
                     <CardHeader>
                         <CardTitle className="text-base">Details</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4 text-sm">
                         <div>
                             <span className="text-zinc-500 block">Created</span>
                             <span className="font-medium">{new Date(idea.createdAt).toLocaleDateString()}</span>
                         </div>
                          <div>
                             <span className="text-zinc-500 block">Status</span>
                             <Badge variant="outline" className="mt-1">{idea.executionStatus || "New"}</Badge>
                         </div>
                         <div className="pt-4 border-t flex flex-col gap-2">
                             <BrainstormPromptDialog />

                             <EditIdeaDialog
                                ideaId={idea.id}
                                initialTitle={idea.title}
                                initialNotes={idea.notes}
                                trigger={<Button variant="outline" className="w-full">Edit Idea</Button>}
                             />

                             {canActivate && (
                               <Button
                                 onClick={handleActivate}
                                 className="w-full bg-green-600 hover:bg-green-700 text-white"
                               >
                                 <Lock className="mr-2 h-4 w-4" />
                                 Set as Weekly Focus
                               </Button>
                             )}

                             {isWeeklyFocus && (
                               <Button
                                 variant="ghost"
                                 onClick={handleRemoveFromFocus}
                                 className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                               >
                                 <span className="material-symbols-outlined mr-2 text-lg">close</span>
                                 Remove from Focus
                               </Button>
                             )}
                         </div>
                     </CardContent>
                 </Card>
            </div>
        </div>

        {/* Focus Lock Modal */}
        <FocusLockModal
          open={showFocusModal}
          onClose={() => setShowFocusModal(false)}
          onConfirm={handleConfirmActivate}
          ideaTitle={idea.title}
          priority={availablePriority}
          isLoading={isActivating}
        />
      </div>
    </div>
  );
}
