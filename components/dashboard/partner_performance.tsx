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
        <CardTitle>Top Performing Partners</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.name}>
                <TableCell>{partner.name}</TableCell>
                <TableCell>{partner.rating}</TableCell>
                <TableCell>{partner.jobs}</TableCell>
                <TableCell>{partner.earnings}</TableCell>
                <TableCell>
                  <Badge variant={partner.status === "active" ? "default" : "secondary"}>{partner.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}