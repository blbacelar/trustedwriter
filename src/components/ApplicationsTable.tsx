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
import { Copy, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Application {
  id: string;
  content: string;
  listingUrl: string;
  createdAt: string;
}

export default function ApplicationsTable({ applications }: { applications: Application[] }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("dashboard.copied.title"));
  };

  const filteredApplications = applications.filter(app => 
    app.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.listingUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={t("dashboard.table.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#00B5B4] text-sm"
          />
        </div>
      </div>
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
          {filteredApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                {searchTerm ? t("dashboard.table.noResults") : t("dashboard.table.noApplications")}
              </TableCell>
            </TableRow>
          ) : (
            filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="max-w-md truncate">{application.content}</TableCell>
                <TableCell className="max-w-xs truncate">{application.listingUrl}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 