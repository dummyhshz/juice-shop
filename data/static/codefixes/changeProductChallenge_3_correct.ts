/**
 * =========================
 * Authorization Middleware
 * =========================
 */
const requireAuth = security.isAuthorized
const requireAccounting = security.isAccounting
const denyAll = security.denyAll

/**
 * =========================
 * Basket & Basket Items
 * =========================
 */

// Basket (REST)
app.use('/rest/basket', requireAuth(), security.appendUserId())
app.use('/rest/basket/:id', requireAuth())
app.use('/rest/basket/:id/order', requireAuth())

// Basket Items
app.get('/api/BasketItems', requireAuth())

app.post(
  '/api/BasketItems',
  requireAuth(),
  security.appendUserId(),
  basketItems.quantityCheckBeforeBasketItemAddition(),
  basketItems.addBasketItem()
)

app.put(
  '/api/BasketItems/:id',
  requireAuth(),
  security.appendUserId(),
  basketItems.quantityCheckBeforeBasketItemUpdate()
)

app.delete('/api/BasketItems/:id', denyAll())

/**
 * =========================
 * Feedbacks
 * =========================
 */

// Public GET (carousel)
app.get('/api/Feedbacks/:id', security.allowPublic())

// No modification of feedbacks
app.post('/api/Feedbacks', denyAll())
app.put('/api/Feedbacks/:id', denyAll())
app.delete('/api/Feedbacks/:id', denyAll())

/**
 * =========================
 * Users
 * =========================
 */

// Registration allowed
app.post('/api/Users', security.allowRegistration())

// Protected access
app.get('/api/Users', requireAuth())

app.route('/api/Users/:id')
  .get(requireAuth())
  .put(denyAll())
  .delete(denyAll())

/**
 * =========================
 * Products (Read-only)
 * =========================
 */

app.get('/api/Products', security.allowPublic())
app.get('/api/Products/:id', security.allowPublic())

app.post('/api/Products', denyAll())
app.put('/api/Products/:id', denyAll())
app.delete('/api/Products/:id', denyAll())

/**
 * =========================
 * Challenges
 * =========================
 */

app.get('/api/Challenges', security.allowPublic())
app.post('/api/Challenges', denyAll())
app.use('/api/Challenges/:id', denyAll())

/**
 * =========================
 * Complaints
 * =========================
 */

app.get('/api/Complaints', requireAuth())
app.post('/api/Complaints', requireAuth())
app.use('/api/Complaints/:id', denyAll())

/**
 * =========================
 * Recycles
 * =========================
 */

// GET list – business logic decides access
app.get('/api/Recycles', recycles.blockRecycleItems())

// Create recycle
app.post('/api/Recycles', requireAuth())

// View single recycle
app.get('/api/Recycles/:id', recycles.getRecycleItem())

// No updates or deletes
app.put('/api/Recycles/:id', denyAll())
app.delete('/api/Recycles/:id', denyAll())

/**
 * =========================
 * Security Questions & Answers
 * =========================
 */

app.get('/api/SecurityQuestions', security.allowPublic())
app.post('/api/SecurityQuestions', denyAll())
app.use('/api/SecurityQuestions/:id', denyAll())

app.post('/api/SecurityAnswers', security.allowPublic())
app.get('/api/SecurityAnswers', denyAll())
app.use('/api/SecurityAnswers/:id', denyAll())

/**
 * =========================
 * B2B API
 * =========================
 */

app.use('/b2b/v2', requireAuth())

/**
 * =========================
 * Quantity (Accounting Only)
 * =========================
 */

app.use(
  '/api/Quantitys/:id',
  requireAuth(),
  requireAccounting(),
  IpFilter(['123.456.789'], { mode: 'allow' })
)

app.post('/api/Quantitys', denyAll())
app.delete('/api/Quantitys/:id', denyAll())

/**
 * =========================
 * Privacy Requests
 * =========================
 */

app.post('/api/PrivacyRequests', requireAuth())
app.get('/api/PrivacyRequests', denyAll())
app.use('/api/PrivacyRequests/:id', denyAll())

/**
 * =========================
 * Payment Cards (IDOR-SAFE)
 * =========================
 */

app.post('/api/Cards', requireAuth(), security.appendUserId())

app.get(
  '/api/Cards',
  requireAuth(),
  security.appendUserId(),
  payment.getPaymentMethods
)

app.get(
  '/api/Cards/:id',
  requireAuth(),
  security.appendUserId(),
  payment.getPaymentMethodById
)

app.delete(
  '/api/Cards/:id',
  requireAuth(),
  security.appendUserId(),
  payment.delPaymentMethodById
)

app.put('/api/Cards/:id', denyAll())

/**
 * =========================
 * Address
 * =========================
 */

app.post('/api/Addresss', requireAuth(), security.appendUserId())

app.get(
  '/api/Addresss',
  requireAuth(),
  security.appendUserId(),
  address.getAddress
)

app.get(
  '/api/Addresss/:id',
  requireAuth(),
  security.appendUserId(),
  address.getAddressById
)

app.put('/api/Addresss/:id', requireAuth(), security.appendUserId())

app.delete(
  '/api/Addresss/:id',
  requireAuth(),
  security.appendUserId(),
  address.delAddressById
)

/**
 * =========================
 * Delivery
 * =========================
 */

app.get('/api/Deliverys', delivery.getDeliveryMethods())
app.get('/api/Deliverys/:id', delivery.getDeliveryMethod())
