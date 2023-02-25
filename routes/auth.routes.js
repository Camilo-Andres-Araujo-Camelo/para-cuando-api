const express = require('express');
const router = express.Router();

const passport = require('../libs/passport');

const verifySchema = require('../schemas/joiSchema.checker');
const {
  signupSchema,
  forgetPasswordSchema,
  restorePasswordSchema,
} = require('../schemas/auth.schemas');

const {
  signUp,
  logIn,
  forgetPassword,
  restorePassword,
  userToken,
} = require('../controllers/auth.controller');

/**
 * @openapi
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: create a new user into application
 *     tags: [Auth]
 *     requestBody:
 *       description: Required files to create a new user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signUp'
 *     responses:
 *       201:
 *         description: Success Sign Up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: string
 *                   example: Success Sign Up
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/schemaValidationError'
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signUpConflictError'
 * /api/v1/auth/login:
 *   post:
 *     summary: login a existing user into the application
 *     tags: [Auth]
 *     requestBody:
 *       description: Required files to login a existing user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       201:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/loginResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       400:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email not given / Password not provided for compare
 *                 errorName:
 *                   type: string
 *                   example: Bad Request
 * /api/v1/auth/forget-password:
 *   post:
 *     summary: send token to user email to change password
 *     tags: [Auth]
 *     requestBody:
 *       description: Required files to send token to user email to change password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@gmail.com
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Email sended!, check your inbox
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 * /api/v1/auth/change-password/:token:
 *   post:
 *     summary: change password
 *     tags: [Auth]
 *     requestBody:
 *       description: Required files to change password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 */

// Rutas
router.post('/sign-up', verifySchema(signupSchema, 'body'), signUp);

router.post('/login', logIn);

router.post(
  '/forget-password',
  verifySchema(forgetPasswordSchema, 'body'),
  forgetPassword
);

router.post(
  '/change-password/:token',
  verifySchema(restorePasswordSchema, 'body'),
  restorePassword
);

router.get('/me', passport.authenticate('jwt', { session: false }), userToken);

router.get(
  '/testing',
  passport.authenticate('jwt', { session: false }),
  async (request, response, next) => {
    try {
      return response.status(200).json({
        results: {
          user: request.user,
          isAuthenticated: request.isAuthenticated(),
          isUnauthenticated: request.isUnauthenticated(),
          _sessionManager: request._sessionManager,
          authInfo: request.authInfo,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = router;
