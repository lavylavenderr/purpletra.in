"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "../_trpc/client";
import { Link } from "@prisma/client";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

export function LinkTable() {
  const [open, setOpen] = useState<boolean>(false);

  const {
    data: linkData,
    isLoading: linksLoading,
    refetch: refetchLinks,
  } = trpc.links.getAllLinks.useQuery();

  const { mutateAsync: deleteLink, loading: isDeleteLoading } =
    trpc.links.deleteLink.useMutation();
  const handleDelete = async (id: number) => {
    await deleteLink(
      { linkId: id },
      {
        onSuccess: () => {
          toast.success("Link deleted!", {
            position: "bottom-right",
          });
          refetchLinks();
        },
      }
    );
  };

  return linksLoading ? (
    <Loader2 className="animate-spin flex mx-auto h-12 w-12 mt-10" />
  ) : (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Original URL</TableHead>
              <TableHead>Shortened URL</TableHead>
              <TableHead className="w-12">Hits</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {linkData &&
              linkData.map((link: Link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.link}</TableCell>
                  <TableCell>{link.shortUrl}</TableCell>
                  <TableCell className="text-center">{link.hits}</TableCell>
                  <TableCell className="cursor-pointer">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button variant={"ghost"} className="pl-3 flex">
                          {isDeleteLoading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500 ml-1" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          remove this link.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(link.id)}
                            className="bg-[#6600FF]"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
