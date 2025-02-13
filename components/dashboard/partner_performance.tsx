"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

const partners = [
  {
    name: "John Doe",
    rating: 4.8,
    jobs: 125,
    earnings: "$3,450",
    status: "active",
  },
  {
    name: "Jane Smith",
    rating: 4.9,
    jobs: 98,
    earnings: "$2,890",
    status: "active",
  },
  {
    name: "Mike Johnson",
    rating: 4.7,
    jobs: 78,
    earnings: "$2,100",
    status: "inactive",
  },
];

export function PartnerPerformance() {
  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle>
          <span className="text-black">Top Performing Partners</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="text-black">Name</span>
              </TableHead>
              <TableHead>
                <span className="text-black">Rating</span>
              </TableHead>
              <TableHead>
                <span className="text-black">Jobs</span>
              </TableHead>
              <TableHead>
                <span className="text-black">Earnings</span>
              </TableHead>
              <TableHead>
                <span className="text-black">Status</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.name}>
                <TableCell>
                  <span className="text-black">{partner.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-black">{partner.rating}</span>
                </TableCell>
                <TableCell>
                  <span className="text-black">{partner.jobs}</span>
                </TableCell>
                <TableCell>
                  <span className="text-black">{partner.earnings}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={partner.status === "active" ? "default" : "secondary"}>
                    <span className="text-black">{partner.status}</span>
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}