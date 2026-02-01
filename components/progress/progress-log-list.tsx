"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";

interface Resource {
  type: 'link' | 'image' | 'doc';
  title: string;
  url: string;
}

interface ProgressLog {
  id: string;
  message: string;
  loggedAt: number;
  resources: Resource[];
}

interface ProgressLogListProps {
  logs: ProgressLog[];
}

export function ProgressLogList({ logs }: ProgressLogListProps) {
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => b.loggedAt - a.loggedAt);

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500">No progress logged yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full max-h-[500px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Progress History</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-6">
          {sortedLogs.map((log) => (
            <div key={log.id} className="relative pl-6 pb-2 border-l border-zinc-200 last:border-0">
              <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400">
                  {new Date(log.loggedAt).toLocaleDateString()} at {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <p className="text-sm text-zinc-800 font-medium">{log.message}</p>
                
                {log.resources && Array.isArray(log.resources) && log.resources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {log.resources.map((resource, idx) => (
                      <a 
                        key={idx} 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-600 transition-colors border"
                      >
                        {resource.type === 'link' && <ExternalLink className="h-3 w-3" />}
                        {resource.type === 'doc' && <FileText className="h-3 w-3" />}
                        {resource.type === 'image' && <ImageIcon className="h-3 w-3" />}
                        <span className="truncate max-w-[150px]">{resource.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
