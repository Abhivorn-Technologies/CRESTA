fetch('http://localhost:3000/api/orders/6a8570eb82a4bc7f3ef22980', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderStatus: 'cancelled' })
}).then(async res => {
  console.log("Status:", res.status);
  console.log("Body:", await res.json());
}).catch(console.error);
