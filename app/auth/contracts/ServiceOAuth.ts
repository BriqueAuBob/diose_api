export default interface ServiceOAuth<T, G> {
  authorizeUser(user: T): Promise<G>
}
