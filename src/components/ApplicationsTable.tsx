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

export default function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("dashboard.copied.title"));
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.listingUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-4">
      {/* <h2 className="text-lg font-semibold mb-4">{t("dashboard.table.title")}</h2> */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? t("dashboard.table.noResults")
                          : t("dashboard.table.noApplications")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {formatDistanceToNow(
                            new Date(application.createdAt),
                            { addSuffix: true }
                          )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
