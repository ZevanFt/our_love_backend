const Router = require('@koa/router');
const { auth } = require('../middleware/auth.middleware');
const { uploadImage } = require('../utils/image.util');

const router = new Router({ prefix: '/upload' });

router.post('/products', auth, uploadImage);

router.post('/avatar', auth, uploadImage);

router.post('/carousel', auth, uploadImage);

module.exports = router;
