import Link from 'next/link'
import { useRouter } from 'next/router'

export default function ActiveLink({ href, children }) {

  const { asPath } = useRouter()
  const style = asPath === href
    ? 'bg-gray-500 p-1 rounded-lg text-white hover:text-gray-50 no-underline w-full'
    : 'bg-gray-100 p-1 rounded-lg text-gray-600 hover:text-gray-700 no-underline w-full'

  return (
    <Link href={href} >
      <a className={style}>
        {children}
      </a>
    </Link>
  )
}
