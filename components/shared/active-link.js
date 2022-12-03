import Link from 'next/link'
import { useRouter } from 'next/router'


export default function ActiveLink({ href, children }) {

  const { asPath } = useRouter()
  const style = asPath === href
    ? 'bg-gray-500 text-white hover:text-gray-50 '
    : 'bg-gray-100 text-gray-600 hover:text-gray-700'

  return (
    <Link href={href} className={`${style} p-1 rounded-lg no-underline w-full`}>
      {children}
    </Link>
  )
}
