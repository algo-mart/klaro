import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";

const PaymentRecords = () => {
  const [records, setRecords] = useState([
    { id: 1, name: "John Doe", amount: "$200" },
    { id: 2, name: "Jane Smith", amount: "$350" },
    { id: 3, name: "Alice Johnson", amount: "$500" },
  ]);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const handleEdit = (id) => {
    alert(`Edit record with ID: ${id}`);
  };

  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Payment Records</h1>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Table className="table-auto w-full border-collapse border border-gray-200">
            <Thead>
              <Tr className="bg-gray-100">
                <Th className="p-3 border border-gray-200">Name</Th>
                <Th className="p-3 border border-gray-200">Amount</Th>
                <Th className="p-3 border border-gray-200">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredRecords.map((record) => (
                <Tr key={record.id} className="hover:bg-gray-50">
                  <Td className="p-3 border border-gray-200">{record.name}</Td>
                  <Td className="p-3 border border-gray-200">{record.amount}</Td>
                  <Td className="p-3 border border-gray-200 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(record.id)}
                      className="flex items-center gap-2"
                    >
                      <Edit size={16} /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRecords;