fetch('http://localhost:3000/api/orders/6a8550b382a4bc7f3ef22949/refund', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bankName: 'SBI',
    accountHolder: 'Jyothi',
    accountNumber: '090987238723H',
    ifscCode: 'SBI9830984F'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
