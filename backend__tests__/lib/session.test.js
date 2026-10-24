'use strict';

jest.mock('cl.jotacalderon.cf.framework/lib/log', () => () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const session = require('../../backend/lib/session');

describe('backend/lib/session', () => {
  let req, res;

  beforeEach(() => {
    req = {
      session: {
        destroy: jest.fn((cb) => cb(null)),
      },
      headers: {
        'user-agent': 'jest-test-agent',
        'x-forwarded-for': '10.0.0.1',
        host: 'usuarios.jotace.cl',
      },
      ip: '127.0.0.1',
    };
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería setear la cookie Authorization', () => {
      session.create(req, res, 'token123', 'user@mail.com');
      expect(res.cookie).toHaveBeenCalledWith('Authorization', 'token123', expect.any(Object));
    });

    it('debería generar tracking si cookie y email están presentes', () => {
      session.create(req, res, 'token123', 'user@mail.com');
      expect(req.session.email).toBe('user@mail.com');
      expect(req.session.loginTime).toBeDefined();
      expect(req.session.userAgent).toBe('jest-test-agent');
      expect(req.session.ip).toBe('127.0.0.1||10.0.0.1');
    });

    it('no debería generar tracking si falta el cookie', () => {
      session.create(req, res, null, 'user@mail.com');
      expect(req.session.email).toBeUndefined();
    });

    it('no debería generar tracking si falta el email', () => {
      session.create(req, res, 'token123', null);
      expect(req.session.email).toBeUndefined();
    });
  });

  describe('destroy', () => {
    it('debería destruir la sesión', () => {
      session.destroy(req, res);
      expect(req.session.destroy).toHaveBeenCalled();
    });

    it('debería limpiar la cookie Authorization', () => {
      session.destroy(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('Authorization', expect.any(Object));
    });

    it('debería manejar error al destruir la sesión sin lanzar excepción', () => {
      req.session.destroy = jest.fn((cb) => cb(new Error('fallo sesion')));
      expect(() => session.destroy(req, res)).not.toThrow();
    });
  });
});
