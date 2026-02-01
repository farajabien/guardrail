"use client";

import { useState } from "react";
import { db, id } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X, Link, FileText, Image as ImageIcon } from "lucide-react";

interface LogProgressDialogProps {
  ideaId: string;
  trigger?: React.ReactNode;
}

interface ResourceInput {
  type: 'link' | 'image' | 'doc';
  title: string;
  url: string;
}

export function LogProgressDialog({ ideaId, trigger }: LogProgressDialogProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resources, setResources] = useState<ResourceInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New resource state
  const [newResType, setNewResType] = useState<'link' | 'image' | 'doc'>('link');
  const [newResTitle, setNewResTitle] = useState("");
  const [newResUrl, setNewResUrl] = useState("");
  const [showResForm, setShowResForm] = useState(false);

  const addResource = () => {
    if (!newResTitle || !newResUrl) return;
    setResources([...resources, { type: newResType, title: newResTitle, url: newResUrl }]);
    setNewResTitle("");
    setNewResUrl("");
    setShowResForm(false);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
        const logId = id();
        await db.transact([
            db.tx.progressLogs[logId].update({
                message: message.trim(),
                loggedAt: Date.now(),
                resources: resources,
                linkCount: resources.length
            }),
            db.tx.ideas[ideaId].link({ progressLogs: logId }),
        ]);

      setOpen(false);
      setMessage("");
      setResources([]);
    } catch (err) {
      console.error("Error logging progress:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Log Progress</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Log Progress</DialogTitle>
          <DialogDescription>
            Record a concrete unit of work. Attach resources only if they were created or used during this session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="message">What did you complete?</Label>
            <Textarea
              id="message"
              placeholder="e.g., Built the authentication flow, Interviewed 3 users..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <Label>Attachments ({resources.length})</Label>
                {!showResForm && (
                    <Button variant="outline" size="sm" onClick={() => setShowResForm(true)}>
                        <Plus className="mr-1 h-3 w-3" /> Add Resource
                    </Button>
                )}
             </div>

             {/* Resources List */}
             {resources.length > 0 && (
                 <div className="space-y-2">
                     {resources.map((res, idx) => (
                         <div key={idx} className="flex items-center justify-between p-2 bg-zinc-50 rounded-md border text-sm">
                             <div className="flex items-center gap-2 overflow-hidden">
                                {res.type === 'link' && <Link className="h-3 w-3 text-zinc-500" />}
                                {res.type === 'doc' && <FileText className="h-3 w-3 text-zinc-500" />}
                                {res.type === 'image' && <ImageIcon className="h-3 w-3 text-zinc-500" />}
                                <span className="font-medium truncate">{res.title}</span>
                                <span className="text-zinc-400 truncate max-w-[150px]">{res.url}</span>
                             </div>
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-red-500" onClick={() => removeResource(idx)}>
                                 <X className="h-3 w-3" />
                             </Button>
                         </div>
                     ))}
                 </div>
             )}

             {/* Add Resource Form */}
             {showResForm && (
                 <div className="p-3 bg-zinc-50 border rounded-md space-y-3 animate-in fade-in zoom-in-95 duration-200">
                     <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <Select value={newResType} onValueChange={(v: any) => setNewResType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="link">Link</SelectItem>
                                    <SelectItem value="doc">Doc</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                             <Input 
                                placeholder="Title (e.g. Figma Design)" 
                                value={newResTitle}
                                onChange={(e) => setNewResTitle(e.target.value)}
                             />
                        </div>
                     </div>
                     <Input 
                        placeholder="URL (https://...)" 
                        value={newResUrl}
                        onChange={(e) => setNewResUrl(e.target.value)}
                     />
                     <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="sm" onClick={() => setShowResForm(false)}>Cancel</Button>
                         <Button size="sm" onClick={addResource} disabled={!newResTitle || !newResUrl}>Add</Button>
                     </div>
                 </div>
             )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isSubmitting || !message.trim()}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log Work
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
