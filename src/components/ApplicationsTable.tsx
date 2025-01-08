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
import { Copy, ExternalLink, Edit2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Application {
  id: string;
  content: string;
  listingUrl: string;
  createdAt: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  onRefresh?: () => void;
}

export default function ApplicationsTable({
  applications,
  onSelect,
  selectedId,
  onRefresh,
}: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const { t } = useLanguage();

  const filteredApplications = applications.filter(
    (app) =>
      app.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.listingUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder={t("dashboard.table.search")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Listing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {format(new Date(application.createdAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {application.content}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {application.listingUrl}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onSelect?.(application.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(application.content);
                        toast.success(t("dashboard.table.copySuccess"));
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={application.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
