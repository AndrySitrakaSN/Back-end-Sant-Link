import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  return null; // redirect() throws an error, so this won't be reached.
}
