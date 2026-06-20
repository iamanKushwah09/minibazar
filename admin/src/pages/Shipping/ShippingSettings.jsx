import React, { useState, useEffect } from 'react';
import { Card, CardBody, Select, Button, Label } from '@windmill/react-ui';
import PageTitle from '@/components/Typography/PageTitle';
import { useGetShippingSettingsQuery, useUpdateShippingSettingsMutation } from '@/reduxStore/slice/shippingApiSlice';
import { toast } from 'react-toastify';

const ShippingSettings = () => {
  const { data, isLoading } = useGetShippingSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateShippingSettingsMutation();
  const [strategy, setStrategy] = useState('both');

  useEffect(() => {
    if (data && data.data) {
      setStrategy(data.data.shippingStrategy);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({ shippingStrategy: strategy }).unwrap();
      toast.success('Shipping strategy updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update strategy');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <PageTitle>Shipping Strategy Settings</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Label>
              <span>Active Shipping Strategy</span>
              <Select className="mt-1" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                <option value="distance">Distance Based</option>
                <option value="order">Order Amount Based</option>
                <option value="both">Distance + Order Amount</option>
              </Select>
            </Label>
            <div>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Strategy'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default ShippingSettings;
