'use strict';
const { Model } = require('sequelize');

/**
 * @openapi
 * components:
 *   schemas:
 *     signUp:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: Juan
 *         last_name:
 *           type: string
 *           example: Perez
 *         email:
 *           type: string
 *           example: juan@gmail.com
 *         password:
 *           type: string
 *           example: 12345
 *     schemaValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Schema Validation Error
 *         errorName:
 *           type: string
 *           example: Bad Request
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "\"email\" is required"
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: email
 *               type:
 *                 type: string
 *                 example: any.required
 *               context:
 *                 type: object
 *                 properties:
 *                   label:
 *                     type: string
 *                     example: email
 *                   key:
 *                     type: string
 *                     example: email
 *     signUpConflictError:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: string
 *           example: 409
 *         name:
 *           type: string
 *           example: SequelizeUniqueConstraintError
 *         message:
 *           type: string
 *           example: llave duplicada viola restricción de unicidad «users_email_key»
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *             example: ''
 *     login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: juan@gmail.com
 *         password:
 *           type: string
 *           example: 12345
 *     loginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Correct Credentials
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *     notFoundResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Not found User
 *         errorName:
 *           type: string
 *           example: Not Found
 *     unauthorizedResponse:
 *       type: object
 *       properties:
 *         errorName:
 *           type: string
 *           example: Unauthorized
 *         message:
 *           type: string
 *           example: Wrong Credentials
 */

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Countries, {
        as: 'country',
        foreignKey: 'country_id',
      });
      Users.hasMany(models.Profiles, { as: 'profiles', foreignKey: 'user_id' });
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        // type: DataTypes.BIGINT,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      username: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email_verified: {
        type: DataTypes.DATE,
      },
      token: {
        type: DataTypes.TEXT,
      },
      code_phone: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      country_id: DataTypes.INTEGER,
      image_url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Users',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      scopes: {
        view_public: {
          attributes: [
            'id',
            'first_name',
            'last_name',
            'country_id',
            'image_url',
          ],
        },
        view_same_user: {
          attributes: [
            'id',
            'first_name',
            'last_name',
            'country_id',
            'image_url',
            'email',
            'username',
            'code_phone',
            'phone',
          ],
        },
        auth_flow: {
          attributes: ['id', 'first_name', 'last_name', 'email', 'username'],
        },
        view_me: {
          attributes: [
            'id',
            'first_name',
            'last_name',
            'email',
            'username',
            'image_url',
          ],
        },
      },
      hooks: {
        beforeCreate: (user, options) => {
          if (user.email) {
            let emailLowercase = String(user.email).toLocaleLowerCase();
            user.email = emailLowercase;
            user.username = emailLowercase;
          }
        },
      },
    }
  );
  return Users;
};
