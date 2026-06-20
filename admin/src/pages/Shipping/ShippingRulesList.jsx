import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Table, TableHeader, TableCell, TableBody, TableRow, TableContainer, Badge } from '@windmill/react-ui';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import PageTitle from '@/components/Typography/PageTitle';
import { useGetShippingRulesQuery, useDeleteShippingRuleMutation } from '@/reduxStore/slice/shippingApiSlice';
import { toast } from 'react-toastify';

const ShippingRulesList = () => {
  const { data, isLoading, refetch } = useGetShippingRulesQuery();
  const [deleteRule] = useDeleteShippingRuleMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await deleteRule(id).unwrap();
        toast.success('Rule deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete rule');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const rules = data?.data || [];

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Shipping Rules</PageTitle>
        {/* We will route to /shipping-rules/add */}
      </div>

      <TableContainer className="mb-8 mt-4">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Type</TableCell>
              <TableCell>Distance (KM)</TableCell>
              <TableCell>Order Price</TableCell>
              <TableCell>Charge</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule._id}>
                <TableCell><span className="capitalize">{rule.ruleType}</span></TableCell>
                <TableCell>{rule.startKm !== null ? `${rule.startKm} - ${rule.endKm}` : 'N/A'}</TableCell>
                <TableCell>{rule.startOrderPrice !== null ? `₹${rule.startOrderPrice} - ₹${rule.endOrderPrice}` : 'N/A'}</TableCell>
                <TableCell>₹{rule.shippingCharge}</TableCell>
                <TableCell>
                  <Badge type={rule.status === 'active' ? 'success' : 'danger'}>{rule.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Delete" onClick={() => handleDelete(rule._id)}>
                      <FiTrash2 className="w-5 h-5 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ShippingRulesList;
