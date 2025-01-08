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
import { format } from "date-fns";
import { Copy, ExternalLink, Edit2, Search } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={t("dashboard.table.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div className="rounded-xl border bg-white/50 backdrop-blur-sm shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px] font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Content</TableHead>
              <TableHead className="w-[100px] text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((application) => (
              <TableRow
                key={application.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-medium text-gray-900">
                  {format(new Date(application.createdAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="max-w-md truncate text-gray-600">
                  {application.content}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelect?.(application.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(application.content);
                        toast.success(t("dashboard.table.copySuccess"));
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <a
                      href={application.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
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
            className="h-8"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="h-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
