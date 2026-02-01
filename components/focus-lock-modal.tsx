"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatLockExpiry, getNextSundayExpiry } from "@/lib/focus-lock";
import { Lock, Loader2 } from "lucide-react";

interface FocusLockModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ideaTitle: string;
  isLoading?: boolean;
}

export function FocusLockModal({
  open,
  onClose,
  onConfirm,
  ideaTitle,
  isLoading = false,
}: FocusLockModalProps) {
  const lockExpiresAt = getNextSundayExpiry();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <DialogTitle>Weekly Focus Commitment</DialogTitle>
          <DialogDescription>
            You are about to commit to working on this idea for one week
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Idea Name */}
          <div className="rounded-md bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-600 mb-1">
              Committed Idea
            </p>
            <p className="text-lg font-semibold text-zinc-900">{ideaTitle}</p>
          </div>

          {/* Lock Details */}
          <div className="rounded-md bg-amber-50 p-4 space-y-2">
            <p className="text-sm font-medium text-amber-900">
              Lock Expires: {formatLockExpiry(lockExpiresAt)}
            </p>
          </div>

          {/* Rules */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-700">
              Focus Lock Rules:
            </p>
            <ul className="space-y-1 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span>
                  You cannot activate another idea until the lock expires
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span>
                  Other ideas become read-only during the lock period
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">•</span>
                <span>
                  This prevents idea-hopping and enforces focused execution
                </span>
              </li>
            </ul>
          </div>

          {/* Guardrail Philosophy */}
          <div className="rounded-md border border-zinc-200 p-4 bg-white">
            <p className="text-xs text-zinc-600 italic">
              "Guardrail is not about finding the best idea. It's about
              protecting your attention."
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activating...
              </>
            ) : (
              "I Understand - Activate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
