import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const registerSchema = schema.create({
        email: schema.string({}, [rules.email()]),
        fullName: schema.string(),
        password: schema.string(),
        country: schema.enum(['Kenya', 'Uganda', 'Tanzania'] as const),
      })
      const data = await request.validate({ schema: registerSchema })
      const user = await User.create(data)
      return response.status(200).json({
        success: true,
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'User created failed',
        error,
      })
    }
  }
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      const loginSchema = schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string(),
      })
      const { email, password } = await request.validate({ schema: loginSchema })
      try {
        const token = await auth.use('api').attempt(email, password)
        return response.status(200).json({
          success: true,
          message: 'User login successfully',
          data: token,
        })
      } catch (error) {
        return response.status(400).json({
          success: false,
          message: 'Wrong Email or Password',
        })
      }
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'User login failed',
        error,
      })
    }
  }
  public async users() {
    return User.all()
  }
}
