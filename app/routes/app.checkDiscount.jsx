// src/components/ApplyDiscountForm.jsx

import { useState } from 'react';
import { useFetcher } from '@remix-run/react';

export const ApplyDiscountForm = () => {
  const [orderId, setOrderId] = useState('');
  const fetcher = useFetcher();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetcher.submit({ orderId }, { method: 'POST' });
  };

  return (
    <fetcher.Form method="post">
      <input
        type="text"
        name="orderId"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <button type="submit">Apply Discount</button>
    </fetcher.Form>
  );
};
