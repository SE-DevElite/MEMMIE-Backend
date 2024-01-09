export default interface IUserRequest extends Request {
  email: string;
  password?: string;
}
