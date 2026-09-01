const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: '6a85507c82a4bc7f3ef22944' }, '4a9aa2501744d330d2df4248a5df9bb5cbdfee09a791248da0bcdf5f6094d665aee1ffbc35b25fccb32149d19abf7d91');
const decoded = jwt.verify(token, '4a9aa2501744d330d2df4248a5df9bb5cbdfee09a791248da0bcdf5f6094d665aee1ffbc35b25fccb32149d19abf7d91');
console.log(decoded.userId === '6a85507c82a4bc7f3ef22944');
