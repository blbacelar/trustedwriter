"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { Copy, ExternalLink, Search, Edit2, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

interface Application {
  id: string;
  content: string;
  listingUrl: string;
  createdAt: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onCopy: (text: string) => void;
  onUpdate: (application: Application) => void;
}

export default function ApplicationsTable({ applications, onCopy, onUpdate }: ApplicationsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const stripHtml = (html: string) => {
    // Replace paragraph breaks with double newlines
    const withLineBreaks = html.replace(/<\/p><p>/g, '\n\n');
    // Create DOM parser
    const doc = new DOMParser().parseFromString(withLineBreaks, 'text/html');
    // Get text content
    const textContent = doc.body.textContent || '';
    // Clean up extra whitespace but preserve intentional line breaks
    return textContent.replace(/\n{3,}/g, '\n\n').trim();
  };

  const handleSaveEdit = async (content: string) => {
    try {
      const response = await fetch(`/api/applications/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update application');
      }

      const updatedApplication = await response.json();
      
      onUpdate(updatedApplication);
      
      toast.success(t("dashboard.table.editSuccess"));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update application:', error);
      toast.error(t("dashboard.table.editError"));
    }
  };

  const filteredApplications = applications.filter(app => 
    app.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.listingUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{t("dashboard.table.editTitle")}</h2>
              <button
                onClick={() => setEditingId(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <RichTextEditor
              initialContent={applications.find(app => app.id === editingId)?.content || ""}
              onSave={handleSaveEdit}
              onCancel={() => setEditingId(null)}
              onCopy={onCopy}
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder={t("dashboard.table.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.table.date")}</TableHead>
              <TableHead>{t("dashboard.table.content")}</TableHead>
              <TableHead>{t("dashboard.table.listing")}</TableHead>
              <TableHead className="text-right">{t("dashboard.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {stripHtml(application.content)}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {application.listingUrl}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(application.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title={t("dashboard.table.edit")}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onCopy(application.content)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title={t("dashboard.table.copy")}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={application.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title={t("dashboard.table.view")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
