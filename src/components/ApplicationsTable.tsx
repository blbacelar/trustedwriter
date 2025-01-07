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
import { formatDistanceToNow, format } from "date-fns";
import { Copy, ExternalLink, Search, Edit2, X, RefreshCcw } from "lucide-react";
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
  onSelect: (id: string) => void;
  selectedId: string | null;
  onRefresh: () => Promise<void>;
}

export default function ApplicationsTable({
  applications,
  onSelect,
  selectedId,
  onRefresh,
}: ApplicationsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const stripHtml = (html: string) => {
    const withLineBreaks = html.replace(/<\/p><p>/g, "\n\n");
    const doc = new DOMParser().parseFromString(withLineBreaks, "text/html");
    const textContent = doc.body.textContent || "";
    return textContent.replace(/\n{3,}/g, "\n\n").trim();
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = async (content: string) => {
    if (!editingId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      toast.success(t("dashboard.table.editSuccess"));
      setEditingId(null);

      // First wait for the save operation to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Then refresh the table
      await onRefresh();
    } catch (error) {
      toast.error(t("dashboard.table.editError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCopy = async (text: string) => {
    // Strip HTML tags but preserve line breaks
    const cleanText = stripHtml(text);
    await navigator.clipboard.writeText(cleanText);
    toast.success(t("dashboard.table.copySuccess"));
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.listingUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-8">
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {t("dashboard.table.editTitle")}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <RichTextEditor
              initialContent={
                applications.find((app) => app.id === editingId)?.content || ""
              }
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              onCopy={handleCopy}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder={t("dashboard.table.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={onRefresh}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={t("dashboard.applications.refresh")}
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="md:hidden space-y-4">
        {filteredApplications.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(app.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(app.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleCopy(app.content)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-700 line-clamp-3 mb-3">
              {stripHtml(app.content)}
            </div>

            <a
              href={app.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              {new URL(app.listingUrl).hostname}
            </a>
          </div>
        ))}
      </div>

      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.table.date")}</TableHead>
              <TableHead>{t("dashboard.table.content")}</TableHead>
              <TableHead>{t("dashboard.table.listing")}</TableHead>
              <TableHead className="text-right">
                {t("dashboard.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {format(new Date(application.createdAt), "MMM d, yyyy HH:mm")}
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
                      onClick={() => handleCopy(application.content)}
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
